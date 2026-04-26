import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const wagmiHooks = [
  "useReadContract",
  "useReadContracts",
  "useBalance",
  "useBlockNumber",
  "useBlock",
  "useTransaction",
  "useWaitForTransactionReceipt",
  "useEstimateGas",
  "useEstimateFeesPerGas",
  "useSwitchChain",
  "useEnsName",
  "useEnsAddress",
  "useEnsAvatar",
  "useGasPrice",
  "useContractRead",
  "useContractReads",
  "useWaitForTransaction",
  "useFeeData",
];

const tanstackParams = [
  "enabled",
  "staleTime",
  "cacheTime",
  "refetchInterval",
  "refetchOnWindowFocus",
  "refetchOnMount",
  "refetchOnReconnect",
  "retry",
  "retryDelay",
  "select",
  "onSuccess",
  "onError",
  "onSettled",
  "keepPreviousData",
  "placeholderData",
];

const transform: Transform<TSX> = (root) => {
  const rootNode = root.root();
  const edits: any[] = [];

  for (const hook of wagmiHooks) {
    for (const param of tanstackParams) {
      // match hook call with param directly in args
      const matches = rootNode.findAll({
        rule: {
          pattern: `${hook}({ $$$BEFORE ${param}: $VALUE, $$$AFTER })`,
        },
      });

      for (const node of matches) {
        const before = node.getMatch("BEFORE")?.text() || "";
        const value = node.getMatch("VALUE")?.text() || "";
        const after = node.getMatch("AFTER")?.text() || "";

        const beforeStr = before ? `${before},` : "";
        const afterStr = after ? `, ${after}` : "";

        edits.push(
          node.replace(
            `${hook}({ ${beforeStr} query: { ${param}: ${value} }${afterStr} })`
          )
        );
      }
    }
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default transform;
