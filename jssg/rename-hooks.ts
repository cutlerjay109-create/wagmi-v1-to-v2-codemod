import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const hookRenames: Record<string, string> = {
  useContractRead: "useReadContract",
  useContractReads: "useReadContracts",
  useContractWrite: "useWriteContract",
  useContractEvent: "useWatchContractEvent",
  useContractInfiniteReads: "useInfiniteReadContracts",
  useFeeData: "useEstimateFeesPerGas",
  useSwitchNetwork: "useSwitchChain",
  useWaitForTransaction: "useWaitForTransactionReceipt",
};

const transform: Transform<TSX> = (root) => {
  const rootNode = root.root();
  const edits: any[] = [];

  for (const [oldName, newName] of Object.entries(hookRenames)) {
    // rename import specifiers
    const importMatches = rootNode.findAll({
      rule: {
        pattern: `import { $$$BEFORE ${oldName} $$$AFTER } from 'wagmi'`,
      },
    });

    // rename all identifiers with the old name
    const identifierMatches = rootNode.findAll({
      rule: {
        pattern: oldName,
        kind: "identifier",
      },
    });

    for (const node of identifierMatches) {
      if (node.text() === oldName) {
        edits.push(node.replace(newName));
      }
    }
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default transform;
