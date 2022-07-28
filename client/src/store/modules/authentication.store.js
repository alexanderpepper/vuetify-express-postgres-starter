import SignInService from '@/services/SignInService'
import UserService from '@/services/UserService'

const newUser = () => ({ id: null, name: null, roles: [] })

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
          const response = await SignInService.signIn(credentials)
          console.log(response)
          window.localStorage.token = response.token
          window.localStorage.id = response.id
          window.localStorage.tokenExpirationDate = response.expirationDate
        } catch (error) {
          dispatch('resetUserState')
          console.log(error)
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
        user.roles.forEach(role => (user[`is${role.name}`] = true))
        if (user) {
          commit('setCurrentUser', user)
        } else {
          dispatch('resetUserState')
        }
      } catch (error) {
        dispatch('resetUserState')
        throw error
      }
    },
    resetUserState ({ commit, dispatch }) {
      console.log('resetUserState')
      dispatch('logout')
      commit('setCurrentUser', newUser())
    }
  }
}
