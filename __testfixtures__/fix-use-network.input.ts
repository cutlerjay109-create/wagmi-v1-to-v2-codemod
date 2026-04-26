import { useNetwork } from 'wagmi'

function MyComponent() {
  const { chain } = useNetwork()
  const { chains } = useNetwork()

  return null
}
