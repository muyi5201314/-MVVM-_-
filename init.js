import jsdom from 'jsdom'
// const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
  url: "http://localhost"
});



//console.log(dom);

let window = dom.window;
global.window = window
// window.localStorage = {}
let document = window.document;
global.document = document
let localStorage = window.localStorage;
global.localStorage = localStorage
// browserEnv();
// localStorage = {
//     getItem: function (key) {
//         window.localStorage.getItem(key)
//         // 实际的存储操作
//     },
//     setItem: function (key, value) {
//         window.localStorage.setItem(key)
//         // 实际的存储操作
//     },
//     // 其他方法...
// }

export {
    localStorage,
    window,
    document
}