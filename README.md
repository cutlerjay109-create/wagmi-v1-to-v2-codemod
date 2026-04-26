# wagmi v1 → v2 Codemod

Automatically migrates your codebase from wagmi v1 to wagmi v2 using jssg (JavaScript ast-grep).

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

### Run the full migration workflow
```bash
codemod workflow run -w workflow.yaml --target ./src
```

### Run from the Codemod Registry
```bash
npx codemod wagmi-v1-to-v2-cutlerjay109 --target ./src
```

### Run a single transform
```bash
codemod workflow run -w workflow.yaml --target ./src --only rename-hooks
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
- The AI step in the workflow handles most of these automatically

## Coverage

Automates approximately 80-85% of the wagmi v1 → v2 migration deterministically.
The remaining 15% is handled by the built-in AI step in the workflow.

## Tech Stack

- **jssg** (JavaScript ast-grep) — AST-based code transformation engine
- **Codemod CLI** — workflow orchestration
- **Jest** — transform testing
