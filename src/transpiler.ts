export function transpile(ast: any[]): string {
  return ast
    .map((node: any) => emit(node))
    .filter((node: string) => node.trim() !== "")
    .join("\n")
    .trim()
}

function emit(node: any, indent: string = ""): string {
  if (typeof node === "string") {
    return indent + node
  }

  if (node.type === "IfStatement") {
    const innerIndent = indent + node.indent
    const condition = node.condition
    const body = emit(node.body, innerIndent)
    return `${innerIndent}if (${condition}) {\n${body}\n${innerIndent}}`
  }

  if (node.type === "BlockStatement") {
    return node.body.map((stmt: any) => emit(stmt, indent + "  ")).join("\n")
  }

  return ""
}
