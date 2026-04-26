import { WagmiConfig, mainnet, sepolia } from 'wagmi'
import { erc20ABI } from 'wagmi'
import { createConfig } from 'wagmi'

function App() {
  return (
    <WagmiConfig config={config}>
      <div>My App</div>
    </WagmiConfig>
  )
}
