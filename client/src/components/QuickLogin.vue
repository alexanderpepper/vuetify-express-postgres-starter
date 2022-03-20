<template lang="pug">
  .quick-login
    v-text-field.login-field.d-inline-block.pt-0.mr-4(
      height='32'
      placeholder='Username or Email'
      v-model='user.identifier'
      required
      hide-details
      autocomplete='off'
      @keyup.enter='login')
    v-text-field.login-field.d-inline-block.pt-0.mr-4(
      height='32'
      placeholder='Password'
      v-model='user.password'
      type='password'
      @keyup.enter='login'
      hide-details
      required
      autocomplete='off')
    v-btn.d-inline-block(outlined, small, @click='login') Sign In
</template>

<script>
import loginMixin from '../mixins/loginMixin'
export default {
  name: 'quickLogin',
  mixins: [loginMixin]
}
</script>

<style scoped>
  .login-field {
    width: 150px
  }
</style>
