<template lang="pug">
  .send-username
    div(v-if='user.phone')
      .body-1 Where should we send your username?
      v-radio-group(v-model='user.sendViaSms')
        v-radio(:label='`Email to ${user.email}`' :value='false')
        v-radio(:label='`Text message to ${phone}`' :value='true')
    div(v-else)
      .body-1 We'll send your username to {{ user.email }}.
</template>

<script>
import { formattedPhone } from '../../../app/utilities/user.utilities'

export default {
  name: 'sendUsername',
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
