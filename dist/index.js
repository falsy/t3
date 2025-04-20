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
    const match = node.match(/^(\s*)\(/);
    if (match) {
      const leading = match[1];
      return indent + leading + ";" + node.trimStart();
    }
    return indent + node;
  }
  const innerIndent = indent + (node.indent || "");
  if (node.type === "IfStatement") {
    const condition = node.condition.replace(/==/g, "===");
    const body = emit(node.body, innerIndent);
    return `${innerIndent}if (${condition}) {
${body}
${innerIndent}}`;
  }
  if (node.type === "ForStatement") {
    const condition = node.condition.replace(/==/g, "===");
    const body = emit(node.body, innerIndent);
    return `${innerIndent}for (${condition}) {
${body}
${innerIndent}}`;
  }
  if (node.type === "WhileStatement") {
    const condition = node.condition.replace(/==/g, "===");
    const body = emit(node.body, innerIndent);
    return `${innerIndent}while (${condition}) {
${body}
${innerIndent}}`;
  }
  if (node.type === "SwitchStatement") {
    const condition = node.condition;
    const body = emit(node.body, innerIndent);
    return `${innerIndent}switch (${condition}) {
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
