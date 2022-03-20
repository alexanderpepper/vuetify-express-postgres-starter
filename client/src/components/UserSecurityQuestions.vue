<template lang="pug">
  .user-security-questions
    .subtitle-2 Security Question 1
    v-text-field(label='Question', v-model='user.securityQuestion1', required)
    v-text-field(label='Answer', v-model='user.securityAnswer1', required)
    .subtitle-2 Security Question 2
    v-text-field(label='Question', v-model='user.securityQuestion2', required)
    v-text-field(label='Answer', v-model='user.securityAnswer2', required)
</template>

<script>
export default {
  name: 'userSecurityQuestions',
  props: {
    user: Object
  }
}
</script>
