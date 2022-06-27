import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      name: null,
      isAdmin: null
    }
  },
  mutations: {
    setUser (state, user) {
      if (user) {
        user.isAdmin = user.roles.find(r => r.name === 'Admin') !== undefined
        state.user = user
      }
    },
    clearUser () {
      this.state.user = {}
    }
  },
  actions: {
  },
  modules: {
  }
})
