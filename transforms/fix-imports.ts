import type { Transform } from 'jscodeshift'

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  // fix: import { mainnet, sepolia } from 'wagmi' -> from 'wagmi/chains'
  root.find(j.ImportDeclaration, { source: { value: 'wagmi' } })
    .forEach(path => {
      const chainNames = [
        'mainnet', 'sepolia', 'polygon', 'optimism', 'arbitrum',
        'bsc', 'avalanche', 'fantom', 'gnosis', 'celo'
      ]
      const specifiers = path.node.specifiers ?? []
      const chainSpecifiers = specifiers.filter(s =>
        s.type === 'ImportSpecifier' &&
        s.imported.type === 'Identifier' &&
        chainNames.includes(s.imported.name)
      )
      const otherSpecifiers = specifiers.filter(s =>
        !(s.type === 'ImportSpecifier' &&
        s.imported.type === 'Identifier' &&
        chainNames.includes(s.imported.name))
      )

      if (chainSpecifiers.length > 0) {
        if (otherSpecifiers.length === 0) {
          path.node.source.value = 'wagmi/chains'
        } else {
          path.node.specifiers = otherSpecifiers
          j(path).insertAfter(
            j.importDeclaration(chainSpecifiers, j.literal('wagmi/chains'))
          )
        }
        changed = true
      }
    })

  // fix: import { erc20ABI } from 'wagmi' -> import { erc20Abi } from 'viem'
  root.find(j.ImportDeclaration, { source: { value: 'wagmi' } })
    .forEach(path => {
      const abiRenames: Record<string, string> = {
        erc20ABI: 'erc20Abi',
        erc721ABI: 'erc721Abi',
        erc4626ABI: 'erc4626Abi',
      }
      const specifiers = path.node.specifiers ?? []
      const abiSpecifiers = specifiers.filter(s =>
        s.type === 'ImportSpecifier' &&
        s.imported.type === 'Identifier' &&
        abiRenames[s.imported.name]
      )
      const otherSpecifiers = specifiers.filter(s =>
        !(s.type === 'ImportSpecifier' &&
        s.imported.type === 'Identifier' &&
        abiRenames[s.imported.name as string])
      )

      if (abiSpecifiers.length > 0) {
        abiSpecifiers.forEach(s => {
          if (s.type === 'ImportSpecifier' && s.imported.type === 'Identifier') {
            const oldName = s.imported.name
            const newName = abiRenames[oldName]
            s.imported.name = newName
            if (s.local && s.local.name === oldName) {
              s.local.name = newName
            }
          }
        })
        if (otherSpecifiers.length === 0) {
          path.node.source.value = 'viem'
        } else {
          path.node.specifiers = otherSpecifiers
          j(path).insertAfter(
            j.importDeclaration(abiSpecifiers, j.literal('viem'))
          )
        }
        changed = true
      }
    })

  // fix: WagmiConfig -> WagmiProvider
  root.find(j.ImportDeclaration, { source: { value: 'wagmi' } })
    .forEach(path => {
      path.node.specifiers?.forEach(specifier => {
        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          specifier.imported.name === 'WagmiConfig'
        ) {
          specifier.imported.name = 'WagmiProvider'
          if (specifier.local && specifier.local.name === 'WagmiConfig') {
            specifier.local.name = 'WagmiProvider'
          }
          changed = true
        }
      })
    })

  // rename WagmiConfig usages in JSX and code
  root.find(j.Identifier, { name: 'WagmiConfig' })
    .forEach(path => {
      path.node.name = 'WagmiProvider'
      changed = true
    })

  return changed ? root.toSource({ quote: 'single' }) : null
}

export default transform
