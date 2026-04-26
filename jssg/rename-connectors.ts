import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const connectorRenames: Record<string, string> = {
  CoinbaseWalletConnector: "coinbaseWallet",
  InjectedConnector: "injected",
  MetaMaskConnector: "injected",
  WalletConnectConnector: "walletConnect",
  WalletConnectLegacyConnector: "walletConnect",
  SafeConnector: "safe",
};

const transform: Transform<TSX> = (root) => {
  const rootNode = root.root();
  const edits: any[] = [];

  for (const [oldName, newName] of Object.entries(connectorRenames)) {
    // rename new ClassName() -> functionName()
    const newExprMatches = rootNode.findAll({
      rule: {
        pattern: `new ${oldName}($$$ARGS)`,
      },
    });

    for (const node of newExprMatches) {
      const args = node.getMatch("ARGS")?.text() || "";
      edits.push(node.replace(`${newName}(${args})`));
    }

    // rename import specifiers
    const identifierMatches = rootNode.findAll({
      rule: {
        kind: "identifier",
        pattern: oldName,
      },
    });

    for (const node of identifierMatches) {
      if (node.text() === oldName) {
        edits.push(node.replace(newName));
      }
    }
  }

  // fix import paths: wagmi/connectors/x -> wagmi/connectors
  const importMatches = rootNode.findAll({
    rule: {
      pattern: `import { $$$SPECS } from '$SOURCE'`,
    },
  });

  for (const node of importMatches) {
    const source = node.getMatch("SOURCE")?.text() || "";
    if (source.startsWith("wagmi/connectors/")) {
      const sourceNode = node.getMatch("SOURCE");
      if (sourceNode) {
        edits.push(sourceNode.replace("wagmi/connectors"));
      }
    }
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default transform;
