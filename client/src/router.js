import Vue from 'vue'
import Router from 'vue-router'
import User from './views/User'
import Users from './views/Users'
import Password from './views/Password'
import Activate from './views/Activate'
import ResetPassword from './views/ResetPassword'
import Support from './views/Support'
import Landing from './views/Landing'
import Home from './views/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/user/:id?',
      name: 'user',
      component: User,
      props: true
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/account',
      name: 'account',
      component: User
    },
    {
      path: '/password',
      name: 'password',
      component: Password
    },
    {
      path: '/activate/:activationCode',
      name: 'activate',
      component: Activate,
      props: true
    },
    {
      path: '/reset-password/:passwordResetCode',
      name: 'resetPassword',
      component: ResetPassword,
      props: true
    },
    {
      path: '/support',
      name: 'support',
      component: Support
    }
  ]
})
