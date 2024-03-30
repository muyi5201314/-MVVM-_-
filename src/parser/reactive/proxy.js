import { Stack } from '../../utils/tool/stack.js'
import {isString, stringIsFunction, isObject, isNumber, isArray, isFunction, type} from '../../utils/tool/typeJudge.js'
import {quichNodeTypeMatch, tagState, tagType, MYVUEFLAGES} from '../data.js'
import { isProxy } from './judge.js'

// 全局依赖库
const proxyWeakMap = new WeakMap()
// 观察者栈， 用于组件递归
const watcherStack = new Stack()
// 当前的执行者
let targetWatcher = null
// 当前的展示执行者, 该执行者用于v-for/v-if新添节点建立依赖
let tempTargetWatcher = null
// 暂时执行者栈， 保存暂时执行者
const tempWatcherStack = new Stack()
// 执行调度，使用set过滤掉相同的任务
const schedulerSet = new Set()

// 是否正在执行调度
let isScheduler = false
// 微任务，收集宏任务期间产生的任务
const p = Promise.resolve()

// 默认调度函数
function defaultScheduler(fn) {
  schedulerSet.add(fn)
  // 正处于调度中，不允许其他调度进入
  if(isScheduler) {
    return
  }
  // 防止其他调度函数进入
  isScheduler = true
  p.then(() => {
    schedulerSet.forEach(item => item())
  }).finally(() => {
    // 清除不影响下次使用
    schedulerSet.clear()
    // 结束调度
    isScheduler = false
  })
}

// 创造一个沙盒
function createWatherBox(watcher) {
  // 保存上一级观察者
  watcherStack.push(targetWatcher)
  targetWatcher = watcher
}

// 退出沙盒
function exitWatcherBox() {
  // 恢复上一层观察者
  targetWatcher = watcherStack.get()
  watcherStack.pop()
}

function saveTempTargetWatcher(watcher) {
  // tempTargetWatcher = watcher
  tempWatcherStack.push(tempTargetWatcher)
  tempTargetWatcher = watcher
}

function deleteTempTargetWatcher() {
  tempTargetWatcher = tempWatcherStack.get()
  tempWatcherStack.pop()
  // return tempTargetWatcher
}

// 新分支添加依赖
function newNodeTrigger() {
  // 保存上一级观察者
  if(tempTargetWatcher) {
    watcherStack.push(targetWatcher)
    targetWatcher = tempTargetWatcher
  }
}

// 退出新分支
function exitNewNodeTrigger() {
  // 恢复上一层观察者
  // targetWatcher = watcherStack.get()
  // watcherStack.pop()
  if(tempTargetWatcher) {
    targetWatcher = watcherStack.get()
    watcherStack.pop()
  }
}
/**
 * 观察者
 * target: 绑定变量
 * exp: 表达式
 * fn: 目标方法
 * options { 执行策略
 *  scheduler  调度函数
 *  lazy 是否懒加载
 * }
 **/
class Watcher {
  constructor(fn, options = {scheduler: defaultScheduler, lazy: false}, data = {}) {
    this.fn = fn
    this.options = options
    this.otherWatcher = []
    // 保存上一级观察者
    watcherStack.push(targetWatcher)
    targetWatcher = this
    // 触发Proxy的get代理，保存观察者
    this.fn()
    // 恢复上一层观察者
    targetWatcher = watcherStack.get()
    watcherStack.pop()
  }

  // 触发方法
  notify() {
    if(this.options?.scheduler) {
      this.options.scheduler(this.fn)
    } else {
      this.fn()
    }
  }

  // 该代理元素与其他代理绑定，该代理改变时，会影响其他代理
  clearOther() {
    for(let i = 0, otherWatcher_length = this.otherWatcher.length; i < otherWatcher_length; i++) {
      
    }
  }
}

function watchEffect(source, cb) {
  let getters
  if(isFunction(source)) {
    getters = source
  } else {
    getters = () => traverse(value)
  }
  let newVal, oldVal
  new Watcher(
    getters,
    {
      lazy: true,
      scheduler() {
        newVal = getters()
        cb(oldVal, newVal)
        oldVal = newVal
      }
    }
  ),
  oldVal = getters()
}

const traverse = (value, seen = new Set()) => {
  if(typeof value !== 'object' || value === null || seen.has(value)) {
    return;
  }
  for(const k in value) {
    traverse(value[k], seen)
  }
  return traverse
}

/** 
 * 参数规定：
 * proxyData为代理数据
 * key为代理数据的属性名称
 * attrName为该Elemnt结点的属性名称
 * attrVal为该Elemnt结点的属性值
 * node为Elemnt结点
 */
