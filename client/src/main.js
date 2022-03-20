import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import './registerServiceWorker'
import 'vue-croppa/dist/vue-croppa.css'
import './global.css'
import Croppa from 'vue-croppa'

Vue.use(Croppa)

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  return value.split([' ']).map(c => { return c[0].toUpperCase() + c.slice(1) }).join(' ')
})

Vue.filter('shortDate', function (value) {
  if (!value) return ''
  const parts = value.substr(0, 10).split('-')
  return [parts[1], parts[2], parts[0]].join('/')
})

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
