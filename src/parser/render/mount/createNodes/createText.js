// 创建文本结点
function createText(vnode) {
  // 创建文本节点
  if(!vnode.elm) {
    vnode.elm = document.createTextNode(vnode.val)
  }
  return vnode.elm
}

export {
  createText
}