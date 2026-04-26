import type { Transform } from 'jscodeshift'

const tanstackQueryParams = [
  'enabled',
  'staleTime',
  'cacheTime',
  'refetchInterval',
  'refetchOnWindowFocus',
  'refetchOnMount',
  'refetchOnReconnect',
  'retry',
  'retryDelay',
  'select',
  'onSuccess',
  'onError',
  'onSettled',
  'keepPreviousData',
  'placeholderData',
  'suspense',
  'notifyOnChangeProps',
]

const wagmiHooks = [
  'useReadContract',
  'useReadContracts',
  'useBalance',
  'useBlockNumber',
  'useBlock',
  'useTransaction',
  'useWaitForTransactionReceipt',
  'useEstimateGas',
  'useEstimateFeesPerGas',
  'useSwitchChain',
  'useEnsName',
  'useEnsAddress',
  'useEnsAvatar',
  'useGasPrice',
  'useContractRead',
  'useContractReads',
  'useWaitForTransaction',
  'useFeeData',
]

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  root.find(j.CallExpression)
    .forEach(path => {
      if (
        path.node.callee.type !== 'Identifier' ||
        !wagmiHooks.includes(path.node.callee.name)
      ) return

      const args = path.node.arguments
      if (args.length === 0) return

      const firstArg = args[0]
      if (firstArg.type !== 'ObjectExpression') return

      const properties = firstArg.properties as any[]

      const isQueryProp = (p: any) => {
        const keyName = p.key?.name || p.key?.value
        return (
          (p.type === 'Property' || p.type === 'ObjectProperty') &&
          tanstackQueryParams.includes(keyName)
        )
      }

      const queryProps = properties.filter(isQueryProp)
      const otherProps = properties.filter((p: any) => !isQueryProp(p))

      if (queryProps.length === 0) return

      const alreadyHasQuery = otherProps.some((p: any) => {
        const keyName = p.key?.name || p.key?.value
        return keyName === 'query'
      })

      if (alreadyHasQuery) return

      const queryObject = j.property(
        'init',
        j.identifier('query'),
        j.objectExpression(queryProps)
      )

      firstArg.properties = [...otherProps, queryObject]
      changed = true
    })

  return changed ? root.toSource({ quote: 'single' }) : null
}

export default transform
