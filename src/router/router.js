import {Stack} from '../utils/tool/stack.js'
import {beforeEach, afterEach, beforeLeave} from './dynamic.js'
import {isFunction} from '../utils/tool/typeJudge.js'
import routerSetting from './routerSetting.js'
import { mountPotint } from './data.js'
import { getParentElm } from '../parser/render/tool/getParentElm.js'
import { unMount } from '../parser/render/unMount/unMount.js'
import { createVNode } from '../parser/createNode/createVNode.js'
import { insertAfter } from '../parser/render/tool/insertAfter.js'
import { createTempRouter } from '../parser/createNode/block/createTempRouter.js'
import { getLocalStorage } from '../utils/storage/localStorage.js'

let _instanll

// 路由匹配
class Router{
  // 私有属性
  #routerStore
  #routerIndex
  #oldPath
  #oldArgus
  #lostNameRouterNum
  #router
  constructor(router) {
    // 路由表
    this.#router = this.#_initRouter(router)
    // 保存路由路径中所用到的组件
    this.#routerStore = [this.#router['/']] ?? []
    // 上面路由路径中的路标
    this.#routerIndex = this.#routerStore ? 0 : -1
    // 路由参数
    this.query = {}
    // 当前路由路径
    this.currentRouterPath = getLocalStorage('routerPath') ?? ''
    this.#oldPath = []
    this.#oldArgus = []
    // 保存因为路由省略掉的子路由组件数量
    this.#lostNameRouterNum = 0
    if(this.currentRouterPath) {
      // let this.quichSlice(this.currentRouterPath)
      
      // this.entryRouter(this.currentRouterPath)
    }
  }

