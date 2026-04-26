import { usePrepareContractWrite, useContractWrite, usePrepareSendTransaction, useSendTransaction } from 'wagmi'

function MyComponent() {
  const { config } = usePrepareContractWrite({
    address: '0x123',
    abi: [],
    functionName: 'transfer',
    args: ['0x456', 100n],
  })

  const { write } = useContractWrite(config)

  const { config: sendConfig } = usePrepareSendTransaction({
    to: '0x123',
    value: 100n,
  })

  const { sendTransaction } = useSendTransaction(sendConfig)

  return null
}
