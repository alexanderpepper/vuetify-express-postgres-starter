<template lang="pug">
  .user-identifier
    v-text-field(
      required,
      label='Name',
      v-model='user.name',
      autocomplete='newName',
      :error-messages='errors.name',
      @keydown.enter='$emit("keydown-enter")')
    v-text-field(
      required,
      label='Username',
      v-model='user.username',
      autocomplete='newUsername',
      :error-messages='errors.username',
      @keydown.enter='$emit("keydown-enter")')
    v-text-field(
      required,
      label='Email Address',
      v-model='user.email',
      type='email',
      autocomplete='newEmail',
      :error-messages='errors.email',
      @keydown.enter='$emit("keydown-enter")')
</template>

<script>

export default {
  name: 'userIdentifier',
  props: {
    user: Object,
    errors: Object
  },
  watch: {
    'user.name' () {
      this.$emit('clear-errors', 'name')
    },
    'user.username' () {
      this.$emit('clear-errors', 'username')
    },
    'user.email' () {
      this.$emit('clear-errors', 'email')
    }
  }
}
</script>
