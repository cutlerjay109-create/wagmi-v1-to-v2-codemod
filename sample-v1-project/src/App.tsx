import { WagmiProvider, createConfig } from 'wagmi';
import { http } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'
import { injected } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const { chains, publicClient } = /* configureChains removed in v2 - use transports in createConfig */(
  [mainnet, sepolia],
  [publicProvider()]
)

const config = createConfig({
  connectors: [
    coinbaseWallet({ options: { appName: 'My App' } }),
    injected(),
    walletConnect({ options: { projectId: 'abc123' } }),
  ]
})

const queryClient = new QueryClient()

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MyComponent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
