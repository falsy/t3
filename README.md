# T3 Language

T3 is a minimal superset of TypeScript that makes JavaScript development cleaner and simpler.  
 It removes unnecessary clutter while preserving TypeScript's power.

## ✨ Features

- No required semicolons
- `if`, `for`, and similar statements without parentheses
- Cleaner syntax with familiar JS/TS semantics
- Simple CLI transpiler to convert `.t3` files to `.ts`

## 📦 Installation

```bash
npm install -g t3-lang
```

Or use with `npx`:

```bash
npx t3 path/to/file.t3
```

## 🔧 Usage

Transpile a `.t3` file to `.ts`:

```bash
t3 ./examples/test.t3 --outDir ./dist
```

If no `--outDir` is specified, output goes to the same directory with `.ts` extension.

## 📁 Project Structure

```
/src
  ├── grammar.pegjs      # Custom grammar rules
  ├── t3.ts              # CLI entry point
  ├── parser.ts          # Grammar parser using peggy
  └── transpiler.ts      # T3 → TS transpilation logic
```

## 📜 License

Apache License 2.0
