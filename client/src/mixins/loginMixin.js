export default {
  data: () => ({
    user: { identifier: null, password: null }
  }),
  computed: {
    isValidLoginCredentials () {
      return this.user.identifier && this.user.password
    }
  }
}
