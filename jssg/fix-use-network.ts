import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const transform: Transform<TSX> = (root) => {
  const rootNode = root.root();
  const edits: any[] = [];

  // const { chain } = useNetwork() -> const { chain } = useAccount()
  const chainMatches = rootNode.findAll({
    rule: {
      pattern: "const { chain } = useNetwork()",
    },
  });

  for (const node of chainMatches) {
    edits.push(node.replace("const { chain } = useAccount()"));
  }

  // const { chains } = useNetwork() -> const { chains } = useConfig()
  const chainsMatches = rootNode.findAll({
    rule: {
      pattern: "const { chains } = useNetwork()",
    },
  });

  for (const node of chainsMatches) {
    edits.push(node.replace("const { chains } = useConfig()"));
  }

  // rename useNetwork identifier in imports
  const importMatches = rootNode.findAll({
    rule: {
      kind: "identifier",
      pattern: "useNetwork",
    },
  });

  for (const node of importMatches) {
    if (node.text() === "useNetwork") {
      edits.push(node.replace("useAccount"));
    }
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default transform;
