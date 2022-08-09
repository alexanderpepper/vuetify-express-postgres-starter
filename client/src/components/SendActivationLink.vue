<template lang="pug">
  .send-activation-link
    div(v-if='phone')
      .body-1 We'll send you a link to activate your account. Where should send the link?
      v-radio-group(v-model='user.sendViaSms')
        v-radio(:label='`Email to ${email}`', :value='false')
        v-radio(:label='`Text message to ${phone}`', :value='true')
    div(v-else)
      .body-1 We'll send a link to activate your account to {{ email }}.
</template>

<script>
import userContactMixin from '@/mixins/userContactMixin'

export default {
  name: 'sendActivationLink',
  mixins: [userContactMixin]
}
</script>
