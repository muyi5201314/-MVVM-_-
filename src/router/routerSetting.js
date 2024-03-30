import LoginView from '../views/user/LoginView.js'
import notFound from '../views/system/notFound.js'
import MainView from '../views/musicPlat/MusicFlatFrom.js'
import MusicFlatFrom from '../views/musicPlat/MusicFlatFrom.js'
import RegisterView from '../views/user/RegisterView.js'

// import 
const routerSetting = [
  {
    path: '/',
    component: MusicFlatFrom,
    meta: {
      title: '欢迎登陆',
    },
    children: []
  },
  {
    path: 'login',
    component: LoginView,
    meta: {
      title: '欢迎登陆',
    },
    children: []
  },
  {
    path: 'muyi',
    component: RegisterView,
    meta: {
      title: '404~~',
    },
    children: []
  },
  {
    path: '404',
    component: notFound,
    meta: {
      title: '404~~',
    },
    children: []
  },
  {
    path: 'main',
    component: MusicFlatFrom,
    meta: {
      title: '主页',
    },
    children: []
  },
]

export default routerSetting