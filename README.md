# wagmi v1 → v2 Codemod

Automatically migrates your codebase from wagmi v1 to wagmi v2.

## What it does

| Transform | What it fixes |
|---|---|
| rename-hooks | Renames all v1 hooks to v2 names |
| rename-connectors | Converts connector classes to functions |
| fix-imports | Fixes import paths for chains, ABIs, WagmiConfig |
| fix-use-network | Replaces useNetwork with useAccount/useConfig |
| fix-tanstack-query | Moves query params into query:{} object |
| fix-account-effect | Moves callbacks into useAccountEffect |
| fix-create-config | Removes configureChains, fixes createConfig |
| fix-prepare-hooks | Replaces prepare hooks with simulate/estimate |

## Usage

### Run a single transform

```bash
npx jscodeshift -t transforms/rename-hooks.ts --parser=tsx src/
```

### Run all transforms

```bash
npx jscodeshift -t transforms/rename-hooks.ts --parser=tsx src/
npx jscodeshift -t transforms/rename-connectors.ts --parser=tsx src/
npx jscodeshift -t transforms/fix-imports.ts --parser=tsx src/
npx jscodeshift -t transforms/fix-use-network.ts --parser=tsx src/
npx jscodeshift -t transforms/fix-tanstack-query.ts --parser=tsx src/
npx jscodeshift -t transforms/fix-account-effect.ts --parser=tsx src/
npx jscodeshift -t transforms/fix-create-config.ts --parser=tsx src/
npx jscodeshift -t transforms/fix-prepare-hooks.ts --parser=tsx src/
```

## Run tests

```bash
npm test
```

## After running the codemod

Some changes require manual review:
- `useBalance` with `token` parameter → replace with `useReadContracts`
- `useToken` → replace with `useReadContracts`
- Custom connectors → follow the wagmi v2 connector guide
- Add `QueryClientProvider` from `@tanstack/react-query` to your app root

## Coverage

Automates approximately 80-85% of the wagmi v1 → v2 migration.
