<template lang="pug">
  .send-password-reset-link
    div(v-if='user.phone')
      .body-1 We'll send you a link to reset your password. Where should we send the link?
      v-radio-group(v-model='user.sendViaSms')
        v-radio(:label='`Email to ${user.email}`', :value='false')
        v-radio(:label='`Text message to ${phone}`', :value='true')
    div(v-else)
      .body-1 We'll send a link to reset your password to {{ user.email }} to verify your information
</template>

<script>
export default {
  name: 'sendPasswordResetLink',
  props: {
    user: Object
  }
}
</script>
