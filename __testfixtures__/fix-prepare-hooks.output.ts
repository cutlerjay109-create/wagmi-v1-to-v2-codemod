import { useSimulateContract, useContractWrite, useEstimateGas, useSendTransaction } from 'wagmi'

function MyComponent() {
  const { data } = useSimulateContract({
    address: '0x123',
    abi: [],
    functionName: 'transfer',
    args: ['0x456', 100n],
  })

  const { write } = useContractWrite(data)

  const { config: sendConfig } = useEstimateGas({
    to: '0x123',
    value: 100n,
  })

  const { sendTransaction } = useSendTransaction(sendConfig)

  return null
}
