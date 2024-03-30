// import { createListen } from './src/router/listen.js'

// // //console.log(createListen);
// // createListen()
// //console.log(43290483290);

// function backWay() {
//   window.location = '#hash'
// }
// const { describe, expect, test } =  require('@jest/globals');
import { describe, expect, test } from '@jest/globals';

const express = require('express')
const path = require('path')
const jsdom = require("jsdom")
const http = require("http")
const url = require("url")

const app = express()

// import express from 'express'
// import path from 'path'
// import fs from "fs"
// import http from 'http'
// import url from 'url'

// import { initRouter } from './src/router/index.js'
// import AppView from './AppView.js'
// import { createApp } from './src/parser/createNode/index.js'
// import { doMounted } from './src/parser/liveCycle.js'
const {initRouter} = require("./src/router/index.js")
const AppView = require('./AppView.js')
const {createApp} = require("./src/parser/createNode/index.js")
const {doMounted} = require("./src/parser/liveCycle.js")

// import jsdom from 'jsdom'
const {JSDOM} = jsdom;

// 1. 创建服务
const server = http.createServer((req, res) => {

  let indexHtmlContent = fs.readFileSync("./public/index.html", "utf-8")
  const dom = new JSDOM(indexHtmlContent, {
    url: "http://localhost"
  });
  global.window = dom.window
  global.document = window.document
  global.XMLHttpRequest = window.XMLHttpRequest

  // 1.1 解析 url
  const { query, pathname } = url.parse(req.url, true);

  initRouter()
  const appDom = document.getElementById("app")
  //console.log(appDom);
  let rootVNode = createApp(AppView, appDom)
  appDom.appendChild(rootVNode.elm)
  doMounted()

  res.end(document.querySelector("html").outerHTML);

  // if (pathname === "/a") {
  //     // 如果访问的是 /a 那么读取 client目录下的views目录下的pageA.html 并返回出去
  //     fs.readFile("./client/views/pageA.html", "utf-8", (err, data) => {
  //         if (err) return //console.log(err);

  //         res.end(data);
  //     });
  // }

  // if (pathname === "/b") {
  //     res.end("hello pageB");
  // }

  // if (pathname === "/list") {
  //     // 如果访问的是 /list 那么读取 client目录下的views目录下的list.html 并返回出去
  //     fs.readFile("./client/views/list.html", "utf-8", (err, data) => {
  //         if (err) return //console.log(err);

  //         res.end(data);
  //     });
  // }
});

server.listen(9983)

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