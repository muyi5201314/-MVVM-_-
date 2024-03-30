import { tagType } from "../data.js"
import { setAttr } from "../render/tool/setAttr.js"

function beforeCreateNode(node){
  let elm
  switch(node.type) {
    case tagType.text:
      elm = document.createTextNode(node.val)
      break
    case tagType.element:
      elm = document.createElement(node.val)
      for(let item of node.attr) {
        if(item.key) {
          setAttr(elm, item.key, item.val)
        }
      }
      break
    default:
      break
  }
  return elm
}

export {
  beforeCreateNode
}