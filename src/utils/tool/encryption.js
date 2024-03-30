const encryption = (function() {
  const btoa = globalThis.btoa
  if(!btoa) {
    throw new Error('encryption加密为空')
  }
  return btoa
}())

const decrypt = (function() {
  const atob = globalThis.atob
  if(!atob) {
    throw new Error('encryption加密为空')
  }
  return atob
}())

export {
  encryption,
  decrypt
}