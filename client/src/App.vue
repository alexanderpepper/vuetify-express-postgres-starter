<template lang="pug">
  v-app
    v-app-bar.app-toolbar(app, fixed, clipped-left, dense, hide-on-scroll)
      v-toolbar-title.mr-4
        .headline.cursor-pointer(@click='$router.push({ name: user.id ? "home": "landing" })')
          span.mr-3 🐊
          span.font-weight-regular Vuetify
          span.font-weight-light Express
          span.font-weight-thin PostgreSQL
      v-spacer
      v-toolbar-title.text-right.px-0.hidden-xs-only(v-if='user.id')
        .subtitle-1 {{ user.name }}
      main-menu(
        v-if='user.id',
        @logout='logoutClicked',
        @toggle-theme='toggleTheme')
      quick-login.hidden-xs-only(
        v-if='userInfoReceived && !user.id',
        @login-success='loginSuccess')
      v-btn.ml-2(small, text, icon, v-if='userInfoReceived && !user.id', @click='toggleTheme')
        v-icon invert_colors
    v-content
      transition(name='fade-transition', mode='out-in')
        router-view.router-view.mx-auto(
          @show-snackbar='showSnackbar',
          @login-success='loginSuccess')
    v-snackbar(
      v-model='snackbar',
      :timeout='3000',
      :bottom='true',
      :color='snackbarStyle') {{ snackbarMessage }}
      v-btn(text, dark, @click='snackbar = false') Close
</template>

<script>
import MainMenu from './components/MainMenu'
import QuickLogin from './components/QuickLogin'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: { MainMenu, QuickLogin },
  data () {
    return {
      unauthenticatedRoutes: ['landing', 'activate', 'resetPassword', 'support'],
      snackbar: false,
      snackbarMessage: '',
      snackbarStyle: '',
      items: [
        { icon: 'people', title: 'Manage Users', name: 'users' },
        { icon: 'help', title: 'Contact Support', name: 'support' }
      ],
      userInfoReceived: false
    }
  },
  async created () {
    this.$vuetify.theme.dark = window.localStorage.dark === 'true'
    try {
      await this.getCurrentUser()
      if (this.$route.path === '/') {
        this.$router.push({ name: 'home' })
      }
    } catch (error) {
      if (this.unauthenticatedRoutes.indexOf(this.$route.name) === -1) {
        this.logout()
      }
    }
    this.$store.subscribeAction(async action => {
      if (action.type === 'loginSuccess') {
        await this.getCurrentUser()
        await this.$router.push({ name: 'home' })
      }
    })
  },
  computed: mapGetters(['user', 'userInfoReceived']),
  methods: {
    ...mapActions(['getCurrentUser', 'resetUserState', 'logout']),
    toggleTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      window.localStorage.dark = this.$vuetify.theme.dark
    },
    async logoutClicked () {
      this.logout()
      await this.$router.push({ name: 'landing' })
    },
    showSnackbar (message, style) {
      this.snackbarMessage = message
      this.snackbarStyle = style
      this.snackbar = true
    }
  }
}
</script>

<style scoped>
  .router-view {
    max-width: 1280px;
  }
  .theme--dark .avatar-container {
    padding: 6px;
    background-color: white;
    border-radius: 50%;
  }
  img {
    width: 38px;
  }
</style>
