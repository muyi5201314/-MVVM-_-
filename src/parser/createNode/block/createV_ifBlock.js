import { tagType, VNode } from "../../data.js"
import { createBlock } from "../createBlock.js"
import { createNode } from "../createNode.js"
import { currentDynamicNodes, dynamicNodesStack } from "../data.js"

// 建立v-if专属block区
function createV_ifBlock(node, data, beforeVNode) {
  let vnode = new VNode({type: node.type, val: node.val, attr: node.attr, children:[], data: node.data, key: node.key, vueFlag: node.vueFlag})
  let currentDynamicNodes = dynamicNodesStack.get()
  currentDynamicNodes.push(vnode)
  let getChildNodeIndex, index
  if(data._v_forFlag) {
    let keys = Object.keys(data)
    getChildNodeIndex = new Function(`${keys[0]}, ${keys[1]}, ${keys[2]}, ${keys[3]}, fun, event`, 
        `${vnode.data.vueFlagVal}`)
    index = getChildNodeIndex(data[keys[0]], data[keys[1]], data[keys[2]], data[keys[3]])
  } else {
    getChildNodeIndex = new Function("data", vnode.data.vueFlagVal)
    index = getChildNodeIndex(data)
  }
  // 保存此次v-if选择的分支下标,只有分支下标相同比较动态节点才有意义
  vnode.data.v_ifSelectIndex = index
  vnode.data.beforeVNode = beforeVNode
  // 没有选择的分支
  if(!index && index !== 0) {
    return vnode
  }

  // 子节点原型
  let childNode = node.data.v_ifChildren[index]
  //console.log(index);
  let childVNode
  let createFn

  switch(childNode.type) {
    case tagType.v_for:
      throw new Error('v-for和v-if不可以一起使用')
      break
    case tagType.router:
    case tagType.component:
    case tagType.text:
    case tagType.element:
    case tagType.svg:
      createFn = () => {
        childVNode = createNode(childNode, data)
        vnode.children.push(childVNode)
        return vnode
      }
      createBlock(childNode, createFn)
      break
    default:
      break
  }
  // debugger
  return vnode
}

export {
  createV_ifBlock
}