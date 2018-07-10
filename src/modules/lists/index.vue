<template lang="pug">
article.lists
  ul
    li(v-for='(item, index) in items')
      .lists-date(v-if='isNewDate(item.created)' :id='getHashTag(item.created)' v-text='getDate(item.created)')
      hr
      .lists-content(v-html='makeHtml(item.content)')
      .lists-info
        .lists-from(v-if='item.from !== ""' v-html='makeHtml(item.from)')
        .lists-author(v-if='item.author !== ""' v-html='makeHtml(item.author, "--")')
      .lists-tags(v-if='item.tags.length !== 0')
        a.tag-title(v-for='tag in item.tags' v-text='tag' @click='filterTag(tag)')
      .btn-groups
        button.btn(@click='edit(index)') edit
        button.btn(@click='remove(index)') delete
  
  button.btn-float(v-bind:class='{ "is-filtered": isFiltered }' @click='onFloatClicked') +
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import showdown from 'showdown'

const md = new showdown.Converter({openLinksInNewWindow: true})
md.setFlavor('github')

let lastDate = ''
export default {
  name: 'lists',
  data () {
    return {
      isFiltered: false
    }
  },
  computed: {
    ...mapState(['items'])
  },
  methods: {
    filterFrom(from) {
      this.filter({from})
    },
    filterAuthor(author) {
      this.filter({author})
    },
    filterTag(tag) {
      this.filter({tag})
    },
    filter(obj) {
      this.isFiltered = true
      this.$store.dispatch('filter', obj)
      this.$nextTick(() => {
        // for Vimium
        simulateClick(this.$el)
      })
    },
    onFloatClicked() {
      if (this.isFiltered) {
        this.$store.dispatch('refreshItems')
        this.isFiltered = false
      } else {
        this.$router.push('add')
        lastDate = ''
      }
    },
    edit(index) {
      this.$router.push(`edit/${index}`)
      lastDate = ''
    },
    remove(index) {
      this.$store.dispatch('remove', index)
      lastDate = ''
    },
    isNewDate(time) {
      const date = getDate(time)
      return date !== lastDate
    },
    getDate(time) {
      const date = getDate(time)
      if (this.isNewDate(time)) {
        lastDate = date
      }
      return date
    },
    getHashTag(time) {
      return getHashTag(time)
    },
    makeHtml(text, prefix = '') {
      return md.makeHtml(`${prefix}${text}`)
    }
  }
}

function getDate(time) {
  return moment(time).calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'DD/MM/YYYY',
    lastDay: '[Yesterday]',
    lastWeek: 'DD/MM/YYYY',
    sameElse: 'DD/MM/YYYY'
  })
}

function getHashTag(time) {
  return moment(time).calendar(null, {
    sameDay: 'YYYY-MM-DD',
    nextDay: 'YYYY-MM-DD',
    lastDay: 'YYYY-MM-DD',
    lastWeek: 'YYYY-MM-DD',
    sameElse: 'YYYY-MM-DD',
  })
}

function simulateClick(target) {
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
    // clientX: 1,
    // clientY: 1
  })
  target.dispatchEvent(evt)
}
</script>

<style lang="stylus">
.lists

  li
    display flex
    flex-direction column
    padding-bottom 10px

    hr
      width 100%
      margin 1.5em 0

  &-date
    line-height 2
    color #29c
    font-size 1.6em
    margin-top 1.5em
  
  &-content
    line-height 1.5
    font-size 1.2em

  &-info
    align-self flex-end
    display flex

  &-from,
  &-author
    padding 6px 10px
    max-width 160px
    text-overflow ellipsis
    overflow hidden
    color #74BCFC

  &-tags
    display flex
    padding 10px 0 4px

    .tag-title
      display inline-block
      max-width 100px
      padding .1em 0em
      padding-right .8em
      margin-right 1em
      cursor pointer
      text-overflow ellipsis
      overflow hidden
      color #007ACC


  .btn-groups
    display flex
    margin-top 10px

    & > *
      margin-right 1em
      border-radius 4px
  
  .btn-float
    width 36px
    height 36px
    border-radius 50%
    position fixed
    bottom 48px
    right 48px
    background-color #007acc
    text-align center
    line-height 36px
    text-decoration none
    font-size 1.5em
    cursor pointer
    user-select none
    color #fff
    padding 0px

    &.is-filtered
      transform rotate(45deg)

</style>
