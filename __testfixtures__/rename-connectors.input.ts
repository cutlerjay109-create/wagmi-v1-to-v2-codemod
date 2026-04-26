import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { SafeConnector } from 'wagmi/connectors/safe'

const connectors = [
  new CoinbaseWalletConnector({
    options: { appName: 'My App' },
  }),
  new InjectedConnector(),
  new WalletConnectConnector({
    options: { projectId: 'abc123' },
  }),
  new SafeConnector({
    options: { allowedDomains: [/app.safe.global/] },
  }),
]
