import userStructure from '../../constants/user-structure'
import SignInService from '@/services/SignInService'
import UserService from '@/services/UserService'

const newUser = () => JSON.parse(JSON.stringify(userStructure))

export default {
  state: {
    currentUser: newUser(),
    userInfoReceived: false
  },
  getters: {
    currentUser: state => state.currentUser,
    userInfoReceived: state => state.userInfoReceived
  },
  mutations: {
    setCurrentUser: (state, user) => (state.currentUser = user),
    setUserInfoReceived: (state, userInfoReceived) => (state.userInfoReceived = userInfoReceived)
  },
  actions: {
    async login ({ commit, dispatch }, credentials) {
      if (credentials.identifier && credentials.password) {
        try {
          const signInResponse = await SignInService.signIn(credentials)
          window.localStorage.token = signInResponse.accessToken
          window.localStorage.id = signInResponse.id
          window.localStorage.tokenExpirationDate = signInResponse.expirationDate
        } catch (error) {
          dispatch('resetUserState')
          throw error
        } finally {
          commit('setUserInfoReceived', true)
        }
      } else {
        dispatch('resetUserState')
      }
    },
    logout () {
      delete window.localStorage.token
      delete window.localStorage.id
      delete window.localStorage.tokenExpirationDate
    },
    async getCurrentUser ({ commit, dispatch }) {
      try {
        const user = await UserService.me()
        if (user) {
          commit('setCurrentUser', user)
          if (this.$route.path === '/') {
            this.$router.push({ name: 'home' })
          }
        } else {
          dispatch('resetUserState')
        }
      } catch (error) {
        dispatch('resetUserState')
        throw error
      }
    },
    resetUserState ({ commit, dispatch }) {
      dispatch('logout')
      commit('setCurrentUser', newUser())
    }
  }
}
