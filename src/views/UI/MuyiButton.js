const  MuyiButton = {
  template: 
  `
  <button 
    :class="'muyi-button' 
      + (data.props.strect ? ' muyi-button-strect' : ' ') "
    @click="click"
  >
    {{data.props.value}}
  </button>
  `,
  // 这里有可能形成闭环
  components: {
  },
  props: {
    'size': 'medius',
    'value': '提交',
    'type': 'default',
    'strect': true,
  },
  emits: new Set(['click']),
  data() {
    return {
    }
  },
  methods: {
    click() {
      //console.log('dsad');
      this.emits['click'] && this.emits['click']()
    }
  },
}

export default MuyiButton