<template lang="pug">
.search-wrap(:class='{ "is-active": isActive }')
  .search
    .search-input
    .recent
    h2 Shortcuts
    .shortcuts
      item(v-for='item in shortcuts' type='tag' :title='item')
    .tags
    .authors
    .froms
</template>

<script>
import Item from './search-item'
export default {
  name: 'search',
  components: {
    Item
  },
  data () {
    return {
      isActive: false,
      shortcuts: ['#', '##', '###', '####', '#####']
    }
  },
  methods: {
    show() {
      this.isActive = true
      document.body.classList.add('modal-open')

    },
    hide() {
      this.isActive = false
      document.body.classList.remove('modal-open')
    }
  }
}
</script>

<style lang="stylus">
.search-wrap
  position fixed
  display none
  left 0
  top 0
  width 100%
  height 100%
  background-color rgba(0, 0, 0, .5)
  overflow scroll
  justify-content center

  &.is-active
    display flex

.search
  width 100%
  max-width 700px
  min-width 300px
  min-height 100vh
  padding 0 20px
  background-color #252525

  .recent
  .shortcuts,
  .tags,
  .authors,
  .froms
    display flex
    flex-direction column
</style>
