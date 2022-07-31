<template lang="pug">
  v-app
    v-app-bar.app-toolbar(app, fixed, clipped-left, dense, hide-on-scroll)
      v-toolbar-title.mr-4
        .headline.cursor-pointer(@click='$router.push({ name: currentUser.id ? "home": "landing" })')
          span.mr-3 🐊
          span.font-weight-regular Vuetify
          span.font-weight-light Express
          span.font-weight-thin PostgreSQL
      v-spacer
      v-toolbar-title.text-right.px-0.hidden-xs-only(v-if='currentUser.id')
        .subtitle-1(v-text='currentUser.name')
      main-menu(
        v-if='currentUser.id',
        @logout='logoutClicked',
        @toggle-theme='toggleTheme')
      quick-login.hidden-xs-only(v-if='userInfoReceived && !currentUser.id')
      v-btn.ml-2(small, text, icon, v-if='userInfoReceived && !currentUser.id', @click='toggleTheme')
        v-icon invert_colors
    v-main
      transition(name='fade-transition', mode='out-in')
        router-view.router-view.mx-auto
    v-snackbar(
      v-model='snackbar'
      :timeout='3000'
      :bottom='true'
      :color='snackbarStyle')
      span(v-text='snackbarMessage')
      v-btn(text, dark, @click='snackbar = false') Close
</template>

<script>
import MainMenu from './components/MainMenu'
import QuickLogin from './components/QuickLogin'
import { mapActions, mapGetters } from 'vuex'
import EventBus from '@/services/EventBus'

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
      ]
    }
  },
  computed: mapGetters(['currentUser', 'userInfoReceived']),
  async created () {
    this.$vuetify.theme.dark = window.localStorage.dark === 'true'
    try {
      await this.getCurrentUser()
      if (this.$route.path === '/') {
        this.$router.push({ name: 'home' })
      }
    } catch (error) {
      if (!this.unauthenticatedRoutes.includes(this.$route.name)) {
        this.logoutClicked()
      }
    }
    this.$store.subscribeAction(async action => {
      if (action.type === 'loginSuccess') {
        await this.getCurrentUser()
        await this.$router.push({ name: 'home' })
      }
    })

    EventBus.$on('show-snackbar', this.showSnackbar)
  },
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
