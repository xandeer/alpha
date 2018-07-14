<template lang="pug">
#app
  section.main
    header 学而时习之

    router-view
</template>

<script>
export default {
  name: 'app',
}
</script>

<style lang="stylus">
html,
body
  width 100%
  height 100%

body
  color #ce9178
  font-size 12px

header
  text-align center
  font-size 2.4em
  padding 1em
  color #007acc

ul
  margin 0
  padding 0

li
  list-style none

input, textarea
  background-color #1E1E1E
  color #CE9178
  letter-spacing 1
  border-color #404040
  border-style solid

a
  background transparent
  color #007add

strong
  font-weight bold
  color #BA80B6

textarea
  resize none

button 
  border none
  outline none
  background-color #404040
  color #bbb

.btn:hover
  cursor pointer

#app
  background-color #333
  overflow-y scroll
  // for ios momentum scrolling
  -webkit-overflow-scrolling touch
  position relative
  width 100%
  height 100%

.main
  max-width 700px
  min-width 300px
  min-height 100vh
  margin 0 auto
  padding 0 20px
  background-color #252525

</style>
