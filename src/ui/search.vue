<template lang="pug">
.search-wrap(:class='{ "is-active": isActive }')
  .search
    .search-input
    .shortcuts
      h2 Shortcuts
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
    },
    hide() {
      this.isActive = false
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

  &.is-active
    display block

.search
  max-width 700px
  min-width 300px
  min-height 100vh
  margin 0 auto
  padding 0 20px
  background-color #252525
</style>
