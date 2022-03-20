<template lang="pug">
  .send-activation-link
    div(v-if='user.phone')
      .body-1 We'll send you a link to activate your account. Where should send the link?
      v-radio-group(v-model='sendViaSms', @change='$emit("set-send-via-sms", sendViaSms)')
        v-radio(:label='`Email to ${obscuredEmail}`', :value='false')
        v-radio(:label='`Text message to ${obscuredPhone}`', :value='true')
    div(v-else)
      .body-1 We'll send a link to activate your account to {{ obscuredEmail }}.
</template>

<script>
import UserService from '../services/UserService'

export default {
  name: 'sendActivationLink',
  props: {
    user: Object
  },
  data: () => ({
    sendViaSms: false
  }),
  computed: {
    obscuredEmail () {
      return UserService.obscuredEmail(this.user)
    },
    obscuredPhone () {
      return UserService.obscuredPhone(this.user)
    }
  }
}
</script>
