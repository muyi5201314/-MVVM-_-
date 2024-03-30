import { watchEffect } from "../../parser/reactive/proxy.js"

const  MuyiTimer = {
  template: 
  `
  <div class="muyi-timer">
    <p 
      class="muyi-timer-value"
      v-if="data.props.showHour"
    >{{data.hourString + ':'}}</p>
    <p 
      v-if="data.props.showMinute"
    >{{data.minuteString + ':'}}</p>
    <p 
      v-if="data.props.showSecond"
    >{{data.secondString}}</p>
  </div>
  `,
  // 这里有可能形成闭环
  components: {
  },
  props: {
    showHour: true,
    showMinute: true,
    showSecond: true,
    // 开始秒数
    startCount: 0,
    // 结束秒数
    endCount: 0,
    // 是否暂停
    pause: false,
  },
  emits: new Set(['end', 'play']),
  data() {
    return {
      count: 0,
      hourString: '0',
      minuteString: '00',
      secondString: '00',
      // 操作与上次间隔时间
      operationTime: 0,
      // 开始计数时间
      lastTime: null,
      // 定时器
      timer: null,
    }
  },
  methods: {
    countTimer() {
      let nowTimer = new Date()
      let distance = (nowTimer.getTime() - this.lastTime.getTime()) / 1000
      this.count += distance
      // if(this.count > this.props.endCount) {
      //   // 播放完毕
      //   this.emits['end'] && this.emits['end']()
      //   return
      // }
      let leaveTime = this.props.endCount - this.count
      let hour = Math.floor(leaveTime / 3600)
      this.hourString = hour.toString()
      leaveTime = leaveTime - hour * 3600
      let minute = Math.floor(leaveTime / 60)
      this.minuteString = minute > 9 ? minute.toString() : '0' + minute
      leaveTime = leaveTime - minute * 60
      let second = Math.floor(leaveTime)
      this.secondString = second > 9 ? second.toString() : '0' + second
      this.lastTime = nowTimer
      // this.emits['play'] && this.emits['play'](this.count)
      if(!this.props.pause) {
        this.timer = setTimeout(this.methods.countTimer, 1000)
      }
    },
    reset() {
      this.lastTime = new Date()
      this.methods.countTimer()
    },
    created() {
      this.count = this.props.startCount
      this.lastTime = new Date()
      this.methods.countTimer()
    },
    mounted() {
      watchEffect(
        () => this.props.startCount,
        () => {
          this.methods.reset()
        }
      ),

      watchEffect(
        () => this.props.pause,
        (oldVal, newVal) => {
          // 暂停
          if(newVal) {
            this.operationTime = new Date().getTime() - this.lastTime.getTime()
            clearTimeout(this.timer)
          } else {

          }
        }
      )
    },
  },
}

export default MuyiTimer