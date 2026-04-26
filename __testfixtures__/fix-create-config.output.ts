import { createConfig } from 'wagmi';
import { http } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains'

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [alchemyProvider({ apiKey: 'abc123' }), publicProvider()]
)

export const config = createConfig({
  chains
})
