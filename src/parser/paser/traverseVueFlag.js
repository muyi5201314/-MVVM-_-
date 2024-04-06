import { Queue } from "../../utils/tool/queue.js"
import { MYVUEFLAGES, tagType } from "../data.js"
import { signTestRexgGlobal, v_forEasyRexg, v_forComplexRexg } from "./data.js"

// 收集v-if指令
let trackV_ifNode = null
// 收集v-if指令的值
let trackV_ifVal = null
// 是否处于v-if收集状态
let isTrackV_if = false
// 解析自定义属性
// 保存孩子结点
let childrenStack = new Queue()
// 因为v-if指令需要绑定兄弟结点，需要采用层级递归
function traverseVueFlag1(ast) {
  let tempAst = null
  // 是否有v-if相关属性属性
  let hasV_else = false
  switch (ast.type) {
    case tagType.router:
      if (ast.children.length) {
        childrenStack.push(ast.children)
      }
      break
    case tagType.component:
    case tagType.element:
    case tagType.svg:
      if (ast.children.length) {
        childrenStack.push(ast.children)
      }
      let fch, sech, tempKey, attr = ast.attr
      for (let i = 0, attr_length = attr.length; i < attr_length; i++) {
        fch = attr[i].key[0]
        // 绑定事件
        if (fch === '@') {
          // if(functionRexg.test(attr[i].val)) {
          //   attr[i].val = RegExp.$1
          //   let temp = RegExp.$2
          //   let argusList = temp.split(",")
          //   for(let j = 0, argusList_length = argusList.length; j < argusList_length; j++) {
          //     argusList[j] = argusList[j].trim()
          //   }
          //   attr[i].argumentList = argusList
          // }
          tempKey = 'on' + attr[i].key.substring(1)
          attr[i].vueFlag = MYVUEFLAGES.EVENT
          attr[i].key = tempKey
          ast.data.isDynamicNode = true
          //console.log(attr[i].val);
          // 绑定事件
        } else if (fch === ':') {
          tempKey = attr[i].key.substring(1)
          ast.data.isDynamicNode = true
          if (tempKey === 'class') {
            attr[i].vueFlag = MYVUEFLAGES.CLASS
            attr[i].key = tempKey
          } else if (tempKey === 'style') {
            attr[i].vueFlag = MYVUEFLAGES.STYLE
            attr[i].key = tempKey
          } else {
            attr[i].vueFlag = MYVUEFLAGES.ATTR
            attr[i].key = tempKey
          }
          ast.data.isDynamicNode = true
        } else if (attr[i].key.startsWith('v-')) {
          switch (attr[i].key) {
            case 'v-if':
              // 开始进入v-if收集状态
              isTrackV_if = true
              hasV_else = true
              tempAst = {
                type: tagType.v_if,
                attr: [],
                data: {
                  vueFlagVal: `if(${attr[i].val}) {
                    return 0
                  }`,
                  v_ifChildren: [ast],
                  isDynamicNode: true
                }
              }
              // 开始收集v-if结点集
              trackV_ifNode = tempAst.data.v_ifChildren
              // 闭包，记得清除
              trackV_ifVal = (val) => {
                tempAst.data.vueFlagVal += val
              }
              // 删除v-if属性
              attr[i].key = null
              break
            case 'v-else-if':
              if(isTrackV_if) {
                hasV_else = true
                trackV_ifNode.push(ast)
                trackV_ifVal(`else if(${attr[i].val}){
                  return ${trackV_ifNode.length - 1}
                }`)
                attr[i].key = null
              }
              break
            case 'v-else':
              if(isTrackV_if) {
                hasV_else = true
                trackV_ifNode.push(ast)
                trackV_ifVal(`else {
                  return ${trackV_ifNode.length - 1}
                }`)
                attr[i].key = null
              }
              break
            case 'v-for':
              {
                attr[i].key = null
                let item, index, list
                if(v_forEasyRexg.test(attr[i].val)) {
                  item = RegExp.$1
                  list = RegExp.$2
                } else if(v_forComplexRexg.test(attr[i].val)) {
                  item = RegExp.$1
                  index = RegExp.$2
                  list = RegExp.$3
                } else {
                  //console.warn("v-for句型错误");
                  // 舍弃v-for属性
                  break
                }
                // 属性key设为null, 不会设置到dom元素中
                attr[i].key = null
                // 更改标签的种类，标记为v-for暂缓区
                tempAst = {
                  type: tagType.v_for,
                  children: [],
                  attr: [],
                  data: {
                    v_forItem: item, 
                    v_forIndex: index, 
                    v_forList: list, 
                    v_forKey: ast.v_key,
                    v_forChildren: ast,
                    isDynamicNode: true,
                  },
                }
              }
              break
            case 'v-key':
                // 属性key设为null, 不会设置到dom元素中
                attr[i].key = null
                // 将v-key的值保存到ast上
                if(tempAst) {
                  tempAst.data.v_forKey = attr[i].val
                } else {
                  // 展示放到v_key上， 这个属性不会放到vnode上
                  ast.v_key = attr[i].val
                }
                break
            case 'v-model':
              // 属性key设为null, 不会设置到dom元素中
              attr[i].key = 'v-model'
              attr[i].vueFlag = MYVUEFLAGES.V_MODEL
              ast.data.isDynamicNode = true
              // attr.push({key: '@input', val: attr[i].val})
              break
            default:
              break
          }
        }
      }

      // 该节点没有v-if想关指令，结束v-if收集状态
      if(!hasV_else) {
        isTrackV_if = false
        trackV_ifNode = null
        trackV_ifVal = null
      }
      break
    case tagType.text:
      if (signTestRexgGlobal.test(ast.val)) {
        // 去除包裹的{{}}
        // 总结，$0为整体，参数我也不知道为什么这样才行，少了就没办法
        ast.val = ast.val.replace(signTestRexgGlobal, ($0, $1, $2) => {
          return $2.trim()
        })
        ast.data.isDynamicText = true
        ast.data.isDynamicNode = true
      }
      break
    default:
      break
  }
  // 经过v-else-if结点
  if(hasV_else) {
    ast = null
  }
  return tempAst ?? ast
}

function traverseVueFlag(ast) {
  let childrenNodes, item
  traverseVueFlag1(ast)
  // childrenStack.push(ast)
  // // 层级递归
  // while(childrenNodes = childrenStack.get()) {
  //   childrenStack.pop()
  //   for(let i=0; i < childrenNodes.length; i++) {
  //     item = traverseVueFlag1(childrenNodes[i])
  //     if(item) {
  //       childrenNodes[i] = item
  //     } else {
  //       childrenNodes.splice(i, 1)
  //       //console.log('删除');
  //       i--
  //     }
  //   }
  // }
  while(!childrenStack.empty()) {
    let childrenSize = childrenStack.nowCapacity
    for(let i = 0; i < childrenSize; i++) {
      childrenNodes = childrenStack.get()
      childrenStack.pop()
      for(let j = 0; j < childrenNodes.length; j++) {
        item = traverseVueFlag1(childrenNodes[j])
        if(item) {
          childrenNodes[j] = item
        } else {
          childrenNodes.splice(j, 1)
          //console.log('删除');
          j--
        }
      }
    }
  }
  console.log(ast);
}

export {
  traverseVueFlag
}