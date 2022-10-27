export default {
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.autofocusField && this.$refs.autofocusField.$refs.input.focus()
      })
    })
  }
}
