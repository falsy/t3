#!/usr/bin/env node

// src/t3.ts
import fs2 from "fs";
import path2 from "path";

// src/parser.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import peggy from "peggy";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var grammarPath = path.resolve(__dirname, "./grammar.pegjs");
var grammar = fs.readFileSync(grammarPath, "utf-8");
var parser = peggy.generate(grammar);
function parseT3(code) {
  return parser.parse(code);
}

// src/transpiler.ts
function transpile(ast2) {
  return ast2.map((node) => emit(node)).filter((node) => node.trim() !== "").join("\n").trim();
}
function replaceComparisonOperators(text) {
  let result2 = text;
  result2 = result2.replace(/([^=!><%])[ \t]*==[ \t]*([^=])/g, "$1 === $2");
  result2 = result2.replace(/([^=!><%])[ \t]*!=[ \t]*([^=])/g, "$1 !== $2");
  return result2;
}
function emit(node, indent = "") {
  if (typeof node === "string") {
    const match = node.match(/^(\s*)\(/);
    if (match) {
      const leading = match[1];
      return indent + leading + ";" + node.trimStart();
    }
    const processedString = replaceComparisonOperators(node);
    return indent + processedString;
  }
  const innerIndent = indent + (node.indent || "");
  if (node.type === "IfStatement") {
    const condition = replaceComparisonOperators(node.condition);
    const bodyContent = Array.isArray(node.body) ? node.body.map((stmt) => emit(stmt, innerIndent + "  ")).join("\n") : emit(node.body, innerIndent + "  ");
    return `${innerIndent}if (${condition}) {
${bodyContent}
${innerIndent}}`;
  }
  if (node.type === "ForStatement") {
    const condition = replaceComparisonOperators(node.condition);
    const bodyContent = Array.isArray(node.body) ? node.body.map((stmt) => emit(stmt, innerIndent + "  ")).join("\n") : emit(node.body, innerIndent + "  ");
    return `${innerIndent}for (${condition}) {
${bodyContent}
${innerIndent}}`;
  }
  if (node.type === "WhileStatement") {
    const condition = replaceComparisonOperators(node.condition);
    const bodyContent = Array.isArray(node.body) ? node.body.map((stmt) => emit(stmt, innerIndent + "  ")).join("\n") : emit(node.body, innerIndent + "  ");
    return `${innerIndent}while (${condition}) {
${bodyContent}
${innerIndent}}`;
  }
  if (node.type === "TernaryExpression") {
    const processedExpression = replaceComparisonOperators(node.expression);
    return `${innerIndent}${processedExpression}`;
  }
  if (node.type === "AssignmentStatement") {
    const processedExpression = replaceComparisonOperators(node.expression);
    return `${innerIndent}${processedExpression}`;
  }
  if (node.type === "SwitchStatement") {
    const condition = node.condition;
    const body = emit(node.body, innerIndent);
    return `${innerIndent}switch (${condition}) {
${body}
${innerIndent}}`;
  }
  if (node.type === "CaseStatement") {
    const label = node.label;
    const caseIndent = innerIndent + "  ";
    const blockIndent = caseIndent + "  ";
    if (node.hasBlock) {
      const blockLines = node.block.body.map(
        (item) => emit(item, blockIndent)
      );
      const blockContent = blockLines.join("\n");
      return `${caseIndent}${label} {
${blockContent}
${caseIndent}}`;
    } else if (node.block && node.block.type === "CaseBlockContent") {
      if (node.block.body && node.block.body.length > 0) {
        const blockContent = node.block.body.map((lines) => {
          return lines.map((line) => emit(line, blockIndent)).filter((line) => line !== "").join("\n");
        }).join("\n");
        return `${caseIndent}${label}
${blockContent}`;
      }
      return `${caseIndent}${label}`;
    } else {
      return `${caseIndent}${label}`;
    }
  }
  if (node.type === "BlockStatement") {
    return node.body.map((stmt) => emit(stmt, indent + "  ")).join("\n");
  }
  if (node.type === "SwitchBlockStatement") {
    return node.body.map((stmt) => emit(stmt, indent)).join("\n");
  }
  if (node.type === "CaseBlockContent") {
    return node.lines ? node.lines.map((line) => emit(line, indent)).join("\n") : node.body ? node.body.map((line) => emit(line[0], indent)).join("\n") : "";
  }
  return "";
}

// src/t3.ts
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
