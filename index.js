// import { createListen } from './src/router/listen.js'

// // //console.log(createListen);
// // createListen()
// //console.log(43290483290);

// function backWay() {
//   window.location = '#hash'
// }
// const express = require('express')
// const path = require('path')
// const app = express()

import express from 'express'
import path from 'path'
import fs from "fs"
import http from 'http'
import url from 'url'

import { initRouter } from './src/router/index.js'
import AppView from './AppView.js'
import { createApp } from './src/parser/createNode/index.js'
import { doMounted } from './src/parser/liveCycle.js'
import routerSetting from './src/router/routerSetting.js'

import jsdom from 'jsdom'
const { JSDOM } = jsdom;

let rootVNode

// 文件转发器
function fileHandle(req, res) {
  let url = req.url.split("?")[0]
  let seq = req.url.split("?")[1]?.split("&") ?? []
  const FilePath = path.join("D:\\vuejs\\graduate_work", url);
  // 文件不存在
  if (!fs.existsSync(FilePath)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write("Not Found")
    return res.end();
  }
  if (url.endsWith(".css")) {
    const fileStream = fs.readFileSync(FilePath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(fileStream);
    return
  }
  if (url.endsWith(".jpg")) {
    const fileStream = fs.readFileSync(FilePath);
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.write(fileStream);
    res.end();
    return
  }
  if (url.endsWith(".png")) {
    const fileStream = fs.readFileSync(FilePath);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.write(fileStream);
    return res.end();
  }
  if (url.endsWith(".js")) {
    const fileStream = fs.readFileSync(FilePath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.write(fileStream);
    return res.end();
  }
  const fileStream = fs.readFileSync(FilePath);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  console.log();
  res.write(fileStream);
  return res.end();
}

// 1. 创建服务
const server = http.createServer((req, res) => {
  let url = req.url.split("?")[0]
  let seq = req.url.split("?")[1]?.split("&") ?? []
  console.log(url);
  for (let i = 0; i < routerSetting.length; i++) {
    if (url === routerSetting[i].path) {
        let indexHtmlContent = fs.readFileSync("./public/index.html", "utf-8")
        // const dom = new JSDOM(indexHtmlContent, {
        //   "url": "http://localhost"
        // });
        // global.window = dom.window
        // global.document = window.document
        // global.XMLHttpRequest = window.XMLHttpRequest
        // document.querySelector("html").innerHTML += `
        // <script type="module">
        //   import { initRouter } from './src/router/index.js'
        //   import AppView from './AppView.js'
        //   import { createApp } from './src/parser/createNode/index.js'
        //   import { doMounted } from './src/parser/liveCycle.js'
        
        //   initRouter()
        //   const appDom = document.getElementById("app")
        //   // //console.log(appDom);
        //   let rootVNode = createApp(AppView, appDom)
        //   app.appendChild(rootVNode.elm)
        //   doMounted()
        // </script>`
        res.write(indexHtmlContent);
        res.end();
        return
    }
  }
  return fileHandle(req, res)
});
// server.once('request', function(req, res) {
//   let indexHtmlContent = fs.readFileSync("./public/index.html", "utf-8")
//   const dom = new JSDOM(indexHtmlContent, {
//     url: "http://localhost"
//   });
//   global.window = dom.window
//   global.document = window.document
//   global.XMLHttpRequest = window.XMLHttpRequest

//   // 1.1 解析 url
//   const { query, pathname } = url.parse(req.url, true);

//   initRouter()
//   const appDom = document.getElementById("app")
//   //console.log(appDom);
//   let rootVNode = createApp(AppView, appDom)
//   appDom.appendChild(rootVNode.elm)
//   doMounted()

//   if (req.url.endsWith(".css")) {
//     console.log(cssPath);
//     const cssPath = path.join(__dirname, req.url);
//     console.log(cssPath);
//     const fileStream = fs.createReadStream(cssPath, 'utf8');
//     res.writeHead(200, { 'Content-Type': 'text/css' });
//     fileStream.pipe(res);
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     // res.end('Not found');
//   }
//   res.end(document.querySelector("html").outerHTML);

//   // if (pathname === "/a") {
//   //     // 如果访问的是 /a 那么读取 client目录下的views目录下的pageA.html 并返回出去
//   //     fs.readFile("./client/views/pageA.html", "utf-8", (err, data) => {
//   //         if (err) return //console.log(err);

//   //         res.end(data);
//   //     });
//   // }

//   // if (pathname === "/b") {
//   //     res.end("hello pageB");
//   // }

//   // if (pathname === "/list") {
//   //     // 如果访问的是 /list 那么读取 client目录下的views目录下的list.html 并返回出去
//   //     fs.readFile("./client/views/list.html", "utf-8", (err, data) => {
//   //         if (err) return //console.log(err);

//   //         res.end(data);
//   //     });
//   // }
// });

server.listen(9983, () => {
  console.log("http://localhost:9983 已开启");
})

// // 2. 给服务配置端口号
// server.listen(8080, () => //console.log("开启服务成功, 端口号为 8080"));

// const app = express()
// app.use(express.static(path.join(path.resolve(), 'public')))

// http.createServer(function (req, res) {
//   var html = buildHtml(req);

//   res.writeHead(200, {
//     'Content-Type': 'text/html',
//     'Content-Length': html.length,
//     'Expires': new Date().toUTCString()
//   });
//   //console.log(document.getElementById("app"));
//   res.end(html);
//   //console.log(document.getElementById("app"));
//   // document.getElementsByName("html").appendChild("")
// }).listen(8080);


// function buildHtml(req) {
//   var header = '';
//   var body = '<div id="app"></div>';

//   // concatenate header string
//   // concatenate body string

//   return '<!DOCTYPE html>'
//        + '<html><head>' + header + '</head><body>' + body + '</body></html>';
// };

// //console.log(document.getElementById("app"));
// app.listen(8080, () => {
//   // //console.log('App listening at port 8080')
//   // const appDom = document.createElement("div")
//   // //console.log(appDom);
//   // let rootVNode = initRouter(AppView, appDom)
//   // app.appendChild(rootVNode.elm)
//   // doMounted()
//   // initRouter()
//   initRouter()
//   const app = document.getElementById("app")
//   let rootVNode = createApp(AppView, app)
//   app.appendChild(rootVNode.elm)
//   doMounted()
// })