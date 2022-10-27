<template lang="pug">
  .quick-sign-in
    v-text-field.sign-in-field.d-inline-block.pt-0.mr-4(
      height='32'
      placeholder='Username'
      v-model='user.username'
      required
      hide-details
      autocomplete='off'
      @keyup.enter='signInClicked')
    v-text-field.sign-in-field.d-inline-block.pt-0.mr-4(
      height='32'
      placeholder='Password'
      v-model='user.password'
      type='password'
      @keyup.enter='signInClicked'
      hide-details
      required
      autocomplete='off')
    v-btn.d-inline-block(outlined, small, @click='signInClicked') Sign In
</template>

<script>
import signInMixin from '../mixins/signInMixin'
import { mapActions } from 'vuex'

export default {
  name: 'quickSignIn',
  mixins: [signInMixin],
  methods: {
    ...mapActions(['signIn']),
    async signInClicked () {
      try {
        await this.signIn(this.user)
        this.$router.push({ name: 'home' })
      } catch (error) {
        if (this.$route.name !== 'landing') {
          await this.$router.push({ name: 'landing' })
        }
      }
    }
  }
}
</script>

<style scoped>
  .sign-in-field {
    width: 150px
  }
</style>
