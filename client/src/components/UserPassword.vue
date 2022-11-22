<template lang="pug">
  .user-password
    input( type='password', name='password', style='opacity: 0; position: absolute; pointer-events: none;')
    v-text-field(
      required,
      autocomplete='off',
      label='Password',
      v-model='user.password',
      :type='hidePassword ? "password" : "text"',
      :append-icon="hidePassword ? 'visibility_off' : 'visibility'",
      :error-messages='errors.password',
      @click:append="() => (hidePassword = !hidePassword)",
      @input='$emit("clear-errors", "password")'
      @keydown.enter='$emit("keydown-enter")')
    v-text-field(
      required,
      autocomplete='off',
      label='Confirm Password',
      v-model='user.confirmPassword',
      :type='hideConfirmPassword ? "password" : "text"',
      :append-icon="hideConfirmPassword ? 'visibility_off' : 'visibility'",
      :error-messages='errors.confirmPassword',
      @click:append="() => (hideConfirmPassword = !hideConfirmPassword)",
      @input='$emit("clear-errors", "confirmPassword")',
      @keydown.enter='$emit("keydown-enter")')
</template>

<script>

export default {
  name: 'userPassword',
  props: {
    user: Object,
    errors: Object
  },
  data: () => ({
    hidePassword: true,
    hideConfirmPassword: true
  })
}
</script>
