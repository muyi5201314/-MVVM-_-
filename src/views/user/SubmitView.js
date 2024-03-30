const SubmitView = {
  template: '<div class="cc">{{data.muyi}}</div>',
  // 这里有可能形成闭环
  components: {
  },
  props: {
  },
  data() {
    return {
      jk: 1,
      muyi: '周鑫是我儿子',
    }
  },
  methods: {
    hello() {
      //console.log(this.props);
      // //console.log(this.data.1);
    }
  },
}

export default SubmitView