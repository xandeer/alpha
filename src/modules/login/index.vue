<template lang="pug">
.login
  h1 Login Alpha
  .wrap
    .account
      .lable-account account: 
      input(v-model="account" @keyup.enter="login")
    .password
      .lable-password password: 
      input(type="password" v-model="password", @keyup.enter="login")
</template>

<script>
import sha1 from 'sha1'

export default {
  name: 'login',
  data() {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    async login() {
      const isLoginOk = await this.$store.dispatch('login', {
        name: this.account,
        password: sha1(this.password)
      })
      isLoginOk && (await this.$store.dispatch('init'))
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
.wrap
  width 300px
  margin 60px auto
  border 1px solid #cccccc
  border-radius 5px
  & > div
    width 80%
    margin 10px auto
    display flex
    justify-content space-between
    input
      width 68%
</style>
