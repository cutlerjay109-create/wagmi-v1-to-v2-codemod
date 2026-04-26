import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const transform: Transform<TSX> = (root) => {
  const rootNode = root.root();
  const edits: any[] = [];

  // usePrepareContractWrite -> useSimulateContract
  const prepareContractMatches = rootNode.findAll({
    rule: {
      kind: "identifier",
      pattern: "usePrepareContractWrite",
    },
  });

  for (const node of prepareContractMatches) {
    if (node.text() === "usePrepareContractWrite") {
      edits.push(node.replace("useSimulateContract"));
    }
  }

  // usePrepareSendTransaction -> useEstimateGas
  const prepareSendMatches = rootNode.findAll({
    rule: {
      kind: "identifier",
      pattern: "usePrepareSendTransaction",
    },
  });

  for (const node of prepareSendMatches) {
    if (node.text() === "usePrepareSendTransaction") {
      edits.push(node.replace("useEstimateGas"));
    }
  }

  // const { config } = useSimulateContract -> const { data } = useSimulateContract
  const configMatches = rootNode.findAll({
    rule: {
      pattern: "const { config } = useSimulateContract($$$ARGS)",
    },
  });

  for (const node of configMatches) {
    const args = node.getMatch("ARGS")?.text() || "";
    edits.push(node.replace(`const { data } = useSimulateContract(${args})`));
  }

  // useContractWrite(config) -> useWriteContract(data)
  const writeConfigMatches = rootNode.findAll({
    rule: {
      pattern: "useContractWrite(config)",
    },
  });

  for (const node of writeConfigMatches) {
    edits.push(node.replace("useWriteContract(data)"));
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default transform;
