<template lang="pug">
  .reset-password.pa-md-12.pa-sm-8.pa-xs-0
    v-card.elevation-12
      v-card-title.headline Reset Password
      v-card-text
        input(type='text', name='email', style="opacity: 0; position: absolute; pointer-events: none;")
        input(type='text', name='username', style="opacity: 0; position: absolute; pointer-events: none;")
        v-text-field(v-model='user.identifier', label='Username or email', autocomplete='off')
        user-password(:user='user')
        v-btn.mt-6(block, outlined, @click='resetPassword') Reset Password
</template>

<script>

import UserService from '../services/UserService'
import LoginService from '../services/LoginService'
import UserPassword from '../components/UserPassword'

export default {
  name: 'resetPassword',
  components: { UserPassword },
  props: ['passwordResetCode'],
  data: () => ({
    activationSuccess: null,
    user: {}
  }),
  methods: {
    async resetPassword () {
      this.user.passwordResetCode = this.passwordResetCode
      const accessToken = await UserService.resetPassword(this.user)
      LoginService.saveAccessToken(accessToken)
      const user = await UserService.me()
      this.$emit('login-success', user)
      this.$emit('show-snackbar', 'Password Reset')
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
  .reset-password {
    max-width: 400px;
  }
</style>
