<template lang="pug">
forms(title='Edit' :item='item' @submit='onSubmit')
</template>

<script>
import Forms from '../../ui/forms'

export default {
  name: 'edit',
  components: {
    Forms
  },
  computed: {
    index() {
      return this.$route.params.index
    },
    item() {
      return this.$store.getters.getItemByIndex(this.index)
    }
  },
  methods: {
    onSubmit(item) {
      this.$store.dispatch('update', {
        index: this.index,
        item
      })
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>
