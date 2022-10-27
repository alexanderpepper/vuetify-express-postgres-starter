import authenticationUserStructure from '../constants/authentication-user-structure'

export default {
  data: () => ({
    user: authenticationUserStructure()
  }),
  computed: {
    isValidSignInCredentials () {
      return this.user.username && this.user.password
    }
  }
}
