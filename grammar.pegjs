start
  = body:(ifStatement / rawLine / newline / "}")* _ {
      return body.filter(x => x !== null && x !== undefined);
    }

newline
  = "\r\n" / "\n" / "\r"
_ "whitespace" = [ \t\n\r]*
__ "required whitespace" = [ \t]+

ifStatement
  = pre:[ \t]* "if" __ cond:expression _ block:BlockStatement newline? {
      return {
        type: "IfStatement",
        condition: cond,
        body: block,
        indent: pre.join("")
      };
    }

rawLine
  = !("if" __) !("}") line:$( (!newline .)+ ) newline? {
      return line;
    }

expression
  = expr:$( (!"{" .)+ ) {
      return expr.trim();
    }

blockElement
  = ifStatement / rawLine

BlockStatement
  = "{" _ newline* stmts:(blockElement _ newline*)* _ "}" {
      return {
        type: "BlockStatement",
        body: stmts.map(([stmt]) => stmt)
      };
    }