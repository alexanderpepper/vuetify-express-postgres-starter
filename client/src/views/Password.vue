<template lang="pug">
  .password.pa-md-12.pa-sm-8.pa-xs-0
    v-card.elevation-12(:class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-text
        .headline.font-weight-light Change Password
        form(novalidate, @submit.stop.prevent='changePassword', autocomplete='off')
          v-text-field.mt-2(
            label='Old Password',
            v-model='request.oldPassword',
            :type='hideOldPassword ? "password" : "text"',
            :append-icon='hideOldPassword ? "visibility_off" : "visibility"',
            @click:append="() => (hideOldPassword = !hideOldPassword)"
            :error-messages='errors.oldPassword'
            @input='errors.oldPassword = []')
          v-text-field.mt-1(
            label='New Password',
            v-model='request.password',
            :type='hidePassword ? "password" : "text"',
            :append-icon='hidePassword ? "visibility_off" : "visibility"',
            @click:append="() => (hidePassword = !hidePassword)"
            :error-messages='errors.password',
            @input='errors.password = []')
          v-text-field.mt-1(
            label='Confirm Password',
            v-model='request.confirmPassword',
            :type='hideConfirmPassword ? "password" : "text"',
            :append-icon='hideConfirmPassword ? "visibility_off" : "visibility"',
            @click:append="() => (hideConfirmPassword = !hideConfirmPassword)"
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
    errors: {},
    hideOldPassword: true,
    hidePassword: true,
    hideConfirmPassword: true
  }),
  methods: {
    async changePassword () {
      try {
        const response = await UserService.changePassword(this.request)
        EventBus.$emit('show-success-snackbar', response)
        this.$router.push({ name: 'account' })
      } catch ({ validationErrors }) {
        this.errors = validationErrors
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
