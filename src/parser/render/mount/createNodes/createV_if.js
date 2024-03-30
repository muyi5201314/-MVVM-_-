import { createNodes } from "./createNodes.js"

function createV_if(vnode) {
  let dom = vnode.elm = document.createDocumentFragment()
  if(vnode.children.length) {
    vnode.elm.appendChild(createNodes(vnode.children[0], dom))
  }
  return vnode.elm
}

export {
  createV_if
}