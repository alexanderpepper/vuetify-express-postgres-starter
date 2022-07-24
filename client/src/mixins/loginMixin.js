import UserStructure from '../constants/user-structure'

export default {
  data: () => ({
    user: JSON.parse(JSON.stringify(UserStructure))
  }),
  computed: {
    credentials () {
      const credentialType = this.user.identifier.includes('@') ? 'email' : 'username'
      return {
        [credentialType]: this.user.identifier,
        password: this.user.password
      }
    },
    isValidLoginCredentials () {
      return this.user.identifier && this.user.password
    }
  }
}
