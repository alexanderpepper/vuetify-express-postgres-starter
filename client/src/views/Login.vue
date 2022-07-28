<template lang="pug">
  .login.pa-md-12.pa-sm-8.pa-xs-0
    v-card.mx-auto.elevation-12(max-width='400', :class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-title.headline {{ currentTitle }}
      v-window(v-model='step')
        v-window-item(:value='steps.signIn')
          v-card-text
            form(@submit.prevent='login')
              input(type='text', name='username', style="opacity: 0; position: absolute; pointer-events: none;")
              input(type='email', name='email', style="opacity: 0; position: absolute; pointer-events: none;")
              v-text-field.pt-0(label='Username or Email', v-model='user.identifier', required, autocomplete='off')
              v-text-field(label='Password', v-model='user.password', :type="hidePassword ? 'password' : 'text'", :append-icon="hidePassword ? 'visibility_off' : 'visibility'", @click:append="() => (hidePassword = !hidePassword)", @keyup.enter='login', required, autocomplete='off')
              v-btn.my-6(large, block, outlined, @click='loginClicked', :disabled='!isValidLoginCredentials') Sign In
            v-alert.my-6(type='error' v-model='error', outlined) {{ errorMessage }}
            a.d-block.text-center.mb-4.subtitle-1(href='#', v-if='showResendCode', @click='step = steps.sendActivationLink') Resend my activation link
            a.d-block.text-center.mb-2.subtitle-1(href='#', @click='forgotUsernameOrPassword') Forgot your username or password?
        v-window-item(:value='steps.forgotUsernameOrPassword')
          v-card-text
            v-radio-group.pt-0.mt-0(v-model='forgotUsername', hide-details)
              v-radio(label='Forgot username', :value='true')
              v-radio(label='Forgot password', :value='false')
        v-window-item(:value='steps.forgotUsername')
          v-card-text
            .body-1.mb-6.grey--text.text--darken-1 Please provide your birthday and phone number
            user-phone(:show-placeholder='true' :user='user' @set-phone="phone => (user.phone = phone)")
            user-birthday(:show-placeholder='true', :user='user')
            .text-center
              router-link.subtitle-1(:to='{ name: "support" }') Click here to contact support
        v-window-item(:value='steps.sendUsername')
          v-card-text
            send-username(:user='user', @set-send-via-sms='should => sendViaSms = should')
        v-window-item(:value='steps.usernameSent')
          v-card-text
            username-sent(:user='user', :send-via-sms='sendViaSms')
        v-window-item(:value='steps.forgotPassword')
          v-card-text
            .body-1.mb-6.grey--text.text--darken-1 Please provide all of the following information
            v-text-field(v-model='user.identifier', label='Username or email address')
            user-phone(:show-placeholder='true' :user='user' @set-phone="phone => (user.phone = phone)")
            user-birthday(:show-placeholder='true', :user='user')
        v-window-item(:value='steps.securityQuestions')
          v-card-text
            user-security-answers(:user='user')
        v-window-item(:value='steps.sendPasswordResetLink')
          v-card-text
            send-password-reset-link(:user='user', @set-send-via-sms='should => sendViaSms = should')
        v-window-item(:value='steps.passwordResetLinkSent')
          v-card-text
            password-reset-link-sent(:user='user', :send-via-sms='sendViaSms')
        v-window-item(:value='steps.sendActivationLink')
          v-card-text
            send-activation-link(:user='user', @set-send-via-sms="should => sendViaSms = should")
        v-window-item(:value='steps.activationLinkSent')
          v-card-text
            activation-link-sent(:user='user', :send-via-sms='sendViaSms')
      v-card-actions(v-if='step > steps.signIn')
        v-btn(text, @click='previous') Back
        v-spacer
        v-btn(v-if='showNext', :disabled='!isNextEnabled', outlined, @click='next') Next
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
import UserValidationService from '../services/UserValidationService'
import loginMixin from '../mixins/loginMixin'
import UserBirthday from '../components/UserBirthday'
import UserPhone from '../components/UserPhone'
import { mapActions } from 'vuex'

export default {
  name: 'login',
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
  mixins: [loginMixin],
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
    errorMessage: '',
    hidePassword: true,
    showResendCode: false,
    sendViaSms: false
  }),
  created () {
    this.user = { identifier: null, password: null }
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
    },
    isNextEnabled () {
      if (this.step === this.steps.forgotUsername) {
        return UserValidationService.hasValidPhone(this.user) &&
          UserValidationService.hasValidBirthday(this.user)
      } else if (this.step === this.steps.forgotPassword) {
        return this.user.identifier &&
            UserValidationService.hasValidPhone(this.user) &&
            UserValidationService.hasValidBirthday(this.user)
      } else if (this.step === this.steps.securityQuestions) {
        return UserValidationService.hasValidSecurityQuestions(this.user)
      } else {
        return true
      }
    }
  },
  methods: {
    ...mapActions(['login']),
    previous () {
      if ([this.steps.forgotUsernameOrPassword, this.steps.sendActivationLink].indexOf(this.step) > -1) {
        this.step = this.steps.signIn
      } else if ([this.steps.forgotUsername, this.steps.forgotPassword].indexOf(this.step) > -1) {
        this.step = this.steps.forgotUsernameOrPassword
      } else {
        this.step--
      }
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
    },
    forgotUsernameOrPassword () {
      this.user = { identifier: null, password: null }
      this.step = this.steps.forgotUsernameOrPassword
    },
    async sendActivationLink () {
      try {
        await UserService.sendActivationLink(this.user.email, this.sendViaSms)
        this.step = this.steps.activationLinkSent
      } catch (error) {
        this.$emit('show-snackbar', error, 'error')
      }
    },
    async sendUsername () {
      try {
        await UserService.sendUsername(this.user, this.sendViaSms)
        this.step = this.steps.usernameSent
      } catch (error) {
        this.$emit('show-snackbar', error, 'error')
      }
    },
    async sendPasswordResetLink () {
      try {
        await UserService.sendPasswordResetLink(this.user, this.sendViaSms)
        this.step = this.steps.passwordResetLinkSent
      } catch (error) {
        this.$emit('show-snackbar', error, 'error')
      }
    },
    async getSendOptions () {
      try {
        const results = await UserService.getSendOptions(this.user)
        Object.assign(this.user, results)
        this.step = this.steps.sendUsername
      } catch (error) {
        this.$emit('show-snackbar', error, 'error')
      }
    },
    async getSecurityQuestions () {
      try {
        const results = await UserService.getSecurityQuestions(this.user)
        Object.assign(this.user, results)
        this.step = this.steps.securityQuestions
      } catch (error) {
        this.$emit('show-snackbar', error, 'error')
      }
    },
    async verifySecurityQuestions () {
      try {
        const results = await UserService.verifySecurityQuestions(this.user)
        Object.assign(this.user, results)
        this.step = this.steps.sendPasswordResetLink
      } catch (error) {
        this.$emit('show-snackbar', error, 'error')
      }
    },
    async loginClicked () {
      try {
        await this.login(this.user)
        this.error = false
        this.$router.push({ name: 'landing' })
      } catch (error) {
        this.loginError(error)
      }
    },
    loginError (error) {
      console.log(error)
      this.error = true
      this.errorMessage = error.messages[0]
      this.showResendCode = error.status === 403
    }
  }
}
</script>
