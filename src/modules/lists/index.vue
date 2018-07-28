<template lang="pug">
article.lists
  items(:items='items')
  fab.lists-fab(@open='onFabOpen' @close='onFabClose' ref='fab' :class='{"is-signined": isSignined}')
</template>

<script>
import { mapState } from 'vuex'

import Fab from '../../ui/fab'
import Items from '../../ui/items'

export default {
  name: 'lists',
  components: {
    Fab,
    Items
  },
  computed: {
    ...mapState(['items', 'isSignined']),
  },
  methods: {
    onFabOpen() {
      this.$router.push('add')
    },
    onFabClose() {
      this.$router.push('/')
    },
    handleRouteIn(query) {
      if (query.type && query.value) {
        const o = { [query.type]: decodeURIComponent(query.value) }
        this.$store.dispatch('filter', o)
        this.$refs.fab.open()
      } else {
        this.$store.dispatch('refreshItems')
        this.$nextTick(() => {
          this.$refs.fab.close()
        })
      }
      window.scroll(0, 0)
    },
  },
  beforeRouteUpdate(to, from, next) {
    to.name === 'items' && this.handleRouteIn(to.query)
    next()
  },
  mounted() {
    this.handleRouteIn(this.$route.query)
  }
}

function simulateClick(target) {
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  target.dispatchEvent(evt)
}
</script>

<style lang="stylus">
.lists
  &-fab
    border 2px solid #d33

    &.is-signined
      border none
</style>
