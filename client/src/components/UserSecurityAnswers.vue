<template lang="pug">
  .user-security-answers
    .body-1 Please answer the following security questions
    .subtitle-1(v-text='user.securityQuestion1')
    v-text-field(
      v-model='user.securityAnswer1',
      label='Answer',
      :error-messages='errors.securityAnswer1')
    .subtitle-1.mt-4(v-text='user.securityQuestion2')
    v-text-field(
      v-model='user.securityAnswer2',
      label='Answer',
      :error-messages='errors.securityAnswer2')
</template>

<script>
export default {
  name: 'userSecurityAnswers',
  props: {
    user: Object,
    errors: Object
  },
  watch: {
    'user.securityAnswer1' () {
      this.$emit('clear-errors', 'securityAnswer1')
    },
    'user.securityAnswer2' () {
      this.$emit('clear-errors', 'securityAnswer2')
    }
  }
}
</script>
