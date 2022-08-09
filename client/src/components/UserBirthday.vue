<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  .user-birthday
    v-menu(v-model='datePickerMenu' transition='scale-transition' offset-y :close-on-content-click='false' ref='datePickerMenu' :max-width="290")
      template(v-slot:activator='{ on }')
        v-text-field(
          type='tel'
          label='Birthday',
          v-on='on',
          v-model='dateFormatted',
          @blur='user.birthday = parseDate(dateFormatted)',
          :placeholder='showPlaceholder ? "MM/DD/YYYY" : ""')
      v-date-picker(ref='datePicker' full-width :landscape='false' scrollable no-title v-model='user.birthday' :max='new Date().toISOString().substr(0, 10)' min='1900-01-01' :active-picker.sync='activePicker')
        v-spacer
        v-btn(text @click='datePickerMenu = false') Cancel
        v-btn(outlined @click='$refs.datePickerMenu.save(user.birthday)') OK
</template>

<script>
import dateFormatMixin from '../mixins/dateFormatMixin'

export default {
  name: 'userBirthday',
  mixins: [dateFormatMixin],
  props: {
    showPlaceholder: Boolean,
    user: Object
  },
  data: () => ({
    datePickerMenu: false,
    dateFormatted: null,
    activePicker: null
  }),
  watch: {
    'user.birthday': {
      handler () {
        this.dateFormatted = this.formatDate(this.user.birthday)
      },
      immediate: true
    },
    datePickerMenu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  }
}
</script>
