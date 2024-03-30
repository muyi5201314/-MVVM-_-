// const login = (function(){
//   const template = '<p>jdsakdjasld</p>'
//   // const 
// }())
//  <div v-for="(item, index) in data.list" v-key="index">{{item}}</div>
const  MuyiInput = {
  template: 
  `
  <div class="muyi-input">
    <input
      class="muyi-input-input" 
      :value="data.props.value"
      :placeholder="data.props.placeholder"
      :type="data.props.type"
      @input="input"
    ></input>
  </div>
  `,
  // 这里有可能形成闭环
  components: {
  },
  props: {
    'size': 'small',
    'placeholder': '周鑫是我儿子',
    'type': 'text',
    'value': '',
    'model': 'ds'
  },
  emits: new Set(['input']),
  data() {
    return {
      jk: '',
      list: ['a', 'b', 'c']
    }
  },
  methods: {
    beforeCreate() {
    },
    input(event){
      this.emits['input'](event.target.value)
    },
    mounted() {
      setInterval(() => {
        // this.list.push('周鑫是我孙子')
        // this.list.pop()
      }, 1000)
      //console.log(this.emits);
      //console.log(document.getElementsByClassName('muyi'));
    },
  },
}

export default MuyiInput