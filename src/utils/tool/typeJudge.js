
// //console.log(Object.prototype.toString.call("jerry"));//[object String]
// //console.log(Object.prototype.toString.call(12));//[object Number]
// //console.log(Object.prototype.toString.call(true));//[object Boolean]
// //console.log(Object.prototype.toString.call(undefined));//[object Undefined]
// //console.log(Object.prototype.toString.call(null));//[object Null]
// //console.log(Object.prototype.toString.call({name: "jerry"}));//[object Object]
// //console.log(Object.prototype.toString.call(function(){}));//[object Function]
// //console.log(Object.prototype.toString.call([]));//[object Array]
// //console.log(Object.prototype.toString.call(new Date));//[object Date]
// //console.log(Object.prototype.toString.call(/\d/));//[object RegExp]
// function Person(){};
// //console.log(Object.prototype.toString.call(new Person));//[object Object]
const stringIsFunctionRexg = /^[a-zA-Z0-9]&/
const type = {
  'string': '[object String]',
  'number': '[object Number]',
  'boolean': '[object Boolean]',
  'undefined': '[object Undefined]',
  'array': '[object Array]',
  'null': '[object Null]',
  'object': '[object Object]',
  'function': '[object Function]',
  'date': '[object Date]',
  'refExp': '[object RegExp]',
}

function typeJudge(item) {
  return Object.prototype.toString.call(item)
}

function isString (item)  {
  return Object.prototype.toString.call(item) === type['string']
}

function isFunction (item) {
  return Object.prototype.toString.call(item) === type['function']
}

function isObject (item) {
  return Object.prototype.toString.call(item) === type['object']
}

function isNumber (item) {
  return Object.prototype.toString.call(item) === type['number']
}

function isArray (item)  {
  return Object.prototype.toString.call(item) === type['array']
}

function isRefExp (item)  {
  return Object.prototype.toString.call(item) === type['refExp']
}

function isDate (item)  {
  return Object.prototype.toString.call(item) === type['date']
}

function isBoolean (item) {
  return Object.prototype.toString.call(item) === type['boolean']
}

function isNull (item) {
  return Object.prototype.toString.call(item) === type['null']
}

function isUndefined (item) {
  return Object.prototype.toString.call(item) === type['undefined']
}

function stringIsFunction (item) {
  return stringIsFunction.text(item)
}

export {
  type,
  typeJudge,
  isString,
  isFunction,
  isObject,
  stringIsFunction,
  isNumber,
  isArray,
  isNull,
  isDate,
  isUndefined,
  isBoolean,
  isRefExp,
}