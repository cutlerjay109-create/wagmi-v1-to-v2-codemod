import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const transform: Transform<TSX> = (root) => {
  const rootNode = root.root();
  const edits: any[] = [];

  // match useAccount({ onConnect: $CONNECT, onDisconnect: $DISCONNECT })
  const bothMatches = rootNode.findAll({
    rule: {
      pattern: "useAccount({ onConnect: $CONNECT, onDisconnect: $DISCONNECT })",
    },
  });

  for (const node of bothMatches) {
    const connect = node.getMatch("CONNECT")?.text() || "";
    const disconnect = node.getMatch("DISCONNECT")?.text() || "";
    edits.push(
      node.replace(
        `useAccount()\nuseAccountEffect({ onConnect: ${connect}, onDisconnect: ${disconnect} })`
      )
    );
  }

  // match useAccount({ onConnect($DATA) { $$$BODY }, onDisconnect() { $$$BODY2 } })
  const methodMatches = rootNode.findAll({
    rule: {
      pattern:
        "useAccount({ onConnect($DATA) { $$$BODY }, onDisconnect() { $$$BODY2 } })",
    },
  });

  for (const node of methodMatches) {
    const data = node.getMatch("DATA")?.text() || "";
    const body = node.getMatch("BODY")?.text() || "";
    const body2 = node.getMatch("BODY2")?.text() || "";
    edits.push(
      node.replace(
        `useAccount()\nuseAccountEffect({ onConnect(${data}) { ${body} }, onDisconnect() { ${body2} } })`
      )
    );
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default transform;
