<template lang="pug">
  .password.pa-md-12.pa-sm-8.pa-xs-0
    v-card.elevation-12(:class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-text
        .headline.font-weight-light Change Password
        form(novalidate, @submit.stop.prevent='changePassword', autocomplete='off')
          v-text-field.mt-2(
            label='Old Password',
            v-model='request.oldPassword',
            type='password',
            :error-messages='errors.oldPassword'
            @input='errors.oldPassword = []')
          v-text-field.mt-1(
            label='New Password',
            v-model='request.password',
            type='password',
            :error-messages='errors.password'
            @input='errors.password = []')
          v-text-field.mt-1(
            label='Confirm Password',
            v-model='request.confirmPassword',
            type='password',
            :error-messages='errors.confirmPassword'
            @input='errors.confirmPassword = []')
      v-card-actions
        v-spacer
        v-btn(text, router-link, :to='{ name: "account" }') Cancel
        v-btn(outlined, @click='changePassword') Change Password
</template>

<script>
import UserService from '../services/UserService'
import EventBus from '@/services/EventBus'

export default {
  name: 'password',
  data: () => ({
    request: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    },
    errors: {}
  }),
  methods: {
    async changePassword () {
      try {
        await UserService.changePassword(this.request)
        EventBus.$emit('show-snackbar', 'Password Changed')
        this.$router.push({ name: 'account' })
      } catch ({ validationErrors }) {
        this.errors = validationErrors
        EventBus.$emit('show-snackbar', 'Unable to change password', 'error')
      }
    }
  }
}
</script>

<style scoped>
  .password {
    max-width: 480px;
  }
</style>
