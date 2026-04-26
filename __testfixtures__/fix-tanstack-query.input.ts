import { useReadContract, useBalance } from 'wagmi'

function MyComponent() {
  const { data } = useReadContract({
    address: '0x123',
    abi: [],
    functionName: 'balanceOf',
    enabled: false,
    staleTime: 1000,
  })

  const { data: balance } = useBalance({
    address: '0x123',
    enabled: true,
    refetchInterval: 5000,
  })

  return null
}
