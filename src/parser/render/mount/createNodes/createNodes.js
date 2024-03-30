import { mountPotint } from "../../../../router/data.js"
import { createComponent, createRouter } from "../../../createNode/index.js"
import { tagType } from "../../../data.js"
import { createElement } from "./createElement.js"
import { createText } from "./createText.js"
import { createV_for } from "./createV_for.js"
import { createV_if } from "./createV_if.js"

function createNodes(vnode, container, beforeVNode) {
  let elm
  switch(vnode.type) {
    case tagType.component:
      elm = createComponent(vnode, container)
      vnode.data.parentNode = container
      vnode.data.beforeVNode = beforeVNode
      break
    case tagType.element:
    case tagType.svg:
      elm = createElement(vnode)
      break
    case tagType.text:
      elm = createText(vnode)
      break
    case tagType.v_if:
      elm = createV_if(vnode)
      vnode.data.parentNode = container
      vnode.data.beforeVNode = beforeVNode
      break
    case tagType.v_for:
      elm = createV_for(vnode)
      vnode.data.parentNode = container
      vnode.data.beforeVNode = beforeVNode
      break
    case tagType.router:
      elm = createRouter(vnode, container)
      vnode.data.parentNode = container
      vnode.data.beforeVNode = beforeVNode
      // 记录挂载点位置
      mountPotint.push(elm)
      break
    default:
      break
  }
  return elm
}

export {
  createNodes
}