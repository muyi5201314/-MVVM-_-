const lowwerRexg = /^[a-z]*$/
// 组件检测正则
const componentRexg = /^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)+$/
const signTestRexgGlobal = /(\{\{)(.*?)(\}\})/g

// 可检测并提取v-for中(item, index) in list句型
const v_forComplexRexg = /^\s*\(\s*([a-zA-Z][a-z0-9A-Z]*)\s*,\s*([a-zA-Z][a-z0-9A-Z]*)\s*\)\s*in\s*([a-zA-Z][a-z0-9A-Z]*(.[a-zA-Z][a-z0-9A-Z]*)*)\s*$/
// 可检测并提取v-for中item in list句型
const v_forEasyRexg = /^\s*([a-zA-Z][a-z0-9A-Z]*)\s*in\s*([a-zA-Z][a-z0-9A-Z]*(.[a-zA-Z][a-z0-9A-Z]*)*)\s*$/
const attrRexg = /^/
// const functionRexg = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)\)\s*$/

export {
  lowwerRexg,
  componentRexg,
  signTestRexgGlobal,
  v_forComplexRexg,
  v_forEasyRexg,
  attrRexg,
}