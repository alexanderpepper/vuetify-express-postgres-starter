<template lang="pug">
  .user-security-questions
    .subtitle-2 Security Question 1
    v-text-field(
      required
      v-model='user.securityQuestion1'
      label='Question'
      :error-messages='errors.securityQuestion1'
      @keydown.enter='$emit("keydown-enter")')
    v-text-field(
      required
      label='Answer'
      v-model='user.securityAnswer1'
      :error-messages='errors.securityAnswer1'
      @keydown.enter='$emit("keydown-enter")')
    .subtitle-2.mt-4 Security Question 2
    v-text-field(
      required
      v-model='user.securityQuestion2'
      label='Question'
      :error-messages='errors.securityQuestion2'
      @keydown.enter='$emit("keydown-enter")')
    v-text-field(
      required
      v-model='user.securityAnswer2'
      label='Answer'
      :error-messages='errors.securityAnswer2'
      @keydown.enter='$emit("keydown-enter")')
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
