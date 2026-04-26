import type { Transform } from 'jscodeshift'

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  // add useAccountEffect to imports if needed
  const addUseAccountEffect = () => {
    root.find(j.ImportDeclaration, { source: { value: 'wagmi' } })
      .forEach(path => {
        const specifiers = path.node.specifiers ?? []
        const hasIt = specifiers.some(s =>
          s.type === 'ImportSpecifier' &&
          s.imported.type === 'Identifier' &&
          s.imported.name === 'useAccountEffect'
        )
        if (!hasIt) {
          path.node.specifiers?.push(
            j.importSpecifier(j.identifier('useAccountEffect'))
          )
        }
      })
  }

  root.find(j.CallExpression, {
    callee: { type: 'Identifier', name: 'useAccount' }
  })
    .forEach(path => {
      const args = path.node.arguments
      if (args.length === 0) return

      const firstArg = args[0]
      if (firstArg.type !== 'ObjectExpression') return

      const properties = firstArg.properties as any[]

      const callbackProps = properties.filter((p: any) => {
        const keyName = p.key?.name || p.key?.value
        return keyName === 'onConnect' || keyName === 'onDisconnect'
      })

      const otherProps = properties.filter((p: any) => {
        const keyName = p.key?.name || p.key?.value
        return keyName !== 'onConnect' && keyName !== 'onDisconnect'
      })

      if (callbackProps.length === 0) return

      // update useAccount to remove callbacks
      if (otherProps.length === 0) {
        path.node.arguments = []
      } else {
        firstArg.properties = otherProps
      }

      // insert useAccountEffect call after the current statement
      const statement = j(path).closest(j.ExpressionStatement)
      if (statement.length > 0) {
        statement.insertAfter(
          j.expressionStatement(
            j.callExpression(
              j.identifier('useAccountEffect'),
              [j.objectExpression(callbackProps)]
            )
          )
        )
      }

      addUseAccountEffect()
      changed = true
    })

  return changed ? root.toSource({ quote: 'single' }) : null
}

export default transform
