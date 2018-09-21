<template lang="pug">
forms(title='Add' :item='lastAddMeta' @submit='onSubmit')
</template>

<script>
import { mapState } from 'vuex'

import Forms from '../../ui/forms'

export default {
  name: 'add',
  components: {
    Forms
  },
  computed: {
    ...mapState(['lastAddMeta'])
  },
  methods: {
    onSubmit(item) {
      this.$store.dispatch('add', item)
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>
