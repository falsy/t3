import fs from "fs"
import path from "path"
import { parseT3 } from "./parser.js"
import { transpile } from "./transpiler.js"

const args = process.argv.slice(2)
const inputPath = args[0]

if (!inputPath) {
  console.error("Usage: t3 <input-file> [--outDir <dir>]")
  process.exit(1)
}

const outDirIndex = args.indexOf("--outDir")
const outDir = outDirIndex !== -1 ? args[outDirIndex + 1] : null

const inputCode = fs.readFileSync(inputPath, "utf-8")
const ast = parseT3(inputCode)
const result = transpile(ast)

const inputName = path.basename(inputPath, path.extname(inputPath))
const outputPath = path.join(
  outDir || path.dirname(inputPath),
  `${inputName}.ts`
)

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, result, "utf-8")
