const i = 0
const j = 1
const k = 2
if (i > j) {
  console.log("hello world")
}
if (j === 1) {
  console.log("hello world")
}
if ((i === 0 && j === 1) || i === 0) {
  ;(window as any).alert("hello world")
  if (j === 1) {
    const k = 4
    if (k === 4) {
      console.log("hello world")
    }
  }
}
function test(): boolean {
  return false
}
if (test()) {
  console.log("hello world")
}