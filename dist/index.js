// src/parser.ts
import fs from "fs";
import path from "path";
import peggy from "peggy";
var grammarPath = path.resolve(process.cwd(), "grammar.pegjs");
var grammar = fs.readFileSync(grammarPath, "utf-8");
var parser = peggy.generate(grammar);
function parseT3(code) {
  return parser.parse(code);
}

// src/transpiler.ts
function transpile(ast) {
  return ast.map((node) => emit(node)).filter((node) => node.trim() !== "").join("\n").trim();
}
function emit(node, indent = "") {
  if (typeof node === "string") {
    return indent + node;
  }
  if (node.type === "IfStatement") {
    const innerIndent = indent + node.indent;
    const condition = node.condition;
    const body = emit(node.body, innerIndent);
    return `${innerIndent}if (${condition}) {
${body}
${innerIndent}}`;
  }
  if (node.type === "BlockStatement") {
    return node.body.map((stmt) => emit(stmt, indent + "  ")).join("\n");
  }
  return "";
}
export {
  parseT3,
  transpile
};
