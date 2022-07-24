import userStructure from '../../constants/user-structure'
import SignInService from '@/services/SignInService'
import UserService from '@/services/UserService'
import EventBus from '@/services/EventBus'

const newUser = () => JSON.parse(JSON.stringify(userStructure))

export default {
  state: {
    user: newUser(),
    userInfoReceived: false
  },
  getters: {
    user: state => state.user,
    userInfoReceived: state => state.userInfoReceived
  },
  mutations: {
    setUser: (state, user) => (state.user = user),
    setUserInfoReceived: (state, userInfoReceived) => (state.userInfoReceived = userInfoReceived)
  },
  actions: {
    async login ({ commit, dispatch }, credentials) {
      if (credentials.identifier && credentials.password) {
        try {
          const signInResponse = await SignInService.signIn(this.credentials)
          window.localStorage.token = signInResponse.accessToken
          window.localStorage.user = signInResponse.id
          window.localStorage.tokenExpirationDate = signInResponse.expirationDate
          dispatch('loginSuccess')
        } catch (error) {
          dispatch('resetUserState')
        } finally {
          commit('setuserInfoReceived', true)
        }
      } else {
        await this.$router.push({ name: 'login' })
      }
    },
    loginSuccess () {},
    logout () {
      delete window.localStorage.token
      delete window.localStorage.user
    },
    async getCurrentUser ({ commit, dispatch }) {
      try {
        const user = await UserService.me()
        if (user) {
          commit('setUser', user)
        } else {
          dispatch('resetUserState')
        }
      } catch (error) {

      }
    },
    resetUserState ({ commit, dispatch }) {
      dispatch('logoout')
      commit('setUser', newUser())
    }
  }
}
