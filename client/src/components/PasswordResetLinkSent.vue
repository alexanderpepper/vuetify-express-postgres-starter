<template lang="pug">
  .password-reset-link-sent.text-center.my-2
    .body-1.d-inline.font-weight-light We've sent a password reset link to
    .body-2(v-text='sendViaSms ? user.phone : user.email')
    .body-1.mt-2.font-weight-light(v-if='sendViaSms') Tap on the link in the message to reset your password.
    .body-1.mt-2.font-weight-light(v-else) Click the link in the email to reset your password.
</template>

<script>

export default {
  name: 'passwordResetLinkSent',
  props: {
    user: Object,
    sendViaSms: Boolean
  }
}
</script>
