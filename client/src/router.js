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

const routes = [
  {
    path: '/',
    name: Landing.name,
    component: Landing
  },
  {
    path: '/home',
    name: Home.name,
    component: Home
  },
  {
    path: '/user/:id?',
    name: User.name,
    component: User,
    props: true
  },
  {
    path: '/users',
    name: Users.name,
    component: Users
  },
  {
    path: '/account',
    name: 'account',
    component: User
  },
  {
    path: '/password',
    name: Password.name,
    component: Password
  },
  {
    path: '/activate/:activationCode',
    name: Activate.name,
    component: Activate,
    props: true
  },
  {
    path: '/reset-password/:passwordResetCode',
    name: ResetPassword.name,
    component: ResetPassword,
    props: true
  },
  {
    path: '/support',
    name: Support.name,
    component: Support
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const guardRoute = (to, next) => {
  next()
}

router.beforeEach((to, from, next) => guardRoute(to, next))
