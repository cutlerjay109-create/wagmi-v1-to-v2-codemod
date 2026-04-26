import { coinbaseWallet } from 'wagmi/connectors'
import { injected } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'
import { safe } from 'wagmi/connectors'

const connectors = [
  coinbaseWallet({
    options: { appName: 'My App' },
  }),
  injected(),
  walletConnect({
    options: { projectId: 'abc123' },
  }),
  safe({
    options: { allowedDomains: [/app.safe.global/] },
  }),
]
