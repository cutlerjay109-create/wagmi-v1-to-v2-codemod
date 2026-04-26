import { useReadContract, useWriteContract, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi'

function MyComponent() {
  const { data } = useReadContract({
    address: '0x123',
    abi: [],
    functionName: 'balanceOf',
  })

  const { write } = useWriteContract({
    address: '0x123',
    abi: [],
    functionName: 'transfer',
  })

  const { switchNetwork } = useSwitchChain()

  const { isLoading } = useWaitForTransactionReceipt({
    hash: '0x456',
  })

  return null
}
