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
function emit(node, indent = "", inSwitchCase = false) {
  if (typeof node === "string") {
    const match = node.match(/^(\s*)\(/);
    if (match) {
      const leading = match[1];
      return indent + leading + ";" + node.trimStart();
    }
    const caseMatch = node.match(/^(\s*)(case\s+.*:|default:)(.*)$/);
    if (caseMatch) {
      const [, leading, caseStatement, rest] = caseMatch;
      return indent + caseStatement + rest;
    }
    if (inSwitchCase) {
      return indent + "  " + node;
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
    const body = processSwitchBody(node.body, innerIndent);
    return `${innerIndent}switch (${condition}) {
${body}
${innerIndent}}`;
  }
  if (node.type === "BlockStatement") {
    return node.body.map((stmt) => emit(stmt, indent + "  ", false)).join("\n");
  }
  return "";
}
function processSwitchBody(node, indent) {
  if (node.type !== "BlockStatement") {
    return emit(node, indent);
  }
  const statements = node.body.map((stmt) => {
    if (typeof stmt !== "string") {
      return stmt;
    }
    return stmt.trim();
  });
  let result2 = [];
  let i = 0;
  while (i < statements.length) {
    const stmt = statements[i];
    if (typeof stmt === "string" && (stmt.startsWith("case ") || stmt.startsWith("default:"))) {
      result2.push(`${indent}  ${stmt}`);
      if (i + 1 < statements.length && statements[i + 1] === "{") {
        i++;
        let blockContent = [];
        let braceCount = 1;
        let j = i + 1;
        while (j < statements.length && braceCount > 0) {
          const blockStmt = statements[j];
          if (blockStmt === "{") {
            braceCount++;
          } else if (blockStmt === "}") {
            braceCount--;
            if (braceCount === 0) {
              break;
            }
          }
          if (braceCount > 0) {
            blockContent.push(`${indent}    ${blockStmt}`);
          }
          j++;
        }
        result2 = result2.concat(blockContent);
        result2.push(`${indent}  }`);
        i = j + 1;
      } else {
        i++;
        while (i < statements.length) {
          const contentStmt = statements[i];
          if (typeof contentStmt === "string" && (contentStmt.startsWith("case ") || contentStmt.startsWith("default:"))) {
            break;
          }
          result2.push(`${indent}    ${contentStmt}`);
          i++;
        }
      }
    } else {
      result2.push(`${indent}  ${stmt}`);
      i++;
    }
  }
  return result2.join("\n");
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
