import { isString } from "../../utils/tool/typeJudge.js"
import { tagState } from "../data.js"

// 词法解析
const lexicalPaser = (template) => {
  if (!isString(template)) {
    return new Error('模板必须是字符串')
  }

  /**
   * 标签变化状态：
   * 1.start -> (attr -> complexAttr)(可能没有) -> text -> start -> end -> text
   * 2.start -> (attr -> complexAttr)(可能没有) -> end -> text
  */
  const strategy = {
    tokens: [],
    // 保存标签名称，作为是否为单结点的判断依据
    tempTagName: '',
    // val为当前的属性、标签名称
    val: '',
    // tempVal是为了回收<xxx></xxx>
    tempVal: '',
    template: '',
    // 当前处理字符的下标值
    index: 0,
    state: tagState.text,
    // 文本结点中不允许出现<
    '<': function () {
      if (this.val) {
        this.tokens.push({
          type: this.state,
          val: this.val,
        })
        this.tempTagName = ''
        this.tempVal = ''
        this.val = ''
      }
      // 标签开始
      this.state = tagState.start
    },
    '/': function () {
      // 文本结点直接略过
      if (this.state === tagState.text) {
        this.other('/')
        return
      }
      // 不是闭标签,  则为单节标签结点或者文本节点
      if (this.index > 0 && this.template[this.index - 1] !== '<') {
        if (this.val) {
          if (this.state === tagState.start) {
            this.tokens.push({
              type: this.state,
              val: this.val,
            })
            this.val = ''
            this.state = tagState.end
            // 已经保存过标签名称
          } else if (this.state === tagState.attr) {
            this.tokens.push({
              type: this.state,
              val: this.val,
            })
            this.val = ''
            this.state = tagState.end
            this.tempTagName = this.tempVal
          }
        } else {
          this.tempTagName = this.tempVal
          this.state = tagState.end
        }
      } else {
        this.state = tagState.end
      }
    },
    ' ': function () {
      if (this.val) {
        if (this.state === tagState.start) {
          this.tokens.push({
            type: this.state,
            val: this.val,
          })
          // 保存标签名称
          this.tempVal = this.val
          // 开始进入属性
          this.state = tagState.attr
          this.val = ''
        } else if (this.state === tagState.attr) {
          this.tokens.push({
            type: this.state,
            val: this.val,
          })
          this.val = ''
        } else if (this.state === tagState.complexAttr) {
          this.tokens.push({
            type: this.state,
            val: this.val,
          })
          this.val = ''
          this.state = tagState.attr
        }
      }
    },
    '>': function () {
      // 文本中的>直接略过
      if (this.state === tagState.text) {
        this.other()
        return
      }
      if (this.val) {
        this.tokens.push({
          type: this.state,
          val: this.val,
        })
        this.val = ''
      }
      // 这是一个单结点标签
      if (this.tempTagName) {
        this.tokens.push({
          type: this.state,
          val: this.tempTagName,
        })
      }
      // 标签闭合，开始进入文本
      this.state = tagState.text
    },
    '"': function () {
      // 开始进入复杂属性
      if (this.state === tagState.attr) {
        this.state = tagState.complexAttr
        this.index++
        for (let template_length = template.length; this.index < template_length; strategy.index++) {
          if (this.template[this.index] === "'") {
            this["'"]()
          } else if (this.template[this.index] === '"') {
            return
          } else {
            this.other(this.template[this.index])
          }
        }
      } else {
        this.other('"')
      }
    },
    "'": function () {
      // 开始进入复杂属性
      if (this.state === tagState.attr) {
        this.state = tagState.complexAttr
        for (let template_length = template.length; strategy.index < template_length; strategy.index++) {
          if (this.template[this.index] === '"') {
            this['"']()
          } else if (this.template[this.index] === "'") {
            return
          } else {
            this.other(this.template[this.index])
          }
        }
      } else {
        this.other('"')
      }
    },
    '\n': function() {
      // 直接略过
    },
    // <!>为注释>，不编译
    '!': function() {
      if(this.state === tagState.start) {
        while(strategy.index < template.length && template[strategy.index] !== '>') {
          this.index++
        }
      }
    },
    other: function (ch) {
      this.val += ch
    }
  }
  strategy.template = template
  for (let template_length = template.length; strategy.index < template_length; strategy.index++) {
    if (strategy[template[strategy.index]]) {
      strategy[template[strategy.index]]()
    } else {
      strategy.other(template[strategy.index])
    }
  }
  return strategy.tokens
}

export {
  lexicalPaser
}