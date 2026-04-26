import { configureChains, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [alchemyProvider({ apiKey: 'abc123' }), publicProvider()]
)

export const config = createConfig({
  autoConnect: true,
  publicClient,
  chains,
})
