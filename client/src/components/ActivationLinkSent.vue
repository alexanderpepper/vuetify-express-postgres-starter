<template lang="pug">
  .activation-link-sent.text-center.my-2
    .body-1.d-inline.font-weight-light We've sent an activation link to
    .body-2.d-inline &nbsp;{{ sendViaSms ? user.phone : user.email }}
    .body-1.d-inline.font-weight-light .
    .body-1.mt-2.font-weight-light(v-if='sendViaSms') Tap on the link in the message to activate your account.
    .body-1.mt-2.font-weight-light(v-else) Click the link in the email to activate your account.
</template>

<script>
export default {
  name: 'activationLinkSent',
  props: {
    user: Object,
    sendViaSms: Boolean
  }
}
</script>
