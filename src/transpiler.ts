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
    const condition = node.condition.replace(/==/g, "===").replace(/!=/g, "!==")
    const bodyContent = Array.isArray(node.body)
      ? node.body.map((stmt: any) => emit(stmt, innerIndent + "  ")).join("\n")
      : emit(node.body, innerIndent + "  ")
    return `${innerIndent}if (${condition}) {\n${bodyContent}\n${innerIndent}}`
  }

  if (node.type === "ForStatement") {
    const condition = node.condition.replace(/==/g, "===").replace(/!=/g, "!==")
    const bodyContent = Array.isArray(node.body)
      ? node.body.map((stmt: any) => emit(stmt, innerIndent + "  ")).join("\n")
      : emit(node.body, innerIndent + "  ")
    return `${innerIndent}for (${condition}) {\n${bodyContent}\n${innerIndent}}`
  }

  if (node.type === "WhileStatement") {
    const condition = node.condition.replace(/==/g, "===").replace(/!=/g, "!==")
    const bodyContent = Array.isArray(node.body)
      ? node.body.map((stmt: any) => emit(stmt, innerIndent + "  ")).join("\n")
      : emit(node.body, innerIndent + "  ")
    return `${innerIndent}while (${condition}) {\n${bodyContent}\n${innerIndent}}`
  }

  if (node.type === "SwitchStatement") {
    const condition = node.condition
    const body = emit(node.body, innerIndent)
    return `${innerIndent}switch (${condition}) {\n${body}\n${innerIndent}}`
  }

  if (node.type === "CaseStatement") {
    const label = node.label
    const caseIndent = innerIndent + "  "
    const blockIndent = caseIndent + "  "

    if (node.hasBlock) {
      // case 뒤에 블록이 있는 경우
      const blockLines = node.block.body.map((item: any) =>
        emit(item, blockIndent)
      )
      const blockContent = blockLines.join("\n")
      return `${caseIndent}${label} {\n${blockContent}\n${caseIndent}}`
    } else if (node.block && node.block.type === "CaseBlockContent") {
      // 블록이 없는 경우의 case 내용
      if (node.block.body && node.block.body.length > 0) {
        const blockContent = node.block.body
          .map((lines: any) => {
            return lines
              .map((line: any) => emit(line, blockIndent))
              .filter((line: string) => line !== "")
              .join("\n")
          })
          .join("\n")
        return `${caseIndent}${label}\n${blockContent}`
      }
      return `${caseIndent}${label}`
    } else {
      // 내용이 없는 case 문
      return `${caseIndent}${label}`
    }
  }

  // if (node.type === "FunctionDeclaration") {
  //   const args = node.args
  //   const bodyContent = Array.isArray(node.body)
  //     ? node.body.map((stmt: any) => emit(stmt, indent + "  ")).join("\n")
  //     : emit(node.body, indent + "  ")
  //   return `${indent}function ${node.name}${args} {\n${bodyContent}\n${indent}}`
  // }

  // if (node.type === "FunctionExpression") {
  //   const args = node.args
  //   const bodyContent = node.body
  //     .map((stmt: any) => emit(stmt, indent + "  "))
  //     .join("\n")
  //   return `${indent}const ${node.name} = function${args} {\n${bodyContent}\n${indent}}`
  // }

  // if (node.type === "FunctionObjectMethod") {
  //   const args = node.args
  //   const bodyContent = node.body
  //     .map((stmt: any) => emit(stmt, indent + "  "))
  //     .join("\n")
  //   return `${indent}${node.key}: function${args} {\n${bodyContent}\n${indent}}`
  // }

  // if (node.type === "FunctionCallExpression") {
  //   const args = node.args
  //   const bodyContent = node.body
  //     .map((stmt: any) => emit(stmt, indent + "  "))
  //     .join("\n")
  //   return `${indent}(function${args} {\n${bodyContent}\n${indent}})`
  // }

  if (node.type === "BlockStatement") {
    return node.body.map((stmt: any) => emit(stmt, indent + "  ")).join("\n")
  }

  if (node.type === "SwitchBlockStatement") {
    return node.body.map((stmt: any) => emit(stmt, indent)).join("\n")
  }

  if (node.type === "CaseBlockContent") {
    return node.lines.map((line: any) => emit(line, indent)).join("\n")
  }

  return ""
}