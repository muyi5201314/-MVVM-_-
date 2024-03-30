function isComplexDataType (obj) {
  return (typeof obj === 'object' || typeof obj === 'function') 
  && (obj !== null)
}

function deepClone(obj, hash = new WeakMap()) {
  if(obj.constructor === Date) {
    return new Date(obj)
  }

  if(obj.constructor === RegExp) {
    return new RegExp(obj)
  }

  if(hash.has(obj)) {
    return hash.get(obj)
  }

  let allDesc = Object.getOwnPropertyDescriptors(obj)

  //遍历传入参数所有键的特性
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)

  // 把cloneObj原型复制到obj上
  hash.set(obj, cloneObj)

  for (let key of Reflect.ownKeys(obj)) { 
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
  }
  return cloneObj
}


export {deepClone}