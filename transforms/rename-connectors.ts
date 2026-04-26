import type { Transform } from 'jscodeshift'

const connectorRenames: Record<string, string> = {
  CoinbaseWalletConnector: 'coinbaseWallet',
  InjectedConnector: 'injected',
  MetaMaskConnector: 'injected',
  WalletConnectConnector: 'walletConnect',
  WalletConnectLegacyConnector: 'walletConnect',
  SafeConnector: 'safe',
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  root.find(j.ImportDeclaration)
    .filter(path => {
      const source = path.node.source.value as string
      return source.startsWith('wagmi/connectors')
    })
    .forEach(path => {
      path.node.specifiers?.forEach(specifier => {
        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          connectorRenames[specifier.imported.name]
        ) {
          const oldName = specifier.imported.name
          const newName = connectorRenames[oldName]
          specifier.imported.name = newName
          if (specifier.local && specifier.local.name === oldName) {
            specifier.local.name = newName
          }
          changed = true
        }
      })
      path.node.source.value = 'wagmi/connectors'
    })

  root.find(j.NewExpression)
    .forEach(path => {
      if (
        path.node.callee.type === 'Identifier' &&
        connectorRenames[path.node.callee.name]
      ) {
        const oldName = path.node.callee.name
        const newName = connectorRenames[oldName]
        const args = path.node.arguments
        j(path).replaceWith(
          j.callExpression(j.identifier(newName), args)
        )
        changed = true
      }
    })

  return changed ? root.toSource({ quote: 'single' }) : null
}

export default transform
