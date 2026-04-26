import type { Transform } from 'jscodeshift'

const hookRenames: Record<string, string> = {
  useContractRead: 'useReadContract',
  useContractReads: 'useReadContracts',
  useContractWrite: 'useWriteContract',
  useContractEvent: 'useWatchContractEvent',
  useContractInfiniteReads: 'useInfiniteReadContracts',
  useFeeData: 'useEstimateFeesPerGas',
  useSwitchNetwork: 'useSwitchChain',
  useWaitForTransaction: 'useWaitForTransactionReceipt',
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  root.find(j.ImportDeclaration, { source: { value: 'wagmi' } })
    .forEach(path => {
      path.node.specifiers?.forEach(specifier => {
        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          hookRenames[specifier.imported.name]
        ) {
          const oldName = specifier.imported.name
          const newName = hookRenames[oldName]
          specifier.imported.name = newName
          if (specifier.local && specifier.local.name === oldName) {
            specifier.local.name = newName
          }
          changed = true
        }
      })
    })

  Object.entries(hookRenames).forEach(([oldName, newName]) => {
    root.find(j.Identifier, { name: oldName })
      .forEach(path => {
        path.node.name = newName
        changed = true
      })
  })

  return changed ? root.toSource({ quote: 'single' }) : null
}

export default transform
