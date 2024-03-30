// 插到某个dom元素之后
function insertAfter(parentNode, newNode, referenceNode) {
  if(referenceNode) {
    parentNode.insertBefore(newNode, referenceNode.nextSibling);
  } else {
    // 该节点为第一个节点
    let firstChild = parentNode.firstChild
    if(firstChild) {
      parentNode.insertBefore(newNode, firstChild)
    } else {
      parentNode.appendChild(newNode)
    }
  }
}

export {
  insertAfter
}