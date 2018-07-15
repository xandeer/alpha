<template lang="pug">
  button.fab(v-bind:class='{ "is-opened": isOpened }' @click='onClick') +
</template>

<script>
export default {
  name: 'fab',
  data () {
    return {
      isOpened: false
    }
  },
  computed: {
    eventName() {
      return this.isOpened ? 'onClose' : 'onOpen'
    }
  },
  methods: {
    onClick() {
      this.$emit(this.eventName)
      this.isOpened = !this.isOpened
    },
    open() {
      this.isOpened = true
    },
    close() {
      this.isOpened = false
    }
  }
}
</script>

<style lang="stylus">
.fab
  width 36px
  height 36px
  border-radius 50%
  position fixed
  bottom 48px
  right 48px
  background-color #007acc
  // text-align center
  text-decoration none
  font-size 1.5em
  cursor pointer
  user-select none
  color #fff
  padding 0px

  &.is-opened
    transform rotate(45deg)
</style>
