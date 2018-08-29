<template lang="pug">
article.add(@keyup.enter.ctrl='save')
  h2 Add

  section.input
    textarea.input-content(autofocus v-model.trim='content' ref='content')
    input.input-from(placeholder='From' v-model.trim='from' @keyup.enter='focusNext')
    input.input-author(placeholder='Author' v-model.trim='author' @keyup.enter='focusNext')
    input.input-tag(placeholder='Add tag' v-model.trim='tag' @keyup.enter='addTag' ref='tagInput')
    .input-tags
      li(v-for='(item, index) in tags')
        span.tag-title {{ item }}
        span.tag-del(@click='removeTag(index)') x
  
  section.submit
    button.submit-save(@click='save' @keyup.enter='save') Save
</template>

<script>
import { mapState } from 'vuex'

import utils from '../../utils'

export default {
  name: 'add',
  data () {
    return {
      content: '',
      from: '',
      author: '',
      tag: '',
      tags: []
    }
  },
  computed: {
    ...mapState(['lastAddMeta'])
  },
  created () {
    this.from = this.lastAddMeta.from
    this.author = this.lastAddMeta.author
    const i = this.lastAddMeta.tags.indexOf('#####')
    i !== -1 && this.lastAddMeta.tags.splice(i, 1)
    this.tags = this.lastAddMeta.tags
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
      this.$refs.tagInput.focus()
    },
    focusNext(event) {
      const $target = event.target
      $target.nextElementSibling.focus()
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
        content: utils.replaceQuotations(this.content),
        from: utils.replaceQuotations(this.from),
        author: this.author,
        tags: this.tags
      }
      this.$store.dispatch('add', item)
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
.add
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
