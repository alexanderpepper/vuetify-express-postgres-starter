<template lang="pug">
  .user-password
    input(type='password', name='password', style='opacity: 0; position: absolute; pointer-events: none;')
    v-text-field(label='Password', v-model='user.password', :type='hidePassword ? "password" : "text"', :append-icon="hidePassword ? 'visibility_off' : 'visibility'", @click:append="() => (hidePassword = !hidePassword)", required, autocomplete='off')
    v-text-field(label='Confirm Password', v-model='user.confirmPassword', :type='hideConfirmPassword ? "password" : "text"', :append-icon="hideConfirmPassword ? 'visibility_off' : 'visibility'", @click:append="() => (hideConfirmPassword = !hideConfirmPassword)", required, autocomplete='off')
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
