function patchText(oldVNode, newVNode) {
  // debugger
  if(oldVNode.val !== newVNode.val) {
    oldVNode.val = newVNode.val
    // if(oldVNode.elm?.textContent) {
    oldVNode.elm.textContent = newVNode.val
    // }
  }
  // document.createTextNode()
}

export {
  patchText
}