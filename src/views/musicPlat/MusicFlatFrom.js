import {
  publicProxyData
} from "./component/data.js"
import HeadView from "./component/headView.js"
import MusicPlayer from "./component/MusicPlayer.js"
import SiderBar from "./component/siderBar.js"
import SongCatalog from "./component/SongCatalog.js"
import TableView from "./component/tableView.js"
import {
  createProxy
} from "../../parser/reactive/proxy.js"

const MusicFlatFrom = {
  template: `
  <div class="music-plat-form" @click="wholeControll" >
    <head-view></head-view>
    <table-view></table-view>
    <sider-bar></sider-bar>
    <song-catalog></song-catalog>
    <music-player></music-player>
  </div>
  `,
  components: {
    'head-view': HeadView,
    'table-view': TableView,
    'sider-bar': SiderBar,
    'song-catalog': SongCatalog,
    'music-player': MusicPlayer,
  },
  props: {},
  emits: new Set(),
  data() {
    return {
      publicProxyData: publicProxyData
    }
  },
  methods: {
    created() {
      // wholeControll()
      // let a = new Function("jk, a","return jk + 1")
      // a(1, 2)
      // eval("let jk = 1") = let jk = 1
      // publicProxyData = createProxy (publicData)
    },
    wholeControll(jk) {
      isFunction(jk) && jk()
      this.publicProxyData.siderBarOpen = false
    }
  },
}

export default MusicFlatFrom