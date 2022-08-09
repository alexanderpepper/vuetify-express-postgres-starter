<template lang="pug">
  .username-sent.text-center.my-2
    .body-1.d-inline.font-weight-light We've sent your username to
    .body-2.d-inline &nbsp;{{ user.sendViaSms ? phone : user.email }}
    .body-1.d-inline.font-weight-light .
</template>

<script>

import { formattedPhone } from '../../../app/utilities/user.utilities'

export default {
  name: 'usernameSent',
  props: {
    user: Object
  },
  computed: {
    phone () {
      return formattedPhone(this.user)
    }
  }
}
</script>