  getRouterTemp() {
    console.log(JSON.stringify(this.#router));
  }

  // 添加路由
  addRouter(router) {
    let temp = this.#router
    const {path, argus} = this.quichSlice(router.path)
    for(let i=0, path_length = path.length - 1; i < path_length; i++) {
      temp = this.#router[path[i]]?.children
      if(!temp) {
        //console.warn('路由添加失败，中间路由缺失');
        return
      }
    }
    temp[path[path.length - 1]] = router
  }

  // 删除路由
  removeRouter(routePath) {
    let temp = this.#router
    const {path, argus} = this.quichSlice(router.path)
    for(let i=0, path_length = path.length - 1; i < path_length; i++) {
      temp = this.#router[path[i]]?.children
      if(!temp) {
        // //console.warn('路由删除失败，中间路由缺失');
        return
      }
    }
    temp[path[path.length - 1]] = undefined
  }

  // 路由切割
  quichSlice(routerPath) {
    //console.log(routerPath);
    let {path, argus} = routerPath.split('?')
    path = path ?? routerPath
    path = path.split('/')?.filter(item => item !== '')
    //console.log(path, argus);
    argus = argus?.split('&')?.filter(item => item !== '')
    return {
      path,
      argus,
    }
  }

  // 路由设值
  setArgus(argus) {
    this.query = {}
    if(argus) {
      for(let item of argus) {
        const {key, value} = item.split('=')
        this.query[key] = value
      }
    }
  }

  getRouterPath() {
    return this.currentRouterPath
  }

  // 路由匹配，找到路由对应的组件
  #routerMatch(path) {
    // let index
    // // 为避免重定向，组件先放在这里面
    // let tempComponent = []
    // for(index = this.#oldPath.length - 1; index >=0; index--) {
    //   if(path[index] === this.#oldPath[index]) {
    //     break
    //   }
    // }
    // // 执行页面组件的beforeRouterLeave函数
    // for(let i=0, tempNum = this.#oldPath.length - 1 - index + this.#lostNameRouterNum, item; i<tempNum; i++) {
    //   item = beforeLeave.get()
    //   beforeLeave.pop()
    //   isFunction(item) && item()
    // }
    // let tempRouter = this.#router
    // // 获取
    // for(let i = 0; i <= index; i++) {
    //   tempRouter = this.#router[path[i]]?.children
    //   if(!tempRouter) {
    //     //console.warn('该页面不存在');
    //     this.redirect('/404')
    //     return
    //   }
    // }
    // // 将路径中用到的组件放到队列中
    // for(let i = index + 1; i < path.length; i++) {
    //   tempRouter = tempRouter[path[i]]
    //   if(!tempRouter) {
    //     //console.warn('该页面不存在');
    //     this.redirect('/404')
    //     return
    //   }
    //   tempComponent.push(tempRouter.component)
    //   tempRouter = tempRouter.children
    // }
    // //console.log(tempRouter);
    // this.#routerIndex = index + 1
    // // 补全路由组件
    // while(tempRouter = tempRouter['/']) {
    //   this.#routerStore[this.#routerStore.length - 1] = tempRouter?.component
    //   if(tempRouter.children) {
    //     tempRouter = tempRouter.children
    //   }
    // }
    // // 最后的路由路径重定向
    // if(tempRouter?.redirect) {
    //   this.redirect(tempRouter.redirect)
    // }

    // // 没有重定向，将缓存的数据放到共享数组中
    // for(let i = index + 1, j = 0; i < path.length; i++, j++) {
    //   this.#routerStore[i] = tempComponent[j]
    // }
    let index, path_length = path.length
    // 为避免重定向，暂存组件
    let tempComponent = []
    let tempRouter = this.#router
    let oldPath_length = this.#oldPath.length
    let minLength = path_length < oldPath_length ? path_length : oldPath_length
    // 跳过前后路由相同的部分
    for(index = 0; index < minLength; index++) {
      if(path[index] !== this.#oldPath[index]) {
        break
      }
      tempRouter = tempRouter[path[i]].children
    }
    for(let i = index; i < path_length; i++) {
      tempRouter = tempRouter[path[i]]
      if(!tempRouter) {
        //console.warn('该页面不存在')
        this.redirect('404')
        return true
      }
      tempComponent.push(tempRouter)
      tempRouter = tempRouter.children
    }
    if(tempRouter['/']) {
      tempComponent.push(tempRouter['/'])
    }
    // 保存页面组件
    this.#routerStore.length = index
    for(let i = 0, tempRouter_length = tempComponent.length; i < tempRouter_length; i++) {
      this.#routerStore.push(tempComponent[i])
    }
    // debugger
    this.#routerIndex = index
    // 卸载页面
    let pointDom = mountPotint[index]
    let vnode = pointDom._vnode
    let parentDOM = getParentElm(vnode)
    let beforeVNode = vnode.data.beforeVNode
    let parentNode = vnode.data.parentNode
    unMount(vnode, parentDOM)
    // 挂载页面
    //console.log(vnode);
    let newVNode = createVNode({
      attr: [],
      children: [],
      data: {},
      type: 4,
      val: ""
    })
    let elm = createTempRouter(newVNode, this.getRouterComponent())
    newVNode.data.parentNode = parentNode
    newVNode.data.beforeVNode = beforeVNode
    insertAfter(parentDOM, elm, beforeVNode)
    Object.assign(vnode, newVNode)
    // //console.log(Object.assign(vnode, {data: {}}));
    // 开始执行退出路由生命周期函数
    for(let i = index; i < path_length; i++) {
      let fn = beforeLeave.get()
      isFunction(fn) && fn()
      beforeLeave.pop()
    }
    doMounted()
    return false
  }

  // 进入某个路由
  entryRouter(routerPath) {
    if(beforeEach(this, routerPath)) {
      let {path, argus} = this.quichSlice(routerPath)
      this.setArgus(argus)
      // 是否发生重定向
      // debugger
      if(this.#routerMatch(path)) {
        return 
      }
      this.#oldPath = path
      this.currentRouterPath = routerPath
      afterEach(this)
    }
  }

  // 路由跳转
  push(routerPath) {
    this.entryRouter(routerPath)
    // history.pushState(null, '', routerPath)
  }

  // 重定向
  redirect(routerPath) {
    this.entryRouter(routerPath)
    // history.pushState(null, '', routerPath)
  }

  // 路由回退
  goBack(num) {
    // history.go(num)
  }

  getRouterComponent() {
    // return this.#routerStore[3].component
    if(this.#routerIndex === -1 || this.#routerIndex >= this.#routerStore.length) {
      //console.warn('获取路由组件失败， 目前路由组件为空');
      return null
    }
    // console.log(this.#routerIndex);
    // console.log(this.#routerStore);
    return this.#routerStore[this.#routerIndex++].component
  }

  // 创建路由map, 私有属性，不可调用
  #_initRouter(router) {
    let tempRouter = {}
    for(let i = 0, router_length = router.length; i < router_length; i++) {
      tempRouter[router[i].path] = router[i]
      if(router[i].children) {
        tempRouter[router[i].path].children = this.#_initRouter(router[i].children)
      }
    }
    return tempRouter
  }
}

// 懒汉式单例
const getRouterInstanll = function (routerSetting) {
  // let _instanll = new Router(routerSetting)
  // return function() {
  //   return _instanll
  // }
  if(_instanll) {
    return _instanll
  } else {
    _instanll = new Router(routerSetting)
    return _instanll
  }
}

export {getRouterInstanll}