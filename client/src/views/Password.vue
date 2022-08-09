<template lang="pug">
  .password.pa-md-12.pa-sm-8.pa-xs-0
    v-card.elevation-12(:class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-text
        .headline.font-weight-light Change Password
        form(novalidate, @submit.stop.prevent='changePassword', autocomplete='off')
          v-text-field.mt-2(label='Old Password', v-model='password.oldPassword', type='password')
          v-text-field.mt-1(label='New Password', v-model='password.newPassword', type='password')
          v-text-field.mt-1(label='Confirm Password', v-model='confirmPassword', type='password')
      v-card-actions
        v-spacer
        v-btn(text, router-link, :to='{ name: "account" }') Cancel
        v-btn(outlined, @click='changePassword', :disabled='!buttonEnabled') Change Password
</template>

<script>
import UserService from '../services/UserService'
import EventBus from '@/services/EventBus'

export default {
  name: 'password',
  data: () => ({
    password: {
      oldPassword: '',
      newPassword: ''
    },
    confirmPassword: ''
  }),
  computed: {
    buttonEnabled: function () {
      return this.password.oldPassword &&
        this.password.newPassword && this.confirmPassword &&
        this.password.newPassword === this.confirmPassword
    }
  },
  methods: {
    async changePassword () {
      try {
        await UserService.changePassword(this.password)
        EventBus.$emit('show-snackbar', 'Password Changed')
        this.$router.push({ name: 'account' })
      } catch (error) {
        EventBus.$emit('show-snackbar', error, 'error')
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
