<template lang="pug">
  .send-activation-link
    div(v-if='user.phone')
      .body-1 We'll send you a link to activate your account. Where should send the link?
      v-radio-group(v-model='user.sendViaSms')
        v-radio(:label='`Email to ${user.email}`', :value='false')
        v-radio(:label='`Text message to ${phone}`', :value='true')
    div(v-else)
      .body-1 We'll send a link to activate your account to {{ user.email }}.
</template>

<script>
import { formattedPhone } from '../../../app/utilities/user.utilities'

export default {
  name: 'sendActivationLink',
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
