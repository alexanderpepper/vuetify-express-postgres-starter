<template lang="pug">
  .landing(v-cloak)
    register.mx-auto(v-if='isShowingRegister')
    login.mx-auto(ref='login', v-show='isShowingLogin', @login-success='user => $emit("login-success", user)', @show-snackbar='(message, type) => $emit("show-snackbar", message, type)')
    .text-center
      .mt-12(v-if='isShowingInitialView')
        .display-1 Landing Page
        .title(v-if='!currentUser.id') User is unauthenticated
      .mt-6(v-if='!currentUser.id')
        .mb-4.mx-auto(v-if='isShowingInitialView')
          v-btn.mr-3(large, outlined, @click='showLogin') Sign In
          v-btn.ml-3(
            large
            :light='$vuetify.theme.dark'
            :dark='!$vuetify.theme.dark'
            @click='showRegister') Sign Up Now
        .my-4(v-if='isShowingRegister')
          .subtitle-1.d-inline-block.mr-2.grey--text.text--darken-1 Already have an account?
          v-btn(outlined, @click='showLogin') Sign In
        .my-4(v-if='isShowingLogin')
          .subtitle-1.d-inline-block.mr-2.grey--text.text--darken-1 Don't have an account?
          v-btn(outlined, @click='showRegister') Sign Up Now
</template>

<script>
import Login from '../views/Login'
import Register from '../views/Register'
import EventBus from '../services/EventBus'
import { mapGetters } from 'vuex'

export default {
  name: 'landing',
  components: { Login, Register },
  data: () => ({
    isShowingLogin: false,
    isShowingRegister: false
  }),
  computed: {
    ...mapGetters(['currentUser']),
    isShowingInitialView () {
      return !this.isShowingRegister && !this.isShowingLogin
    }
  },
  watch: {
    $route: {
      handler () {
        this.isShowingLogin = false
        this.isShowingRegister = false
      }
    }
  },
  created () {
    EventBus.$on('login-error', this.showLogin)
  },
  methods: {
    loginError (error) {
      this.showLogin()
      this.$refs.login.loginError(error)
    },
    showLogin () {
      this.isShowingLogin = true
      this.isShowingRegister = false
    },
    showRegister () {
      this.isShowingLogin = false
      this.isShowingRegister = true
    },
    showInitialView () {
      this.isShowingLogin = false
      this.isShowingRegister = false
    }
  }
}
</script>

<style scoped>
  .landing {
    position: relative;
  }
</style>
