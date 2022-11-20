<template lang="pug">
  .sign-in.pa-md-12.pa-sm-8.pa-xs-0
    v-card.mx-auto.elevation-12(max-width='400' :class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-title.headline(v-text='currentTitle')
      v-window(v-model='step')
        v-window-item(:value='steps.signIn')
          v-card-text
            form(@submit.prevent='signIn')
              input(type='text' name='username' style='opacity: 0; position: absolute; pointer-events: none;')
              input(type='email' name='email' style='opacity: 0; position: absolute; pointer-events: none;')
              v-text-field.pt-0(
                required,
                label='Username',
                v-model='user.username',
                autocomplete='signInUsername',
                ref='autofocusField1',
                :error-messages='errors.username',
                @input='errors.username = []',
                @keyup.enter='signInClicked')
              v-text-field(
                required,
                autocomplete='signInPassword'
                label='Password',
                v-model='user.password',
                :type='hidePassword ? "password" : "text"',
                :append-icon='hidePassword ? "visibility_off" : "visibility"',
                :error-messages='errors.password'
                @input='errors.password = []'
                @click:append='() => (hidePassword = !hidePassword)',
                @keyup.enter='signInClicked')
              v-btn.my-6(large, block, outlined, @click='signInClicked') Sign In
            v-alert.my-6(type='error' v-model='error' outlined)
              div(v-for='(error, index) in errorMessages' :key='index' v-text='error')
            a.d-block.text-center.mb-4.subtitle-1(href='#' v-if='showResendCode' @click='step = steps.sendActivationLink') Resend my activation link
            a.d-block.text-center.mb-2.subtitle-1(href='#' @click='forgotUsernameOrPassword') Forgot your username or password?
        v-window-item(:value='steps.forgotUsernameOrPassword')
          v-card-text
            v-radio-group.pt-0.mt-0(v-model='forgotUsername' hide-details)
              v-radio(label='Forgot username' :value='true')
              v-radio(label='Forgot password' :value='false')
        v-window-item(:value='steps.forgotUsername')
          v-card-text
            .body-1.mb-6.grey--text.text--darken-1 Please provide your birthday and phone number
            user-phone(
              :show-placeholder='true'
              :user='user'
              :errors='errors'
              @clear-errors='errors.phone = []'
              @set-phone='phone => (user.phone = phone)'
              ref='autofocusField3')
            user-birthday(
              :show-placeholder='true'
              :user='user'
              :errors='errors'
              @set-birthday='birthday => (user.birthday = birthday)',
              @clear-errors='errors.birthday = []')
            .text-center.mt-2
              router-link.subtitle-1(:to='{ name: "support" }') Contact support
        v-window-item(:value='steps.sendUsername')
          v-card-text
            send-username(:user='user')
        v-window-item(:value='steps.usernameSent')
          v-card-text
            username-sent(:user='user')
        v-window-item(:value='steps.forgotPassword')
          v-card-text
            .body-1.mb-6.grey--text.text--darken-1 Please provide all of the following information
            v-text-field(
              v-model='user.username',
              label='Username',
              :error-messages='errors.username'
              @input='errors.username = []'
              ref='autofocusField6')
            user-phone(
              :show-placeholder='true',
              :user='user',
              @set-phone='phone => (user.phone = phone)')
            user-birthday(
              :show-placeholder='true'
              :user='user'
              :errors='errors'
              @set-birthday='birthday => (user.birthday = birthday)',
              @clear-errors='errors.birthday = []')
        v-window-item(:value='steps.securityQuestions')
          v-card-text
            user-security-answers(
              :user='user'
              :errors='errors'
              @clear-errors='key => errors[key] = []')
        v-window-item(:value='steps.sendPasswordResetLink')
          v-card-text
            send-password-reset-link(:user='user')
        v-window-item(:value='steps.passwordResetLinkSent')
          v-card-text
            password-reset-link-sent(:user='user')
        v-window-item(:value='steps.sendActivationLink')
          v-card-text
            send-activation-link(:user='user')
        v-window-item(:value='steps.activationLinkSent')
          v-card-text
            activation-link-sent(:user='user')
      v-card-actions(v-if='step > steps.signIn')
        v-btn(text, @click='previous') Back
        v-spacer
        v-btn(v-if='showNext', outlined, @click='next') Next
        v-btn(v-if='!showNext', outlined, @click='step = steps.signIn') Sign In
</template>

<script>
import UserService from '../services/UserService'
import SendActivationLink from '../components/SendActivationLink'
import SendPasswordResetLink from '../components/SendPasswordResetLink'
import SendUsername from '../components/SendUsername'
import ActivationLinkSent from '../components/ActivationLinkSent'
import PasswordResetLinkSent from '../components/PasswordResetLinkSent'
import UsernameSent from '../components/UsernameSent'
import UserSecurityAnswers from '../components/UserSecurityAnswers'
import signInMixin from '../mixins/signInMixin'
import UserBirthday from '../components/UserBirthday'
import UserPhone from '../components/UserPhone'
import { mapActions } from 'vuex'
import EventBus from '@/services/EventBus'
import authenticationUserStructure from '../constants/authentication-user-structure'

export default {
  name: 'signIn',
  components: {
    UserPhone,
    UserBirthday,
    UserSecurityAnswers,
    UsernameSent,
    PasswordResetLinkSent,
    ActivationLinkSent,
    SendUsername,
    SendPasswordResetLink,
    SendActivationLink
  },
  mixins: [signInMixin],
  data: () => ({
    forgotUsername: true,
    step: 1,
    steps: {
      signIn: 1,
      forgotUsernameOrPassword: 2,
      forgotUsername: 3,
      sendUsername: 4,
      usernameSent: 5,
      forgotPassword: 6,
      securityQuestions: 7,
      sendPasswordResetLink: 8,
      passwordResetLinkSent: 9,
      sendActivationLink: 10,
      activationLinkSent: 11
    },
    error: false,
    errors: {},
    errorMessages: [],
    hidePassword: true,
    showResendCode: false
  }),
  created () {
    this.user = authenticationUserStructure()
    EventBus.$on('sign-in-error', this.signInError)
  },
  mounted () {
    this.autofocusFieldForCurrentStep()
  },
  computed: {
    showNext () {
      return [
        this.steps.passwordResetLinkSent,
        this.steps.activationLinkSent,
        this.steps.usernameSent
      ].indexOf(this.step) === -1
    },
    currentTitle () {
      switch (this.step) {
        case this.steps.signIn: return 'Sign In'
        case this.steps.forgotUsernameOrPassword: return 'Forgot Username or Password'
        case this.steps.forgotUsername: return 'Forgot Username'
        case this.steps.forgotPassword: return 'Forgot Password'
        case this.steps.securityQuestions: return 'Security Questions'
        case this.steps.sendPasswordResetLink: return 'Send Password Reset Link'
        case this.steps.passwordResetLinkSent: return 'Password Reset Link Sent'
        case this.steps.sendUsername: return 'Send Username'
        case this.steps.usernameSent: return 'Username Sent'
        case this.steps.sendActivationLink: return 'Send Activation Link'
        case this.steps.activationLinkSent: return 'Activation Link Sent'
        default: return ''
      }
    }
  },
  methods: {
    ...mapActions(['signIn']),
    previous () {
      if ([this.steps.forgotUsernameOrPassword, this.steps.sendActivationLink].indexOf(this.step) > -1) {
        this.step = this.steps.signIn
      } else if ([this.steps.forgotUsername, this.steps.forgotPassword].indexOf(this.step) > -1) {
        this.step = this.steps.forgotUsernameOrPassword
      } else {
        this.step--
      }
      this.autofocusFieldForCurrentStep()
    },
    next () {
      if (this.step === this.steps.forgotUsernameOrPassword) {
        if (this.forgotUsername) {
          this.step = this.steps.forgotUsername
        } else {
          this.step = this.steps.forgotPassword
        }
      } else if (this.step === this.steps.sendActivationLink) {
        this.sendActivationLink()
      } else if (this.step === this.steps.forgotUsername) {
        this.getSendOptions()
      } else if (this.step === this.steps.sendUsername) {
        this.sendUsername()
      } else if (this.step === this.steps.forgotPassword) {
        this.getSecurityQuestions()
      } else if (this.step === this.steps.securityQuestions) {
        this.verifySecurityQuestions()
      } else if (this.step === this.steps.sendPasswordResetLink) {
        this.sendPasswordResetLink()
      } else {
        this.step++
      }
      this.autofocusFieldForCurrentStep()
    },
    autofocusFieldForCurrentStep () {
      this.$nextTick(() => {
        setTimeout(() => {
          const autofocusField = this.$refs[`autofocusField${this.step}`]
          if (autofocusField) {
            let input = autofocusField.$refs.input
            if (input) {
              if (input && input.$refs) {
                input = input.$refs.input
              }
            }
            input.focus()
          }
        })
      })
    },
    forgotUsernameOrPassword () {
      this.user = authenticationUserStructure()
      this.step = this.steps.forgotUsernameOrPassword
    },
    async sendActivationLink () {
      await UserService.sendActivationLink(this.user)
      this.step = this.steps.activationLinkSent
    },
    async sendUsername () {
      await UserService.sendUsername(this.user)
      this.step = this.steps.usernameSent
    },
    async sendPasswordResetLink () {
      await UserService.sendPasswordResetLink(this.user)
      this.step = this.steps.passwordResetLinkSent
    },
    async getSendOptions () {
      try {
        const results = await UserService.getSendOptions(this.user)
        Object.assign(this.user, results)
        this.step = this.steps.sendUsername
      } catch ({ validationErrors }) {
        this.errors = validationErrors
      }
    },
    async getSecurityQuestions () {
      try {
        const results = await UserService.getSecurityQuestions(this.user)
        Object.assign(this.user, results)
        this.step = this.steps.securityQuestions
      } catch ({ validationErrors }) {
        this.errors = validationErrors
      }
    },
    async verifySecurityQuestions () {
      try {
        const results = await UserService.verifySecurityQuestions(this.user)
        Object.assign(this.user, results)
        this.step = this.steps.sendPasswordResetLink
      } catch ({ validationErrors }) {
        this.errors = validationErrors
      }
    },
    async signInClicked () {
      try {
        await this.signIn(this.user)
        this.error = false
        this.$router.push({ name: 'home' })
      } catch (error) {
        this.signInError(error)
      }
    },
    signInError (error) {
      this.error = true
      this.errors = error.validationErrors || {}
      this.errorMessages = error.messages || ['Unknown error occurred']
      if (error.status === 403) {
        this.showResendCode = true
        Object.assign(this.user, error.user)
      } else {
        this.showResendCode = false
      }
    }
  }
}
</script>
