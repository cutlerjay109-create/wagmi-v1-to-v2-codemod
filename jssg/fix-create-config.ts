import type { Transform } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const transform: Transform<TSX> = (root) => {
  const rootNode = root.root();
  const edits: any[] = [];

  // remove autoConnect: true from createConfig
  const autoConnectTrue = rootNode.findAll({
    rule: {
      pattern: "createConfig({ $$$BEFORE autoConnect: true, $$$AFTER })",
    },
  });

  for (const node of autoConnectTrue) {
    const before = node.getMatch("BEFORE")?.text() || "";
    const after = node.getMatch("AFTER")?.text() || "";
    const beforeStr = before ? `${before}` : "";
    const afterStr = after ? `${after}` : "";
    const props = [beforeStr, afterStr].filter(Boolean).join(" ");
    edits.push(node.replace(`createConfig({ ${props} })`));
  }

  // remove autoConnect: false from createConfig
  const autoConnectFalse = rootNode.findAll({
    rule: {
      pattern: "createConfig({ $$$BEFORE autoConnect: false, $$$AFTER })",
    },
  });

  for (const node of autoConnectFalse) {
    const before = node.getMatch("BEFORE")?.text() || "";
    const after = node.getMatch("AFTER")?.text() || "";
    const props = [before, after].filter(Boolean).join(" ");
    edits.push(node.replace(`createConfig({ ${props} })`));
  }

  // remove publicClient from createConfig
  const publicClientMatches = rootNode.findAll({
    rule: {
      pattern: "createConfig({ $$$BEFORE publicClient: $CLIENT, $$$AFTER })",
    },
  });

  for (const node of publicClientMatches) {
    const before = node.getMatch("BEFORE")?.text() || "";
    const after = node.getMatch("AFTER")?.text() || "";
    const props = [before, after].filter(Boolean).join(" ");
    edits.push(node.replace(`createConfig({ ${props} })`));
  }

  // rename configureChains identifier
  const configureChainsMatches = rootNode.findAll({
    rule: {
      kind: "identifier",
      pattern: "configureChains",
    },
  });

  for (const node of configureChainsMatches) {
    if (node.text() === "configureChains") {
      edits.push(node.replace("/* configureChains removed in v2 - use transports in createConfig */"));
    }
  }

  if (edits.length === 0) return null;
  return rootNode.commitEdits(edits);
};

export default transform;
