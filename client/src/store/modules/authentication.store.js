import SignInService from '@/services/SignInService'
import UserService from '@/services/UserService'
import EventBus from '@/services/EventBus'

const newUser = () => ({
  id: null,
  name: null,
  email: null,
  photo: null,
  isAdmin: false,
  roles: []
})

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
    setUserInfoReceived: (state, userInfoReceived) => (state.userInfoReceived = userInfoReceived),
    setToken (state, response) {
      window.localStorage.token = response.token
      window.localStorage.id = response.id
      window.localStorage.tokenExpirationDate = response.expirationDate
    }
  },
  actions: {
    async signIn ({ commit, dispatch }, credentials) {
      try {
        const response = await SignInService.signIn(credentials)
        commit('setToken', response)
        dispatch('getCurrentUser')
      } catch (error) {
        dispatch('logout')
        EventBus.$emit('sign-in-error', error)
        throw error
      }
    },
    logout ({ commit }) {
      delete window.localStorage.token
      delete window.localStorage.id
      delete window.localStorage.tokenExpirationDate
      commit('setUserInfoReceived', true)
      commit('setCurrentUser', newUser())
    },
    async getCurrentUser ({ commit, dispatch }) {
      try {
        const user = await UserService.me()
        if (user) {
          commit('setCurrentUser', user)
        } else {
          dispatch('logout')
        }
      } catch (error) {
        dispatch('logout')
        throw error
      } finally {
        commit('setUserInfoReceived', true)
      }
    }
  }
}
