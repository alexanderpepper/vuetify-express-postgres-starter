<template lang="pug">
  .suggest.pa-md-12.pa-sm-8.pa-xs-0
    v-card.elevation-12(:class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-title.headline.font-weight-light(v-text='success ? "Thanks!" : "How can we help?"')
      v-card-text
        .text-center(v-if='success')
          .subtitle-1.mb-4 We'll get back to you as soon as possible
          v-btn(router-link, :to='{ name: "landing" }') Go Back
        .mx-auto(v-else)
          v-text-field(type='email', label='Email Address', v-model='message.email', required, autocomplete='newEmail')
          v-textarea(v-model='message.body', outlined, counter='500', label='Enter your message here')
          .text-right
            v-btn.mr-2(text, onclick='window.history.back()') Cancel
            v-btn(outlined, @click='submit', :disabled='!isSubmitEnabled') Submit
</template>

<script>
import SupportService from '../services/SupportService'
import { mapGetters } from 'vuex'

export default {
  name: 'support',
  data: () => ({
    success: false,
    message: {
      email: null,
      body: null
    }
  }),
  computed: {
    ...mapGetters(['currentUser']),
    isSubmitEnabled () {
      return this.message.email && this.message.body
    }
  },
  watch: {
    currentUser () {
      this.setEmail()
    }
  },
  created () {
    this.setEmail()
  },
  methods: {
    setEmail () {
      if (this.currentUser) {
        this.message.email = this.currentUser.email
      }
    },
    async submit () {
      await SupportService.sendSupportMessage(this.message)
      this.success = true
    }
  }
}
</script>

<style scoped>
  .suggest {
    max-width: 640px;
  }
</style>
