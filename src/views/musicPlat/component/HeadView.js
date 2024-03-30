import { getLocalStorage } from "../../../utils/storage/localStorage.js"
import { publicProxyData } from "./data.js"
import { MuyiTimer, MuyiButton, MuyiInput } from '../../UI/index.js'

const HeadView = {
  template: 
  `
  <div class="music-head">
    <div class="music-head-logo">
      <i class="iconfont icon-yinleyule music-head-logo-icon"></i>
      <p class="music-head-logo-p">我的音乐世界</p>
    </div>
    <!dsad>
    <div class="music-head-user">
      <img 
        class="music-head-user-avatar" 
        src="./src/static/img/2AF51F942B2AD34926E15AA7B40287AE.jpg"
      ></img>
      <p class="music-head-user-username">{{data.publicProxyData.user.username}}</p>
    </div>
  </div>
  `,
  // 这里有可能形成闭环
  components: {
  },
  props: {
  },
  emits: new Set(),
  data() {
    return {
      publicProxyData: publicProxyData
    }
  },
  methods: {
    created() {
      this.publicProxyData.user = getLocalStorage('user') ?? {id: 0, username: ''}
      // this.publicProxyData.user = getwindow.localStorage('user')?.username : ''
    },
  },
}

export default HeadView