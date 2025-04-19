const i = 0
const b = 0
if (i < 10) {
  console.log("true")
}
if (true) {
  console.log("false")
  console.log("new-line")
}
if (i < 10) {
  console.log("true")
  if (true) {
    const aaa = 1
    console.log("false")
    if (false) {
      console.log("hello")
    }
    const bbb = 2
  }
}
if (i < 10) {
  const ccc = 3
  console.log("world")
  if (i < 5) {
    console.log("inner")
  }
}
if (i > 10) {
  console.log("no error")
}
if (isTest()) {
  console.log("ok")
}
function isTest() {
  var a = 1
  if (a < 0) {
    a = 10
    if (a > 10) {
      a = 5
    }
  }
  console.log(a)
  return true
}