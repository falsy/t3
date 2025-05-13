export function transpile(ast) {
    return ast
        .map((node) => emit(node))
        .filter((node) => node.trim() !== "")
        .join("\n")
        .trim();
}
function replaceComparisonOperators(text) {
    let result = text;
    result = result.replace(/([^=!><%])[ \t]*==[ \t]*([^=])/g, "$1 === $2");
    result = result.replace(/([^=!><%])[ \t]*!=[ \t]*([^=])/g, "$1 !== $2");
    return result;
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
        const bodyContent = Array.isArray(node.body)
            ? node.body.map((stmt) => emit(stmt, innerIndent + "  ")).join("\n")
            : emit(node.body, innerIndent + "  ");
        return `${innerIndent}if (${condition}) {\n${bodyContent}\n${innerIndent}}`;
    }
    if (node.type === "ForStatement") {
        const condition = replaceComparisonOperators(node.condition);
        const bodyContent = Array.isArray(node.body)
            ? node.body.map((stmt) => emit(stmt, innerIndent + "  ")).join("\n")
            : emit(node.body, innerIndent + "  ");
        return `${innerIndent}for (${condition}) {\n${bodyContent}\n${innerIndent}}`;
    }
    if (node.type === "WhileStatement") {
        const condition = replaceComparisonOperators(node.condition);
        const bodyContent = Array.isArray(node.body)
            ? node.body.map((stmt) => emit(stmt, innerIndent + "  ")).join("\n")
            : emit(node.body, innerIndent + "  ");
        return `${innerIndent}while (${condition}) {\n${bodyContent}\n${innerIndent}}`;
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
        return `${innerIndent}switch (${condition}) {\n${body}\n${innerIndent}}`;
    }
    if (node.type === "CaseStatement") {
        const label = node.label;
        const caseIndent = innerIndent + "  ";
        const blockIndent = caseIndent + "  ";
        if (node.hasBlock) {
            // case 뒤에 블록이 있는 경우
            const blockLines = node.block.body.map((item) => emit(item, blockIndent));
            const blockContent = blockLines.join("\n");
            return `${caseIndent}${label} {\n${blockContent}\n${caseIndent}}`;
        }
        else if (node.block && node.block.type === "CaseBlockContent") {
            // 블록이 없는 경우의 case 내용
            if (node.block.body && node.block.body.length > 0) {
                const blockContent = node.block.body
                    .map((lines) => {
                    return lines
                        .map((line) => emit(line, blockIndent))
                        .filter((line) => line !== "")
                        .join("\n");
                })
                    .join("\n");
                return `${caseIndent}${label}\n${blockContent}`;
            }
            return `${caseIndent}${label}`;
        }
        else {
            // 내용이 없는 case 문
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
        return node.lines ? node.lines.map((line) => emit(line, indent)).join("\n")
            : node.body ? node.body.map((line) => emit(line[0], indent)).join("\n")
                : "";
    }
    return "";
}
