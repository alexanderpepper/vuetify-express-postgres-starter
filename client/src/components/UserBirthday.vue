<template lang="pug">
  .user-birthday
    v-menu(
        v-model='datePickerMenu',
        transition='scale-transition',
        offset-y,
        ref='datePickerMenu',
        :close-on-content-click='false',
        :max-width="290")
      template(v-slot:activator='{ on, attrs }')
        v-text-field(
          type='tel',
          label='Birthday',
          v-on='on',
          v-bind='attrs',
          v-model='dateFormatted',
          :placeholder='showPlaceholder ? "MM/DD/YYYY" : ""',
          :error-messages='errors.birthday',
          @change='formattedDateChanged'
          @keydown.enter='$emit("keydown-enter")')
      v-date-picker(
        ref='datePicker',
        full-width,
        :landscape='false',
        scrollable,
        no-title,
        v-model='user.birthday',
        :max='new Date().toISOString().substr(0, 10)',
        min='1900-01-01',
        @input='datePicked',
        :active-picker.sync='activePicker')
</template>

<script>
import dateFormatMixin from '../mixins/dateFormatMixin'

export default {
  name: 'userBirthday',
  mixins: [dateFormatMixin],
  props: {
    showPlaceholder: Boolean,
    user: Object,
    errors: Object
  },
  data: () => ({
    datePickerMenu: false,
    dateFormatted: null,
    activePicker: null
  }),
  watch: {
    datePickerMenu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    user (newVal, oldVal) {
      if (newVal.id && !oldVal.id) {
        this.datePicked()
      }
    }
  },
  methods: {
    formattedDateChanged () {
      this.datePickerMenu = false
      this.$emit('set-birthday', this.parseDate(this.dateFormatted))
      this.$emit('clear-errors')
    },
    datePicked () {
      this.datePickerMenu = false
      this.dateFormatted = this.formatDate(this.user.birthday)
      this.$emit('clear-errors')
    }
  }
}
</script>
