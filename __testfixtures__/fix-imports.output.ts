import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { erc20Abi } from 'viem'
import { createConfig } from 'wagmi'

function App() {
  return (
    <WagmiProvider config={config}>
      <div>My App</div>
    </WagmiProvider>
  );
}
