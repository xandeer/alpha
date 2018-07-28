<template lang="pug">
button.btn.search-item(@click='filter' v-text='title')
</template>

<script>
export default {
  name: 'searchItem',
  props: ['type', 'title'],
  methods: {
    filter() {
      this.$router.push({ name: 'items', query: { type: this.type, value: encodeURIComponent(this.title)} })
      this.$parent.hide()
    }
  }
}
</script>

<style lang="stylus">
.search-item
  text-align start
  margin 4px 0
  padding 4px 8px
</style>
