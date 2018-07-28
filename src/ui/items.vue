<template lang="pug">
article.items
  ul
    li(v-for='(item, index) in items')
      .items-date(v-if='isNewDate(item.created)' :id='getHashTag(item.created)' v-text='getDate(item.created)')
      hr
      .item
        .item-content(v-html='makeHtml(item.content)')
        .item-info
          .item-from(v-if='item.from !== ""' v-html='makeHtml(item.from)')
          .item-author(v-if='item.author !== ""' v-html='makeHtml(item.author, "--")')
        .item-tags(v-if='item.tags.length !== 0')
          a.tag-title(v-for='tag in item.tags' v-text='tag' @click='filterTag(tag)')
        .item-btns
          button.btn(@click='edit(index)') edit
          button.btn(@click='remove(index)') delete
</template>

<script>
import moment from 'moment'
import showdown from 'showdown'

const md = new showdown.Converter({openLinksInNewWindow: true})
md.setFlavor('github')

let lastDate = ''
export default {
  name: 'items',
  props: ['items'],
  methods: {
    filterTag(tag) {
      this.$router.push({ name: 'items', query: { type: 'tag', value: encodeURIComponent(tag)} })
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
  },
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
</script>

<style lang="stylus">
.items
  &-date
    line-height 2
    color #29c
    font-size 1.6em
    margin-top 1.5em
  
  li
    display flex
    flex-direction column
    padding-bottom 10px

    hr
      width 100%
      margin 1.5em 0

    .item
      display flex
      flex-direction column

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

      &-btns
        display flex
        margin-top 10px

        & > *
          margin-right 1em
          border-radius 4px
</style>
