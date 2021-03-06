<template lang="pug">
article.forms(@keyup.enter.ctrl='save')
  h2 {{ this.title }}

  section.input
    textarea.input-content(autofocus v-model.trim='content' ref='content' @focus='onFocus')
    ac-input(type='from'
      placeholder='From'
      @enterdown='focusNext("author")'
      @onselect='focusNext("author")'
      v-model.trim='from')
    ac-input(type='author'
      ref='author'
      @enterdown='focusNext("tag")'
      @onselect='focusNext("tag")'
      placeholder='Author'
      v-model.trim='author')
    ac-input.input-tag(type='tag'
      ref='tag'
      placeholder='Add tag'
      @enterdown='addTag'
      :clearAfterEnter='true'
      v-model.trim='tag')
    .input-tags
      li(v-for='(item, index) in tags')
        span.tag-title {{ item }}
        span.tag-del(@click='removeTag(index)') x
  
  section.submit
    button.submit-save(@click='save' @keyup.enter='save') Save
</template>

<script>
import utils from '../utils'
import AcInput from './ac-input'

export default {
  name: 'forms',
  components: {
    AcInput
  },
  props: ['item', 'title'],
  data () {
    return {
      content: '',
      from: '',
      author: '',
      tag: '',
      tags: []
    }
  },
  created () {
    this.content = this.item.content || ''
    this.from = this.item.from
    this.author = this.item.author
    const i = this.item.tags.indexOf('#####')
    i !== -1 && this.item.tags.splice(i, 1)
    this.tags = this.item.tags
  },
  mounted () {
    setTimeout(() => {
      this.$refs.content.focus()
    }, 310)
  },
  methods: {
    addTag(e, tag = this.tag) {
      if ((typeof e) === 'string') {
        tag = e
      }
      if (tag === '') {
        return
      }
      if (!this.tags.includes(tag)) {
        this.tags.push(tag)
      }
      this.tag = ''
    },
    removeTag(index) {
      this.tags.splice(index, 1)
      this.$refs.tag.focus()
    },
    focusNext(refKey) {
      this.$refs[refKey].focus()
    },
    save() {
      if (this.content === '') {
        this.$refs.content.placeholder = 'Content is required.'
        this.$refs.content.focus()
        return
      }
      this.addTag()
      this.content.includes('**') && this.addTag('#####')
      const item = {
        content: utils.replaceQuotations(utils.removeOutmostQuotation(this.content)),
        from: utils.replaceQuotations(this.from),
        author: this.author,
        tags: this.tags
      }
      this.$emit('submit', item)
    },
    onFocus(e) {
      e.target.setSelectionRange(0, 9999)
    }
  }
}
</script>

<style lang="stylus">
.forms
  .input
    display flex
    flex-direction column

    input, textarea
      padding 5px 15px
    
    > *
      margin 10px 0

    &-content
      width 100%
      height 200px
      line-height 2
      font-size 1.2em
      padding 15px

    &-tags
      display flex

      li
        display flex
        align-items center
        padding 4px 10px
        margin 0 10px
        background-color #8a9ca8
        border-radius 22px
        line-height 22px

        .tag-title
          display inline-block
          max-width 100px
          text-overflow ellipsis
          color #333
          overflow hidden

        .tag-del
          padding 0 4px
          font-size 1.2em
          cursor pointer
  
  .submit
    display flex
    justify-content center

    &-save
      width 67%
      line-height 34px
      border-radius 34px
      background-color #5498D1
      font-size 1.5em
      color #ccc

</style>
