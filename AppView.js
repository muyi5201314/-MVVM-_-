import { setLocalStorage } from './src/utils/storage/localStorage.js';
import LoginView from './src/views/user/LoginView.js'
import SubmitView from './src/views/user/SubmitView.js'
import { getRouterInstanll } from './src/router/router.js';

const AppView = {
  template: 
  `<div class="app-view">
    <router-view></router-view>
  </div>`,
  // 这里有可能形成闭环
  components: {
    'login-view': LoginView,
    'submit-view': SubmitView
  },
  props: {
  },
  emits: new Set(),
  data() {
    return {
      jk: 1,
      test: true,
      test1: false,
      testClass: 'jk',
      // DocumentFragment
    }
  },
  methods: {
    hello(a) {
      //console.log(12345);
    },
    mounted(){
      let i = 0
      let flag = true
      const router = getRouterInstanll()
      setInterval(() => {
        // this.test = !this.test
        // this.testClass = flag ? 'cc' : 'jk'
        // flag= !flag
      }, 1000)
      //console.log(1);
      window.addEventListener("beforeunload", () => {
        setwindow.localStorage("routerPath", router.getRouterPath())
      })
    },
  },
}

export default AppView