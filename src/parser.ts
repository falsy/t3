import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import peggy from "peggy"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const grammarPath = path.resolve(__dirname, "./grammar.pegjs")
const grammar = fs.readFileSync(grammarPath, "utf-8")
const parser = peggy.generate(grammar)

export function parseT3(code: string) {
  return parser.parse(code)
}
