<template lang="pug">
  .username-sent.text-center.my-2
    .body-1.d-inline.font-weight-light We've sent your username to
    .body-2.d-inline &nbsp;{{ user.sendViaSms ? phone : email }}
    .body-1.d-inline.font-weight-light .
</template>

<script>

import userContactMixin from '@/mixins/userContactMixin'

export default {
  name: 'usernameSent',
  mixins: [userContactMixin]
}
</script>
