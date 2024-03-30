import { isString } from "./typeJudge.js";

const functionRexg = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)\)\s*$/

function quickMatch(exp, data) {
  if(isString(exp)) {
    // const attrs = exp.split('.')
    // for(let i = 1, attrs_length = attrs.length; i < attrs_length; i++) {
    //   attr = attr[attrs[i]];
    //   if(attr === undefined || attr === null) {
    //     //console.warn(`${data}的${attrs[i]}可能为空，请注意`)
    //     return attr
    //   }
    // }
    if(data._v_forFlag) {
      let keys = Object.keys(data)
      let attr = new Function(`${keys[0]}, ${keys[1]}, ${keys[2]}, ${keys[3]}`,
        `return ${exp}`)
      return attr(data[keys[0]], data[keys[1]], data[keys[2]], data[keys[3]])
    } else {
      // let attr = new Function('data', 'return ' + exp)(data)
      let attr = eval(exp)
      return attr
    }
  }
}

function bandEvent(exp, data) {
  if(functionRexg.test(exp)) {
    if(data._v_forFlag) {
      let keys = Object.keys(data)
      let funString = RegExp.$1
      let fun = data.data.methods[funString]
      let completeFunString = 'fun(' + RegExp.$2 + ', event)'
      let muyi = new Function(`${keys[0]}, ${keys[1]}, ${keys[2]}, ${keys[3]}, fun, event`, 
        `return ${completeFunString}`)
      return (event) => {
        return muyi(data[keys[0]], data[keys[1]], data[keys[2]], data[keys[3]], fun, event)
      }
    } else {
      let funString = RegExp.$1
      let fun = data.methods[funString]
      let completeFunString = 'fun(' + RegExp.$2 + ', event)'
      return (event) => {
        return eval(completeFunString)
      }
    }
  } else {
    return data._v_forFlag ? data.data.methods[exp] : data.methods[exp]
  }
}

export {
  quickMatch,
  bandEvent,
}