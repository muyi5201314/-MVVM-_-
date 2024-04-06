const SubmitView = {
  template:
    `<div 
    v-for="(item, index) in data.textV_for"
    v-key="item"
    class="cc"
  > {{ data.muyi + item }}</div > `,
  // 这里有可能形成闭环
  components: {
  },
  props: {
  },
  data() {
    return {
      jk: 1,
      muyi: '周鑫是我孙子',
      textV_for: [
        1, 2, 3, 4
      ]
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