import type { Transform } from 'jscodeshift'

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  root.find(j.ImportDeclaration, { source: { value: 'wagmi' } })
    .forEach(path => {
      const specifiers = path.node.specifiers ?? []
      const hasUseNetwork = specifiers.some(s =>
        s.type === 'ImportSpecifier' &&
        s.imported.type === 'Identifier' &&
        s.imported.name === 'useNetwork'
      )

      if (hasUseNetwork) {
        path.node.specifiers = specifiers.filter(s =>
          !(s.type === 'ImportSpecifier' &&
          s.imported.type === 'Identifier' &&
          s.imported.name === 'useNetwork')
        )

        const hasUseAccount = specifiers.some(s =>
          s.type === 'ImportSpecifier' &&
          s.imported.type === 'Identifier' &&
          s.imported.name === 'useAccount'
        )
        if (!hasUseAccount) {
          path.node.specifiers?.push(
            j.importSpecifier(j.identifier('useAccount'))
          )
        }

        const hasUseConfig = specifiers.some(s =>
          s.type === 'ImportSpecifier' &&
          s.imported.type === 'Identifier' &&
          s.imported.name === 'useConfig'
        )
        if (!hasUseConfig) {
          path.node.specifiers?.push(
            j.importSpecifier(j.identifier('useConfig'))
          )
        }

        changed = true
      }
    })

  root.find(j.VariableDeclarator)
    .forEach(path => {
      if (
        path.node.init?.type === 'CallExpression' &&
        path.node.init.callee.type === 'Identifier' &&
        path.node.init.callee.name === 'useNetwork' &&
        path.node.id.type === 'ObjectPattern'
      ) {
        const properties = path.node.id.properties as any[]
        let hasChainsKey = false

        for (const p of properties) {
          const keyName =
            p.key?.name ||
            p.key?.value ||
            (p.type === 'RestElement' ? null : null)
          if (keyName === 'chains') {
            hasChainsKey = true
            break
          }
        }

        if (hasChainsKey) {
          path.node.init.callee.name = 'useConfig'
        } else {
          path.node.init.callee.name = 'useAccount'
        }
        changed = true
      }
    })

  return changed ? root.toSource({ quote: 'single' }) : null
}

export default transform
