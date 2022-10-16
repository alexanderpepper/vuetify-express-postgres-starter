<template lang="pug">
  .user-security-answers
    .body-1 Please answer the following security questions
    .subtitle-1(v-text='user.securityQuestion1')
    v-text-field(v-model='user.securityAnswer1', label='Answer')
    .subtitle-1(v-text='user.securityQuestion2')
    v-text-field(v-model='user.securityAnswer2', label='Answer')
</template>

<script>
export default {
  name: 'userSecurityAnswers',
  props: {
    user: Object,
    errors: Object
  }
}
</script>
