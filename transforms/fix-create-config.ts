import type { Transform } from 'jscodeshift'

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  // remove configureChains from imports
  root.find(j.ImportDeclaration, { source: { value: 'wagmi' } })
    .forEach(path => {
      const specifiers = path.node.specifiers ?? []
      const hasConfigureChains = specifiers.some(s =>
        s.type === 'ImportSpecifier' &&
        s.imported.type === 'Identifier' &&
        s.imported.name === 'configureChains'
      )

      if (hasConfigureChains) {
        path.node.specifiers = specifiers.filter(s =>
          !(s.type === 'ImportSpecifier' &&
          s.imported.type === 'Identifier' &&
          s.imported.name === 'configureChains')
        )

        // add http from viem if not present
        const viemImport = root.find(j.ImportDeclaration, {
          source: { value: 'viem' }
        })

        if (viemImport.length === 0) {
          j(path).insertAfter(
            j.importDeclaration(
              [j.importSpecifier(j.identifier('http'))],
              j.literal('viem')
            )
          )
        }

        changed = true
      }
    })

  // remove autoConnect from createConfig
  root.find(j.CallExpression, {
    callee: { type: 'Identifier', name: 'createConfig' }
  })
    .forEach(path => {
      const args = path.node.arguments
      if (args.length === 0) return

      const firstArg = args[0]
      if (firstArg.type !== 'ObjectExpression') return

      const properties = firstArg.properties as any[]

      const autoConnectProp = properties.find((p: any) => {
        const keyName = p.key?.name || p.key?.value
        return keyName === 'autoConnect'
      })

      if (autoConnectProp) {
        firstArg.properties = properties.filter((p: any) => {
          const keyName = p.key?.name || p.key?.value
          return keyName !== 'autoConnect' &&
                 keyName !== 'publicClient' &&
                 keyName !== 'webSocketPublicClient'
        })
        changed = true
      }
    })

  // remove wagmi/providers imports
  root.find(j.ImportDeclaration)
    .filter(path => {
      const source = path.node.source.value as string
      return source.startsWith('wagmi/providers')
    })
    .forEach(path => {
      j(path).remove()
      changed = true
    })

  return changed ? root.toSource({ quote: 'single' }) : null
}

export default transform
