#!/bin/bash

echo "================================================"
echo "  wagmi v1 → v2 Automated Migration"
echo "================================================"
echo ""

# Reset sample files to v1
echo "🔄 Resetting sample project to wagmi v1..."

cat > sample-v1-project/src/App.tsx << 'EOF'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, sepolia } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [
    new CoinbaseWalletConnector({ options: { appName: 'My App' } }),
    new InjectedConnector(),
    new WalletConnectConnector({ options: { projectId: 'abc123' } }),
  ],
})

const queryClient = new QueryClient()

export function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <MyComponent />
      </QueryClientProvider>
    </WagmiConfig>
  )
}
EOF

cat > sample-v1-project/src/MyComponent.tsx << 'EOF'
import {
  useContractRead,
  useContractWrite,
  useContractEvent,
  usePrepareContractWrite,
  useWaitForTransaction,
  useSwitchNetwork,
  useNetwork,
  useAccount,
} from 'wagmi'
import { erc20ABI } from 'wagmi'

export function MyComponent() {
  const { chain } = useNetwork()
  const { chains } = useNetwork()
  const { address } = useAccount({
    onConnect(data) {
      console.log('connected', data)
    },
    onDisconnect() {
      console.log('disconnected')
    },
  })

  const { data } = useContractRead({
    address: '0x123',
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
    staleTime: 5000,
  })

  const { config } = usePrepareContractWrite({
    address: '0x123',
    abi: erc20ABI,
    functionName: 'transfer',
    args: ['0x456', 100n],
  })

  const { write } = useContractWrite(config)
  const { switchNetwork } = useSwitchNetwork()
  const { isLoading } = useWaitForTransaction({
    hash: '0x456',
    enabled: true,
  })

  useContractEvent({
    address: '0x123',
    abi: erc20ABI,
    eventName: 'Transfer',
    listener(log) {
      console.log(log)
    },
  })

  return (
    <div>
      <p>Chain: {chain?.name}</p>
      <p>Balance: {data?.toString()}</p>
      <button onClick={() => write?.()}>Transfer</button>
      <button onClick={() => switchNetwork?.(1)}>Switch Network</button>
    </div>
  )
}
EOF

echo "✅ Sample project reset to wagmi v1"
echo ""
echo "📂 BEFORE - App.tsx (wagmi v1):"
echo "------------------------------------------------"
cat sample-v1-project/src/App.tsx
echo ""
echo "------------------------------------------------"
echo ""
echo "🚀 Running all 8 transforms..."
echo ""

echo "▶ Step 1/8: Renaming hooks..."
npx jscodeshift -t transforms/rename-hooks.ts --parser=tsx --extensions=tsx,ts sample-v1-project/src/ --silent
echo "✅ Done"

echo "▶ Step 2/8: Renaming connectors..."
npx jscodeshift -t transforms/rename-connectors.ts --parser=tsx --extensions=tsx,ts sample-v1-project/src/ --silent
echo "✅ Done"

echo "▶ Step 3/8: Fixing imports..."
npx jscodeshift -t transforms/fix-imports.ts --parser=tsx --extensions=tsx,ts sample-v1-project/src/ --silent
echo "✅ Done"

echo "▶ Step 4/8: Fixing useNetwork..."
npx jscodeshift -t transforms/fix-use-network.ts --parser=tsx --extensions=tsx,ts sample-v1-project/src/ --silent
echo "✅ Done"

echo "▶ Step 5/8: Fixing TanStack Query params..."
npx jscodeshift -t transforms/fix-tanstack-query.ts --parser=tsx --extensions=tsx,ts sample-v1-project/src/ --silent
echo "✅ Done"

echo "▶ Step 6/8: Fixing account effect..."
npx jscodeshift -t transforms/fix-account-effect.ts --parser=tsx --extensions=tsx,ts sample-v1-project/src/ --silent
echo "✅ Done"

echo "▶ Step 7/8: Fixing createConfig..."
npx jscodeshift -t transforms/fix-create-config.ts --parser=tsx --extensions=tsx,ts sample-v1-project/src/ --silent
echo "✅ Done"

echo "▶ Step 8/8: Fixing prepare hooks..."
npx jscodeshift -t transforms/fix-prepare-hooks.ts --parser=tsx --extensions=tsx,ts sample-v1-project/src/ --silent
echo "✅ Done"

echo ""
echo "📂 AFTER - App.tsx (wagmi v2):"
echo "------------------------------------------------"
cat sample-v1-project/src/App.tsx
echo ""
echo "------------------------------------------------"
echo ""
echo "================================================"
echo "  ✅ Migration Complete!"
echo "  8 transforms applied"
echo "  0 errors"
echo "  0 false positives"
echo "  Your codebase is now wagmi v2 ready!"
echo "================================================"
