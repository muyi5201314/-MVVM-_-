import { tagType } from "../../data.js"
import { compareAttr } from "./compareAttr.js"
import { patchComponent } from "./patchNode/patchComponent.js"
import { patchText } from "./patchNode/patchText.js"
import { patchV_if } from "./patchNode/patchV_if.js"
import { quickDiff } from "./quickDiff.js"

function patch(oldVNode, newVNode) {
  // debugger
  let oldTempVNode, newTempVNode
  if(oldVNode.dynamicNodes) {
    for(let i=0, dynamicNodes_length = oldVNode.dynamicNodes.length; i<dynamicNodes_length; i++) {
      oldTempVNode = oldVNode.dynamicNodes[i]
      newTempVNode = newVNode.dynamicNodes[i]
      // if(oldTempVNode.type === tagType.text) {
      //   patchText(oldTempVNode, newTempVNode)
      // } else if(oldTempVNode.type === tagType.v_if) {
      //   patchV_if(oldTempVNode, newTempVNode)
      //   // //console.log(oldTempVNode.data.v_ifSelectIndex + '' + newTempVNode.data.v_ifSelectIndex);
      // } else if(oldTempVNode.type === tagType.v_for) {
      //   quickDiff(oldTempVNode, newTempVNode)
      //   // debugger
      //   oldTempVNode.children = newTempVNode.children
      // } else {
      //   compareAttr(oldTempVNode, newTempVNode)
      // }
      switch(oldTempVNode.type) {
        case tagType.text:
          patchText(oldTempVNode, newTempVNode)
          break
        case tagType.component:
          patchComponent(oldTempVNode, newTempVNode)
          break
        case tagType.v_if:
          patchV_if(oldTempVNode, newTempVNode)
          break
        case tagType.v_for:
          quickDiff(oldTempVNode, newTempVNode)
          oldTempVNode.children = newTempVNode.children
          break
        case tagType.element:
        case tagType.svg:
          compareAttr(oldTempVNode, newTempVNode)
          break
        default:
          break
      }
    }
  }
}

export {
  patch
}