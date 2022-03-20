<template lang="pug">
  .username-sent.text-center.my-2
    .body-1.d-inline.font-weight-light We've sent your username to
    .body-2.d-inline &nbsp;{{ sendViaSms ? obscuredPhone : obscuredEmail }}
    .body-1.d-inline.font-weight-light .
</template>

<script>
import UserService from '../services/UserService'

export default {
  name: 'usernameSent',
  props: {
    user: Object,
    sendViaSms: Boolean
  },
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
