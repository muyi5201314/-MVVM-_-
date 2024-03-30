import { isFunction } from '../utils/tool/typeJudge.js'

class Watch{
  constructor(name, fn) {
    this.name = name
    this.fn = fn
    this.id = new Date()
  }
  update(){
    let cb = this.fn
    cb(this.name)
  }
}
class Dep {
  constructor() {
    this.id = new Date()
    this.subs = []
  }
  add(watch) {
    this.subs.push(watch)
  }
  notify() {
    if(this.subs.length) {
      this.subs.forEach((e) => {
        try{
          isFunction(e.update) && e.update()
        } catch(error) {
          //console.error(error);
        }
      })
    }
  }
}

const historyListener = (function() {
  let historyDep = new Dep()
  return function(name) {
    if(name === 'historyChange'){
      return function(name, fn){
        var event = new Watch(name, fn)
        historyDep.add(event)
      }
    } else if(name === 'pushState' || name === 'replaceState') {
      var method = history[name];
      return function(){
        method.apply(history, arguments);
        historyDep.notify();
      }
    }
  }
}())

function createHistoryListener() {
  window.addHistoryListener = historyListener('historyChange')
  history.pushState =  historyListener('pushState');
  history.replaceState =  historyListener('replaceState');
}

export {
  createHistoryListener
}