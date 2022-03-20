import LoginService from '../services/LoginService'
import UserService from '../services/UserService'
import UserStructure from '../constants/user-structure'
import EventBus from '../services/EventBus'

export default {
  data: () => ({
    user: JSON.parse(JSON.stringify(UserStructure))
  }),
  computed: {
    credentials () {
      const credentialType = this.user.identifier.indexOf('@') > -1 ? 'email' : 'username'
      return {
        [credentialType]: this.user.identifier,
        password: this.user.password
      }
    },
    isValidLoginCredentials () {
      return this.user.identifier && this.user.password
    }
  },
  methods: {
    async login () {
      if (this.user.identifier && this.user.password) {
        try {
          await LoginService.login(this.credentials)
          const user = await UserService.me()
          this.loginSuccess()
          this.$emit('login-success', user)
          EventBus.$emit('login-success', user)
        } catch (error) {
          this.loginError(error)
          this.$emit('login-error', error)
          EventBus.$emit('login-error', error)
        }
      } else {
        EventBus.$emit('show-login')
      }
    },
    // eslint-disable-next-line
    loginSuccess () {},
    // eslint-disable-next-line
    loginError (error) {}
  }
}