// const watcherExec = {
//   [MYVUEFLAGES.CLASS]: function (proxyData, attrName, attrVal, node) {
//     // 这里是没有绑定关系的
//     const tempFn = new Function('data', 'return ' + attrVal)
//     function fn() {
//       const result = tempFn(proxyData)
//       node.classList = result
//     }
//     new Watcher(proxyData, attrVal, fn)
//   },
//   [MYVUEFLAGES.STYLE]: function (proxyData, attrName, attrVal, node) {
//     const tempFn = new Function('data', 'return ' + attrVal)
//     function fn() {
//       const result = tempFn(proxyData)
//       node.style = result
//     }
//     new Watcher(proxyData, attrVal, fn)
//   },
//   [MYVUEFLAGES.ATTR]: function (proxyData, attrName, attrVal, node) {
//     const tempFn = new Function('data', 'return ' + attrVal)
//     function fn() {
//       const result = tempFn(proxyData)
//       node.setAttribute(attrName, result)
//     }
//     new Watcher(proxyData, attrVal, fn)
//   },
//   [MYVUEFLAGES.V_FOR]: function (args) {
//     // const tempFn = new Function(value)
//     // if (stringIsFunction(value)) {
//     //   fn = function () {
//     //     tempFn()
//     //     fn()
//     //   }
//     // }
//     // new Watcher(proxyData, key, fn)
//   },
//   [MYVUEFLAGES.V_IF]: function (proxyData, attrName, attrVal, node) {
//     const tempFn = new Function('data', 'return ' + attrVal)
//     function fn() {
//       const result = tempFn(proxyData)
//       if (result) {
//         node.classList.remove('none')
//       } else {
//         node.classList.add('none')
//       }
//     }
//     new Watcher(proxyData, attrVal, fn)
//   },
//   [MYVUEFLAGES.V_MODEL]: function (proxyData, attrName, attrVal, node) {
//     const tempFn = new Function('data', 'return ' + attrVal)
//     // 将input的值赋给代理
//     const inputFn = new Function('data, value', attrVal + '= value')
//     const tempResult = tempFn(proxyData)
//     if (!isNumber(isNumber) && !isString(tempResult)) {
//       throw new Error('v-model绑定的类型必须是number或string类型')
//     }
//     function fn() {
//       const result = tempFn(proxyData)
//       node.value = result
//     }
//     node.addEventListener('input', (event) => {
//       inputFn(proxyData, event.target.value)
//     })
//     new Watcher(proxyData, attrVal, fn)
//   },
//   [MYVUEFLAGES.TEXT]: function (proxyData, val, node) {
//     const tempFn = new Function('data', 'return ' + val)
//     function fn() {
//       const result = tempFn(proxyData)
//       node.textContent = JSON.stringify(result)
//     }
//     new Watcher(proxyData, val, fn)
//   }
// }

// 保存观察者
function track(target, key, watcher) {
  let tempMap = proxyWeakMap.get(target)
  if (!tempMap) {
    tempMap = new Map()
    proxyWeakMap.set(target, tempMap)
  }
  let tempSet = tempMap.get(key)
  if (!tempSet) {
    tempSet = new Set()
    tempMap.set(key, tempSet)
  }
  tempSet.add(watcher)
}

// 触发观察者
function trigger(target, key, type, newVal) {
  let tempMap = proxyWeakMap.get(target)
  let tempSet

  // 数组操作
  if(isArray(target)) {
    // debugger
    if(type === 'add' || type === 'delete') {
      tempSet = tempMap.get('length')
      for(let item of tempSet) {
        item.notify()
      }
      // 直接修改数组的长度
    } else if (key === 'length') {
      for(let i = newVal, target_length = target.length; i < target_length; i++) {
        tempSet = tempMap.get(i)
        //console.log(tempSet);
        for(let item of tempSet) {
          item.notify()
        }
      }
    }
    return
  }

  tempSet = tempMap?.get(key)
  //console.log(tempSet);

  if(tempSet) {
    targetWatcher && tempSet.forEach((item) => {
      if(targetWatcher === item) {
        return
      }
    })

    for (let item of tempSet) {
      item.notify()
    }
  }
}

// 建立代理关系
function createProxy(data, isShallow = true, isReadOnly = false) {
  const dataProxy = new Proxy(data, {
    set(target, key, newVal, receiver) {
      if(isReadOnly) {
        //console.warn(`属性${key}只可读取, 不可修改`);
        return
      }
      //console.log('set ===> ' + key);
      // 判断该属性是否存在于该类型中
      let type = Object.prototype.hasOwnProperty.call(target, key) ? 'set' : 'add'
      if(isArray(target)) {
        // 数组添加新元素
        if(key === 'length') {
          if(newVal < target.length) {
            type = 'delete'
          }
        } else if(Number(key) >= target.length){
          type = 'add'
        }
      } else {
        let oldVal = target[key]
        // 没有赋新值则直接返回
        if (oldVal === newVal || (oldVal !== oldVal && newVal !== newVal)) {
          return true
        }
      }
      // 第四个参数主要是修改this
      Reflect.set(target, key, newVal, receiver)
      trigger(target, key, type, newVal)
      return true
    },
    get(target, key, receiver) {

      try{
        //console.log('get ===> ' + key);
      }catch{
      }

      // 用于判断是否为响应式对象
      if(key === '_is_proxy') {
        return true
      }

      if (targetWatcher) {
        track(target, key, targetWatcher)
      }

      // 第三个参数主要是修改this
      let res =  Reflect.get(target, key, receiver)
      // 对object和array开始深度代理
      if(isShallow && !isProxy(res) && (isObject(res) || isArray(res))) {
        // 不更改原始样式，防止代理污染
        return createProxy(res, isShallow, isReadOnly)
      }
      return res
    },
    delete(target, key, receiver) {
      //console.log('delete ===> ' + key);
      if(isReadOnly) {
        //console.warn(`属性${key}只可读取, 不可删除`)
        return
      }
      type = 'delete'
      Reflect.delete(target, key, newVal, receiver)
      trigger(target, key, type, newVal)
    },
    apply(target, thisArg, argumentsList) {
      //console.log(target);
      //console.log(thisArg);
      //console.log(argumentsList);
      return target()
    }
  })
  return dataProxy
}

export {
  createProxy, 
  proxyWeakMap, 
  Watcher,
  createWatherBox,
  exitWatcherBox,
  watchEffect,
  newNodeTrigger,
  exitNewNodeTrigger,
  saveTempTargetWatcher,
  deleteTempTargetWatcher,
}