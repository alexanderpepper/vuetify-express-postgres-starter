<template lang="pug">
  .suggest.pa-md-12.pa-sm-8.pa-xs-0
    v-card(:class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-title.headline.font-weight-light(v-text='success ? "Thanks!" : "How can we help?"')
      v-card-text
        .text-center(v-if='success')
          .subtitle-1.mb-4 We'll get back to you as soon as possible
          v-btn(router-link, :to='{ name: "landing" }') Go Back
        .mx-auto(v-else)
          v-text-field(
            outlined,
            dense,
            type='email',
            label='Email Address',
            v-model='message.email',
            required,
            autocomplete='supportEmail',
            :error-messages='errors.email'
            @input='errors.email = []')
          v-textarea(
            dense,
            label='Enter your message here',
            v-model='message.body',
            outlined,
            counter='1000',
            :error-messages='errors.body'
            @input='errors.body = []')
          .text-right
            v-btn.mr-2(text, onclick='window.history.back()') Cancel
            v-btn(outlined, @click='submit') Submit
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
    },
    errors: {}
  }),
  computed: {
    ...mapGetters(['currentUser'])
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
      try {
        await SupportService.sendSupportMessage(this.message)
        this.success = true
      } catch ({ validationErrors }) {
        this.errors = validationErrors
      }
    }
  }
}
</script>

<style scoped>
  .suggest {
    max-width: 640px;
  }
</style>
