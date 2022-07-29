<template lang="pug">
  .user-phone
    v-layout
      v-text-field(label='Phone Number',
        v-model='maskedPhone',
        v-mask='user.isInternationalPhone ? "+#####################" : "(###) ### - ####"',
        type='tel',
        :placeholder='showPlaceholder ? user.isInternationalPhone ? "+888 8888888888" : "(888) 888 - 8888" : ""',
        @keyup.enter='isNextEnabled && step++')
      v-select.phone-format-select(:items='phoneFormats', item-value='isInternational', item-text='text' v-model='user.isInternationalPhone')
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  name: 'userPhone',
  directives: { mask },
  props: {
    user: Object,
    showPlaceholder: Boolean
  },
  data: () => ({
    maskedPhone: '',
    phoneFormats: [
      { text: '🇺🇸', isInternational: false },
      { text: '🌐', isInternational: true }
    ]
  }),
  watch: {
    maskedPhone () {
      this.$emit('set-phone', this.unmaskText(this.maskedPhone))
    },
    'user.id' () {
      const phone = this.user.phone
      this.maskedPhone = this.isInternationalPhone
        ? `+${phone}`
        : phone
          ? `(${phone.substring(0, 3)}) ${phone.substring(3, 6)} - ${phone.substring(6, 10)}`
          : phone
    }
  },
  methods: {
    unmaskText: function (text) {
      const defaultDelimiters = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/
      return text ? String(text).replace(new RegExp(defaultDelimiters, 'g'), '') : text
    }
  }
}
</script>

<style scoped>
  .phone-format-select {
    max-width: 56px;
  }
</style>
