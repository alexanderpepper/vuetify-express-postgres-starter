import Vue from 'vue'
import Vuex from 'vuex'
import authentication from '@/store/modules/authentication.store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    authentication
  }
})
