import { useAccount, useAccountEffect } from 'wagmi';

function MyComponent() {
  useAccount()

  useAccountEffect({
    onConnect(data) {
      console.log('connected', data)
    },

    onDisconnect() {
      console.log('disconnected')
    }
  });

  return null
}
