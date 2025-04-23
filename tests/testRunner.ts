import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { transpile } from "../src/transpiler"
import { parseT3 } from "../src/parser"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const testsDir = path.resolve(__dirname, "../tests/cases")

for (const file of fs.readdirSync(testsDir)) {
  if (!file.endsWith(".t3")) continue

  const base = file.replace(/\.t3$/, "")
  const t3Path = path.join(testsDir, `${base}.t3`)
  const tsExpectedPath = path.join(testsDir, `${base}.ts`)

  const source = fs.readFileSync(t3Path, "utf-8")
  const expected = fs.readFileSync(tsExpectedPath, "utf-8").trim()
  const actual = transpile(parseT3(source)).trim()

  if (actual !== expected) {
    console.error(`🔴 Failed: ${base}\n`)
    console.error("[Diff]\n" + generateDiff(expected, actual))
  } else {
    console.log(`🟢 Passed: ${base}`)
  }
}

function generateDiff(a: string, b: string): string {
  const alines = a.split("\n")
  const blines = b.split("\n")
  const lines: string[] = []

  for (let i = 0; i < Math.max(alines.length, blines.length); i++) {
    const aline = alines[i] ?? ""
    const bline = blines[i] ?? ""
    if (aline !== bline) {
      lines.push(`Line ${i + 1}:`)
      lines.push(`t3 → ${aline}`)
      lines.push(`ts → ${bline}`)
    }
  }

  return lines.join("\n")
}
