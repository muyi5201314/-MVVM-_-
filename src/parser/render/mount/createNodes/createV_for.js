import { createNodes } from "./createNodes.js"

function createV_for(vnode) {
  let dom = vnode.elm = document.createDocumentFragment()
  let beforeVNode = null
  for(let i=0, children_length = vnode.children.length; i < children_length ;i++) {
    let tempResult = createNodes(vnode.children[i], dom, beforeVNode)
    vnode.elm.appendChild(tempResult)
    beforeVNode = vnode.children[i]
  }
  return vnode.elm
}

export {
  createV_for
}