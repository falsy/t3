export function transpile(ast: any[]): string {
  return ast
    .map((node: any) => emit(node))
    .filter((node: string) => node.trim() !== "")
    .join("\n")
    .trim()
}

function emit(node: any, indent: string = ""): string {
  if (typeof node === "string") {
    const match = node.match(/^(\s*)\(/)
    if (match) {
      const leading = match[1]
      return indent + leading + ";" + node.trimStart()
    }
    return indent + node
  }

  const innerIndent = indent + (node.indent || "")

  if (node.type === "IfStatement") {
    const condition = node.condition.replace(/==/g, "===")
    const body = emit(node.body, innerIndent)
    return `${innerIndent}if (${condition}) {\n${body}\n${innerIndent}}`
  }

  if (node.type === "ForStatement") {
    const condition = node.condition.replace(/==/g, "===")
    const body = emit(node.body, innerIndent)
    return `${innerIndent}for (${condition}) {\n${body}\n${innerIndent}}`
  }

  if (node.type === "WhileStatement") {
    const condition = node.condition.replace(/==/g, "===")
    const body = emit(node.body, innerIndent)
    return `${innerIndent}while (${condition}) {\n${body}\n${innerIndent}}`
  }

  if (node.type === "SwitchStatement") {
    const condition = node.condition
    const body = emit(node.body, innerIndent)
    return `${innerIndent}switch (${condition}) {\n${body}\n${innerIndent}}`
  }

  if (node.type === "BlockStatement") {
    return node.body.map((stmt: any) => emit(stmt, indent + "  ")).join("\n")
  }

  return ""
}
