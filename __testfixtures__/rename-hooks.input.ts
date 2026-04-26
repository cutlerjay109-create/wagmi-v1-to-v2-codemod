import { useContractRead, useContractWrite, useSwitchNetwork, useWaitForTransaction } from 'wagmi'

function MyComponent() {
  const { data } = useContractRead({
    address: '0x123',
    abi: [],
    functionName: 'balanceOf',
  })

  const { write } = useContractWrite({
    address: '0x123',
    abi: [],
    functionName: 'transfer',
  })

  const { switchNetwork } = useSwitchNetwork()

  const { isLoading } = useWaitForTransaction({
    hash: '0x456',
  })

  return null
}
