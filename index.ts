import renameHooks from './transforms/rename-hooks'
import renameConnectors from './transforms/rename-connectors'
import fixImports from './transforms/fix-imports'
import fixUseNetwork from './transforms/fix-use-network'
import fixTanstackQuery from './transforms/fix-tanstack-query'
import fixAccountEffect from './transforms/fix-account-effect'
import fixCreateConfig from './transforms/fix-create-config'
import fixPrepareHooks from './transforms/fix-prepare-hooks'

export const transforms = [
  { name: 'rename-hooks', transform: renameHooks },
  { name: 'rename-connectors', transform: renameConnectors },
  { name: 'fix-imports', transform: fixImports },
  { name: 'fix-use-network', transform: fixUseNetwork },
  { name: 'fix-tanstack-query', transform: fixTanstackQuery },
  { name: 'fix-account-effect', transform: fixAccountEffect },
  { name: 'fix-create-config', transform: fixCreateConfig },
  { name: 'fix-prepare-hooks', transform: fixPrepareHooks },
]

export default transforms
