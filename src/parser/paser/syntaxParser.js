import { quichNodeTypeMatch, tagState, tagType } from "../data.js"
import { componentRexg } from './data.js'

let tokensIndex = 0

// 词法准备
const syntaxInit = (tokens, RootType) => {
  const ast = {
    val: '',
    type: RootType,
    attr: [],
    children: [],
    data: {},
  }
  tokensIndex = 0
  const labelList = ast.children
  for(let tokens_length = tokens.length; tokensIndex < tokens_length; tokensIndex++) {
    labelList.push(syntaxParser(tokens))
  }
  return ast
}

// 词法解析
function syntaxParser(tokens) {
  // //console.log('嵌套' + tokensIndex);
  let node
  if (tokens[tokensIndex].type === tagState.start) {
    let matchResult = quichNodeTypeMatch[tokens[tokensIndex].val]
    if (matchResult) {
      node = {
        type: matchResult,
        val: tokens[tokensIndex].val,
        attr: [],
        children: [],
        data:{}
      }
      node.type = matchResult
      node.val = tokens[tokensIndex].val
      // 组件
    } else if (componentRexg.test(tokens[tokensIndex].val)) {
      node = {
        type: tagType.component,
        val: tokens[tokensIndex].val,
        attr: [],
        children: [],
        data:{}
      }
    }
    tokensIndex++
    // 防止数组越界
    while (tokens[tokensIndex].type !== tagState.end) {
      if (tokens[tokensIndex].type === tagState.start) {
        let temp = syntaxParser(tokens)
        node.children.push(temp)
        tokensIndex++
      } else if (tokens[tokensIndex].type === tagState.complexAttr || tokens[tokensIndex].type === tagState.attr) {
        let i, token_val_length
        for(i=0, token_val_length = tokens[tokensIndex].val.length; i < token_val_length; i++) {
          if(tokens[tokensIndex].val[i] === '='){
            break
          }
        }
        let key = tokens[tokensIndex].val.slice(0, i)
        let val = i === tokens[tokensIndex].val.length ? '' : tokens[tokensIndex].val.slice(i + 1, tokens[tokensIndex].val.length)
        // debugger
        node.attr.push({ key, val })
        tokensIndex++
      } else if (tokens[tokensIndex].type === tagState.text) {
        node.children.push({
          type: tagType.text,
          val: tokens[tokensIndex].val,
          attr: [],
          children: [],
          data:{}
        })
        tokensIndex++
      }
    }
    // //console.log('结束' + tokensIndex);
    // 单独的文本结点
  } else if (tokens[tokensIndex].type === tagState.text) {
    node = {
      val: tokens[tokensIndex].val,
      type: tagType.text,
      children: [],
      attr: [],
      data:{}
    }
  }
  return node
}

export {
  syntaxInit
}