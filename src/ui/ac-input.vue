<template lang="pug">
el-autocomplete(triggerOnFocus=false
  ref='el'
  v-bind="[$props, $attrs]"
  v-model='mValue'
  @input='handleChange'
  @select='select'
  @focus='onFocus'
  @keyup.enter.native='handleEnterUp'
  :hide-loading='true'
  :fetch-suggestions="filter")
</template>

<script>
import Migrating from 'element-ui/src/mixins/migrating'

export default {
  name: 'AcInput',
  data () {
    return {
      mValue: ''
    }
  },
  props: {
    type: String,
    value: String,
    clearAfterEnter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onFocus(e) {
      e.target.setSelectionRange(0, 9999)
    },
    select(item) {
      this.$emit('input', item.value)
    },
    focus() {
      this.$refs.el.focus()
    },
    handleEnterUp(event) {
      this.$emit('enterup', event)
      this.$refs.el.suggestions = null
      if (this.clearAfterEnter) {
        this.mValue = ''
      }
    },
    handleChange(value) {
      this.$emit('input', value)
    },
    async filter(prefix, cb) {
      const ret = prefix ? (await this.$store.dispatch('startsWithMetadata', {
        prefix,
        type: this.type
      })).map(it => { return {value: it }}) : []
      cb(ret)
    }
  }
}
</script>
