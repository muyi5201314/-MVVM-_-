import { tagType } from "../data.js"
import { exitNewNodeTrigger, newNodeTrigger } from "../reactive/proxy.js"
import { createV_forBlock } from "./block/createV_forBlock.js"
import { createV_ifBlock } from "./block/createV_ifBlock.js"
import { createVNode } from "./createVNode.js"
import { beforeCreateNode } from './beforeCreateNode.js'

// 创建vnode结点和Block区
function createNode(node, data) {
  let tempResult
  switch(node.type) {
    case tagType.component:
      // 组件已创建
      // if(node.data.hasCreated) {
      //   // 组件已改变，重新创建组件
      //   tempResult = hasStaticNode(node, data)
      //   // 组件不存在，重新创建组件
      // } else {
      //   tempResult = createComponent(node, data)
      //   node.data.hasCreated = true
      // }
      tempResult = createVNode(node, data)
      break
    case tagType.router:
      tempResult = createVNode(node, data)
      break
    case tagType.v_for:
      newNodeTrigger()
      tempResult = createV_forBlock(node, data)
      exitNewNodeTrigger()
      break
    case tagType.v_if:
      newNodeTrigger()
      tempResult = createV_ifBlock(node, data)
      exitNewNodeTrigger()
      break
    case tagType.svg:
    case tagType.element:
    case tagType.text:
      if(node.data.isDynamicNode) {
        tempResult = createVNode(node, data)
      }
      else {
        tempResult = {
          type: node.type,
          elm: beforeCreateNode({
            type: node.type, 
            val: node.val, 
            attr: node.attr, 
            children:[], 
            data: node.data, 
            key: node.key, 
            vueFlag: node.vueFlag
          }),
          children: [],
        }
        for(let i = 0, children_length = node.children.length; i < children_length; i++) {
          tempResult.children.push(createNode(node.children[i], data))
        }
        //console.log(tempResult);
      }
      break
    default:
      break
  }
  return tempResult
}

export {
  createNode
}