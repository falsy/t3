#!/usr/bin/env node

// src/bin/t3.ts
import fs2 from "fs";
import path2 from "path";

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
function transpile(ast2) {
  console.log("Transpiling AST:", JSON.stringify(ast2, null, 2));
  return ast2.map((node) => emit(node)).filter((node) => node.trim() !== "").join("\n").trim();
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

// src/bin/t3.ts
var args = process.argv.slice(2);
var inputPath = args[0];
if (!inputPath) {
  console.error("Usage: t3 <input-file> [--outDir <dir>]");
  process.exit(1);
}
var outDirIndex = args.indexOf("--outDir");
var outDir = outDirIndex !== -1 ? args[outDirIndex + 1] : null;
var inputCode = fs2.readFileSync(inputPath, "utf-8");
var ast = parseT3(inputCode);
var result = transpile(ast);
var inputName = path2.basename(inputPath, path2.extname(inputPath));
var outputPath = path2.join(
  outDir || path2.dirname(inputPath),
  `${inputName}.ts`
);
fs2.mkdirSync(path2.dirname(outputPath), { recursive: true });
fs2.writeFileSync(outputPath, result, "utf-8");
