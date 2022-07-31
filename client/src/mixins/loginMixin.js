import loginUserStructure from '../constants/login-user-structure'

export default {
  data: () => ({
    user: loginUserStructure()
  }),
  computed: {
    isValidLoginCredentials () {
      return this.user.identifier && this.user.password
    }
  }
}
