<template lang="pug">
  .activate.pa-md-12.pa-sm-8.pa-xs-0.text-center
      .headline(v-text='activationSuccess === true ? "Activated" : "Activation Failed"')
      div(v-if='activationSuccess === true')
        .subtitle-1 All set to go, please sign in
        signIn(@sign-in-success='user => $emit("sign-in-success", user)')
      div(v-else)
        .subtitle-1 We didn't recognize the activation code
</template>

<script>

import UserService from '../services/UserService'
import signIn from './SignIn'

export default {
  name: 'activate',
  components: { signIn },
  props: ['activationCode'],
  data: () => ({
    activationSuccess: null
  }),
  async created () {
    try {
      await UserService.activate(this.activationCode)
      this.activationSuccess = true
    } catch (err) {
      this.activationSuccess = false
    }
  }
}
</script>

<style scoped>
  .activate {
  }
</style>
