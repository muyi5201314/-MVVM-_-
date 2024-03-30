import { quickMatch } from "../../../utils/tool/quickMatch.js"
import { isArray } from "../../../utils/tool/typeJudge.js"
import { VNode } from "../../data.js"
import { createProxy } from "../../reactive/proxy.js"
import { createBlock } from "../createBlock.js"
import { createNode } from "../createNode.js"
import { dynamicNodesStack } from "../data.js"

// 建立v-for专属block区
function createV_forBlock(node, data, beforeVNode) {
  let vnode = new VNode({type: node.type, val: node.val, attr: node.attr, children:[], data: node.data, key: node.key, vueFlag: node.vueFlag})
  let currentDynamicNodes = dynamicNodesStack.get()
  currentDynamicNodes.push(vnode)
  
  vnode.data.beforeVNode = beforeVNode
  let item = vnode.data.v_forItem
  let index = vnode.data.v_forIndex
  let list = vnode.data.v_forList
  let childNode = vnode.data.v_forChildren
  let v_forKey = vnode.data.v_forKey

  let dataList = quickMatch(list, data)
  let v_forData
  if(!isArray(dataList)) {
    return vnode
  }

  let createFn = () => {
    for(let i=0, dataList_length = dataList.length; i<dataList_length; i++) {
      v_forData = createProxy({
        _v_forFlag: true,
        // 链条
        data: data._v_forFlag ? data.data : data,
      })
      v_forData[item] = dataList[i]
      v_forData[index] = i
      // debugger
      let childVNode = createBlock(childNode, () => {
        // debugger
        return createNode(childNode, v_forData)
      })
      childVNode.key = quickMatch(v_forKey, v_forData)
      vnode.children.push(childVNode)
    }
    return vnode
  }
  createBlock(childNode, createFn)
  return vnode
}

export {
  createV_forBlock
}