<template lang="pug">
  .reset-password.pa-md-12.pa-sm-8.pa-xs-0
    v-card.elevation-12
      v-card-title.headline Reset Password
      v-card-text
        input(type='text', name='email', style='opacity: 0; position: absolute; pointer-events: none;')
        input(type='text', name='username', style='opacity: 0; position: absolute; pointer-events: none;')
        v-text-field(v-model='user.identifier', label='Username or email', autocomplete='off')
        user-password(:user='user')
        v-btn.mt-6(block, outlined, @click='resetPassword') Reset Password
</template>

<script>

import UserService from '../services/UserService'
import UserPassword from '../components/UserPassword'
import { mapActions, mapMutations } from 'vuex'
import EventBus from '@/services/EventBus'

export default {
  name: 'resetPassword',
  components: { UserPassword },
  props: ['passwordResetCode'],
  data: () => ({
    activationSuccess: null,
    user: {}
  }),
  methods: {
    ...mapMutations(['setToken']),
    ...mapActions(['getCurrentUser']),
    async resetPassword () {
      this.user.passwordResetCode = this.passwordResetCode
      const response = await UserService.resetPassword(this.user)
      this.setToken(response)
      await this.getCurrentUser()
      EventBus.$emit('show-snackbar', 'Password Reset')
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
