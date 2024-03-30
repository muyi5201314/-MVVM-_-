const MuyiDialog = {
  template: 
  `
  <div 
    class="muyi-dialog" 
    v-if="data.props.controll"
  >
    <div class="muyi-dialog-main">
    </div>
  </div>
  `,
  // 这里有可能形成闭环
  components: {
  },
  props: {
    controll: false,
  },
  emits: new Set(),
  data() {
    return {
      controll: false,
    }
  },
  methods: {
  },
}

export default MuyiDialog