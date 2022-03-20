<template lang="pug">
  .activate.pa-md-12.pa-sm-8.pa-xs-0.text-center
      .headline {{ activationSuccess === true ? 'Activated' : 'Activation Failed' }}
      div(v-if='activationSuccess === true')
        .subtitle-1 All set to go, please login
        login(@login-success='user => $emit("login-success", user)', @show-snackbar='(message, type) => $emit("show-snackbar", message, type)')
      div(v-else)
        .subtitle-1 We didn't recognize the activation code
</template>

<script>

import UserService from '../services/UserService'
import Login from '../views/Login'

export default {
  name: 'activate',
  components: { Login },
  props: ['activationCode'],
  data: () => ({
    activationSuccess: null
  }),
  async created () {
    this.activationSuccess = await UserService.activate(this.activationCode)
  }
}
</script>

<style scoped>
  .activate {
  }
</style>
