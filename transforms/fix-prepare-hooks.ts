import type { Transform } from 'jscodeshift'

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  // fix imports
  root.find(j.ImportDeclaration, { source: { value: 'wagmi' } })
    .forEach(path => {
      const specifiers = path.node.specifiers ?? []
      specifiers.forEach(s => {
        if (s.type !== 'ImportSpecifier') return
        if (s.imported.type !== 'Identifier') return

        if (s.imported.name === 'usePrepareContractWrite') {
          s.imported.name = 'useSimulateContract'
          if (s.local && s.local.name === 'usePrepareContractWrite') {
            s.local.name = 'useSimulateContract'
          }
          changed = true
        }

        if (s.imported.name === 'usePrepareSendTransaction') {
          s.imported.name = 'useEstimateGas'
          if (s.local && s.local.name === 'usePrepareSendTransaction') {
            s.local.name = 'useEstimateGas'
          }
          changed = true
        }
      })
    })

  // fix usePrepareContractWrite -> useSimulateContract in code
  root.find(j.Identifier, { name: 'usePrepareContractWrite' })
    .forEach(path => {
      path.node.name = 'useSimulateContract'
      changed = true
    })

  // fix usePrepareSendTransaction -> useEstimateGas in code
  root.find(j.Identifier, { name: 'usePrepareSendTransaction' })
    .forEach(path => {
      path.node.name = 'useEstimateGas'
      changed = true
    })

  // fix: const { config } = useSimulateContract() -> const { data } = useSimulateContract()
  // and track the old variable name so we can rename its usages
  const renamedVars: Record<string, string> = {}

  root.find(j.VariableDeclarator)
    .forEach(path => {
      if (
        path.node.init?.type === 'CallExpression' &&
        path.node.init.callee.type === 'Identifier' &&
        path.node.init.callee.name === 'useSimulateContract' &&
        path.node.id.type === 'ObjectPattern'
      ) {
        const properties = path.node.id.properties as any[]
        properties.forEach((p: any) => {
          if (p.key?.name === 'config') {
            const localName = p.value?.name || 'config'
            p.key.name = 'data'
            if (p.value?.name === 'config') {
              p.value.name = 'data'
            }
            renamedVars[localName] = 'data'
            changed = true
          }
        })
      }
    })

  // rename all usages of the old config variable to data
  Object.entries(renamedVars).forEach(([oldName, newName]) => {
    root.find(j.Identifier, { name: oldName })
      .forEach(path => {
        const parentType = path.parent.node.type
        // skip import specifiers and object keys
        if (
          parentType !== 'ImportSpecifier' &&
          parentType !== 'ObjectProperty' &&
          parentType !== 'Property'
        ) {
          path.node.name = newName
          changed = true
        }
      })
  })

  return changed ? root.toSource({ quote: 'single' }) : null
}

export default transform
