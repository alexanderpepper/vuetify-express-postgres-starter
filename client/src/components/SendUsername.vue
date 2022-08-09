<template lang="pug">
  .send-username
    div(v-if='phone')
      .body-1 Where should we send your username?
      v-radio-group(v-model='user.sendViaSms')
        v-radio(:label='`Email to ${email}`' :value='false')
        v-radio(:label='`Text message to ${phone}`' :value='true')
    div(v-else)
      .body-1 We'll send your username to {{ email }}.
</template>

<script>

import userContactMixin from '@/mixins/userContactMixin'

export default {
  name: 'sendUsername',
  mixins: [userContactMixin]
}
</script>
