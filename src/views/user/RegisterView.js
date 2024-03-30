// const login = (function(){
//   const template = '<p>jdsakdjasld</p>'
//   // const 
// }())
import MuyiInput from '../UI/MuyiInput.js'
import MuyiButton from '../UI/MuyiButton.js'

const RegisterView = {
  template: 
  `
  <div class="login-view">
    <div class="login-view-form">
      <div class="login-username">
        <p class="login-username-p">账号：</p>
        <div class="login-username-input">
          <muyi-input
            placeholder="请输入账号" 
            @input="inputUserName"
            :value="data.login.username"
            class="muyiyi"
          ></muyi-input>
        </div>
      </div>
      <div class="login-password">
        <p class="login-password-p">密码：</p>
        <div class="login-password-input">
          <muyi-input 
            placeholder="请输入密码"
            @input="inputPassword"
            :value="data.login.password"
            :type="'password'" 
            class="muyiyi"
          ></muyi-input>
        </div>
      </div>
      <div class="login-sumbit">
        <muyi-button @click="login" class="yiyizi1" value="登录"></muyi-button>
        <muyi-button @click="test" value="注册"></muyi-button>
      </div>
    </div>
  </div>
  `,
  // 这里有可能形成闭环
  components: {
    'muyi-input': MuyiInput,
    'muyi-button': MuyiButton,
  },
  props: {
  },
  data() {
    return {
      login: {
        username: '',
        password: null,
      },
      list: ['周鑫是我孙子', '周鑫是我孙子', '周鑫是我孙子']
    }
  },
  methods: {
    inputUserName(value) {
      this.login.username = value
    },
    inputPassword(value) {
      this.login.password = value
    },
    login() {
      post(userUrl['login'], {
        username: "muyi",
        password: "123456"
      }).then((data) => {
        //console.log(data);
        setLocalStorage('user', data.data)
        const router = getRouterInstanll()
        router.push("/main")
      }).catch((error) => {
        //console.log(error);
      })
    },
    test() {
      const router = getRouterInstanll()
      router.push('/muyi')
    },
    mounted() {
      let flag = true;
      setInterval(() => {
        // this.list.push('周鑫是我孙子')
        // this.list.pop()
        // this.login.username = this.login.username ? '' : 'dsa';
      }, 1000)
      //console.log(document.getElementsByClassName('muyi'));
    },
  },
}
export default RegisterView