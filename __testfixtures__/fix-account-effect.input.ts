import { useAccount } from 'wagmi'

function MyComponent() {
  useAccount({
    onConnect(data) {
      console.log('connected', data)
    },
    onDisconnect() {
      console.log('disconnected')
    },
  })

  return null
}
