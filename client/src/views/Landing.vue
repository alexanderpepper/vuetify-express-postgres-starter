<template lang="pug">
  .landing(v-cloak)
    sign-up.mx-auto(v-if='isShowingSignUp')
    sign-in.mx-auto(
      ref='signIn',
      v-show='isShowingSignIn',
      @sign-in-success='user => $emit("sign-in-success", user)',
      @show-snackbar='(message, type) => $emit("show-snackbar", message, type)')
    .text-center
      .mt-12(v-if='isShowingInitialView')
        .display-1 Landing Page
        .title(v-if='!currentUser.id') User is unauthenticated
      .mt-6(v-if='!currentUser.id')
        .mb-4.mx-auto(v-if='isShowingInitialView')
          v-btn.mr-3(large, outlined, @click='showSignIn') Sign In
          v-btn.ml-3(
            large
            :light='$vuetify.theme.dark'
            :dark='!$vuetify.theme.dark'
            @click='showSignup') Sign Up Now
        .my-4(v-if='isShowingSignUp')
          .subtitle-1.d-inline-block.mr-2.grey--text.text--darken-1 Already have an account?
          v-btn(outlined, @click='showSignIn') Sign In
        .my-4(v-if='isShowingSignIn')
          .subtitle-1.d-inline-block.mr-2.grey--text.text--darken-1 Don't have an account?
          v-btn(outlined, @click='showSignup') Sign Up Now
</template>

<script>
import signIn from './SignIn'
import signUp from './SignUp'
import EventBus from '../services/EventBus'
import { mapGetters } from 'vuex'

export default {
  name: 'landing',
  components: { signIn, signUp },
  data: () => ({
    isShowingSignIn: false,
    isShowingSignUp: false
  }),
  computed: {
    ...mapGetters(['currentUser']),
    isShowingInitialView () {
      return !this.isShowingSignUp && !this.isShowingSignIn
    }
  },
  watch: {
    $route: {
      handler () {
        this.isShowingSignIn = false
        this.isShowingSignUp = false
      }
    }
  },
  created () {
    EventBus.$on('sign-in-error', this.showSignIn)
  },
  methods: {
    signInError (error) {
      this.showSignIn()
      this.$refs.signIn.signInError(error)
    },
    showSignIn () {
      this.isShowingSignIn = true
      this.isShowingSignUp = false
    },
    showSignup () {
      this.isShowingSignIn = false
      this.isShowingSignUp = true
    },
    showInitialView () {
      this.isShowingSignIn = false
      this.isShowingSignUp = false
    }
  }
}
</script>

<style scoped>
  .landing {
    position: relative;
  }
</style>
