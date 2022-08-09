<template lang="pug">
  .send-password-reset-link
    div(v-if='phone')
      .body-1 We'll send you a link to reset your password. Where should we send the link?
      v-radio-group(v-model='user.sendViaSms')
        v-radio(:label='`Email to ${email}`', :value='false')
        v-radio(:label='`Text message to ${phone}`', :value='true')
    div(v-else)
      .body-1 We'll send a link to reset your password to {{ email }} to verify your information
</template>

<script>
import userContactMixin from '@/mixins/userContactMixin'

export default {
  name: 'sendPasswordResetLink',
  mixins: [userContactMixin]
}
</script>
