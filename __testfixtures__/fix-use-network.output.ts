import { useAccount, useConfig } from 'wagmi';

function MyComponent() {
  const { chain } = useAccount()
  const { chains } = useConfig()

  return null
}
