import fs from "fs"
import path from "path"
import peggy from "peggy"

const grammarPath = path.resolve(process.cwd(), "grammar.pegjs")
const grammar = fs.readFileSync(grammarPath, "utf-8")
const parser = peggy.generate(grammar)

export function parseT3(code: string) {
  return parser.parse(code)
}
