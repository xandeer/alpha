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
