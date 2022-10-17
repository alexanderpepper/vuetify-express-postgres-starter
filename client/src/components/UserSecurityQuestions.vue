<template lang="pug">
  .user-security-questions
    .subtitle-2 Security Question 1
    v-text-field(
      label='Question'
      v-model='user.securityQuestion1'
      required
      :error-messages='errors.securityQuestion1')
    v-text-field(
      label='Answer'
      v-model='user.securityAnswer1'
      required
      :error-messages='errors.securityAnswer1')
    .subtitle-2 Security Question 2
    v-text-field(
      label='Question'
      v-model='user.securityQuestion2'
      required
      :error-messages='errors.securityQuestion2')
    v-text-field(
      label='Answer'
      v-model='user.securityAnswer2'
      required
      :error-messages='errors.securityAnswer2')
</template>

<script>
export default {
  name: 'userSecurityQuestions',
  props: {
    user: Object,
    errors: Object
  },
  watch: {
    'user.securityQuestion1' () {
      this.$emit('clear-errors', 'securityQuestion1')
    },
    'user.securityQuestion2' () {
      this.$emit('clear-errors', 'securityQuestion2')
    },
    'user.securityAnswer1' () {
      this.$emit('clear-errors', 'securityAnswer1')
    },
    'user.securityAnswer2' () {
      this.$emit('clear-errors', 'securityAnswer2')
    }
  }
}
</script>
