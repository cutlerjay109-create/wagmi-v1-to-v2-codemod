import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useAccount,
  useConfig,
  useAccountEffect,
} from 'wagmi';
import { erc20Abi } from 'viem'

export function MyComponent() {
  const { chain } = useAccount()
  const { chains } = useConfig()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: '0x123',
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],

    query: {
      enabled: !!address,
      staleTime: 5000
    }
  })

  const { data } = useSimulateContract({
    address: '0x123',
    abi: erc20ABI,
    functionName: 'transfer',
    args: ['0x456', 100n],
  })

  const { write } = useWriteContract(data)

  const { switchNetwork } = useSwitchChain()

  const { isLoading } = useWaitForTransactionReceipt({
    hash: '0x456',

    query: {
      enabled: true
    }
  })

  useWatchContractEvent({
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
