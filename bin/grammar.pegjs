start
  = body:(ifStatement / forStatement / whileStatement / switchStatement / rawLine / newline / "}")* _ {
      return body.filter(x => x !== null && x !== undefined);
    }

newline
  = "\r\n" / "\n" / "\r"
_ "whitespace" = [ \t\n\r]*
__ "required whitespace" = [ \t]+

ifStatement
  = pre:[ \t]* "if" __ cond:ifExpression _ block:BlockStatement newline? {
      return {
        type: "IfStatement",
        condition: cond,
        body: block.body,
        indent: pre.join("")
      };
    }

forStatement
  = pre:[ \t]* "for" __ cond:forExpression _ block:BlockStatement newline? {
      return {
        type: "ForStatement",
        condition: cond,
        body: block.body,
        indent: pre.join("")
      };
    }

whileStatement
  = pre:[ \t]* "while" __ cond:whileExpression _ block:BlockStatement newline? {
      return {
        type: "WhileStatement",
        condition: cond,
        body: block.body,
        indent: pre.join("")
      };
    }

switchStatement
  = pre:[ \t]* "switch" __ cond:switchExpression _ block:SwitchBlockStatement newline? {
      return {
        type: "SwitchStatement",
        condition: cond,
        body: block,
        indent: pre.join("")
      };
    }

rawLine
  = !("}") line:$( (!newline .)+ ) newline? {
      return line;
    }

ifExpression
  = expr:$([^\n\r{}]+) {
      if (expr.includes("===")) {
        throw new SyntaxError("'===' is not allowed in T3. Please use '==' instead, which will be transpiled to strict equality.");
      }
      return expr.trim();
    }

whileExpression
  = expr:$([^\n\r{}]+) {
      if (expr.includes("===")) {
        throw new SyntaxError("'===' is not allowed in T3. Please use '==' instead, which will be transpiled to strict equality.");
      }
      return expr.trim();
    }

forExpression
  = expr:$([^\n\r{}]+) {
    if (expr.includes("===")) {
        throw new SyntaxError("'===' is not allowed in T3. Please use '==' instead, which will be transpiled to strict equality.");
      }
      return expr.trim();
    }

switchExpression
  = expr:$([^\n\r{}]+) {
      return expr.trim();
    }

caseStatement
  = pre:[ \t]* label:$("case" [^:\n\r]* ":") _ block:(BlockStatement / caseBlockContent) _ {
      return {
        type: "CaseStatement",
        label: label,
        block: block,
        hasBlock: block.type === "BlockStatement",
        indent: pre.join("")
      };
    }

defaultStatement
  = pre:[ \t]* label:$("default:") _ block:(BlockStatement / caseBlockContent) _ {
      return {
        type: "CaseStatement",
        label: label,
        block: block,
        hasBlock: block.type === "BlockStatement",
        indent: pre.join("")
      };
    }

switchCaseElement
  = caseStatement / defaultStatement

blockElement
  = ifStatement / forStatement / whileStatement / switchStatement / rawLine

BlockStatement
  = "{" _ newline* stmts:(blockElement _ newline*)* _ "}" {
      return {
        type: "BlockStatement",
        body: stmts.map(([stmt]) => stmt)
      };
    }

caseBlockContent
  = body:(caseContentLine _ newline*)* {
      return {
        type: "CaseBlockContent",
        body: body.filter(stmt => stmt !== null)
      };
    }

caseContentLine
  = !("case" / "default:") _ line:rawLine {
      return line;
    }

SwitchBlockStatement
  = "{" _ newline* stmts:(switchCaseElement _ newline*)* _ "}" {
      return {
        type: "SwitchBlockStatement",
        body: stmts.map(([stmt]) => stmt)
      };
    }