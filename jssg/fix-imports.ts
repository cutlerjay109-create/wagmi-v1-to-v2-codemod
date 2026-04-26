import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const transform: Transform<TSX> = (root) => {
  const rootNode = root.root();
  const edits: any[] = [];

  // WagmiConfig -> WagmiProvider (all identifiers)
  const wagmiConfigMatches = rootNode.findAll({
    rule: {
      kind: "identifier",
      pattern: "WagmiConfig",
    },
  });

  for (const node of wagmiConfigMatches) {
    if (node.text() === "WagmiConfig") {
      edits.push(node.replace("WagmiProvider"));
    }
  }

  // erc20ABI -> erc20Abi
  const erc20Matches = rootNode.findAll({
    rule: {
      kind: "identifier",
      pattern: "erc20ABI",
    },
  });

  for (const node of erc20Matches) {
    if (node.text() === "erc20ABI") {
      edits.push(node.replace("erc20Abi"));
    }
  }

  // erc721ABI -> erc721Abi
  const erc721Matches = rootNode.findAll({
    rule: {
      kind: "identifier",
      pattern: "erc721ABI",
    },
  });

  for (const node of erc721Matches) {
    if (node.text() === "erc721ABI") {
      edits.push(node.replace("erc721Abi"));
    }
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default transform;
