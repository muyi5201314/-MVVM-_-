// 获取真实父DOM
function getParentElm(vnode) {
  let parentNode = vnode.data.parentNode
  let tempVNode
  if(parentNode instanceof DocumentFragment) {
    tempVNode = parentNode._vnode
    parentNode = tempVNode.data.parentNode
  }
  return parentNode
}

export {
  getParentElm
}