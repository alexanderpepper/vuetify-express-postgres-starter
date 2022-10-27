<template lang="pug">
  .sign-up.pa-md-12.pa-sm-8.pa-xs-0
    v-card.mx-auto.elevation-12(max-width='400', flat)
      v-card-title.headline(v-if='step < steps.done') {{ currentTitle }}
      v-window(v-model='step')
        v-window-item(:value='steps.credentials')
          v-card-text
            user-identifier(
              :user='user'
              :errors='errors'
              @clear-errors='key => errors[key] = []')
            user-birthday(
              :user='user'
              :errors='errors'
              @set-birthday='birthday => (user.birthday = birthday)'
              @clear-errors='errors.birthday = []')
            user-phone(
              :user='user'
              :errors='errors'
              @set-phone='phone => (user.phone = phone)'
              @clear-errors='errors.phone = []')
        v-window-item(:value='steps.password')
          v-card-text
            user-password(
              :user='user'
              :errors='errors'
              @clear-errors='key => errors[key] = []')
        v-window-item(:value='steps.securityQuestions')
          v-card-text
            user-security-questions(
              :user='user'
              :errors='errors'
              @clear-errors='key => errors[key] = []')
        v-window-item(:value='steps.photo')
          v-card-text.text-center
            edit-user-photo(
              :user='user'
              :is-sign-up='true'
              @set-photo='photo => (user.photo = photo)')
        v-window-item(:value='steps.address')
          v-card-text
            user-address(
              :user='user'
              :errors='errors'
              @clear-errors='key => errors[key] = []')
        v-window-item(:value='steps.activate')
          v-card-text
            send-activation-link(:user='user')
        v-window-item(:value='steps.done')
          v-card-text
            activation-link-sent(:user='user')
      v-card-actions(v-if='step < steps.done')
        v-btn(v-if='step > 1', text, @click='step--') Back
        v-spacer
        v-btn(v-if='step < steps.address', outlined, @click='next') Next: {{ nextButtonTitle }}
        v-btn(v-if='step === steps.address', outlined, @click='save')  Next: {{ nextButtonTitle }}
        v-btn(v-if='step === steps.activate', outlined, @click='sendActivationLink')  Next: {{ nextButtonTitle }}
    .create-account.mx-auto.mt-6.text-center(v-if='isCreateAccountNowButtonShown')
      .mx-2
        .caption You've entered all the required information.
        .caption Feel free to skip ahead.
        v-btn(large, block, outlined, @click='save') Create Account Now
</template>

<script>
import UserService from '../services/UserService'
import UserStructure from '../constants/user-structure'
import UserAddress from '../components/UserAddress'
import UserBirthday from '../components/UserBirthday'
import UserIdentifier from '../components/UserIdentifier'
import UserPassword from '../components/UserPassword'
import UserPhone from '../components/UserPhone'
import EditUserPhoto from '../components/EditUserPhoto'
import UserSecurityQuestions from '../components/UserSecurityQuestions'
import SendActivationLink from '../components/SendActivationLink'
import ActivationLinkSent from '../components/ActivationLinkSent'
import EventBus from '@/services/EventBus'

export default {
  name: 'signUp',
  components: {
    ActivationLinkSent,
    SendActivationLink,
    UserAddress,
    UserBirthday,
    UserIdentifier,
    UserPassword,
    UserPhone,
    EditUserPhoto,
    UserSecurityQuestions
  },
  data: () => ({
    user: UserStructure(),
    step: 1,
    steps: {
      credentials: 1,
      password: 2,
      securityQuestions: 3,
      photo: 4,
      address: 5,
      activate: 6,
      done: 7
    },
    errors: {}
  }),
  computed: {
    currentTitle () {
      return {
        [this.steps.credentials]: 'Sign Up',
        [this.steps.password]: 'Create a Password',
        [this.steps.securityQuestions]: 'Security Questions',
        [this.steps.address]: 'Street Address',
        [this.steps.photo]: 'Photo',
        [this.steps.children]: 'Children',
        [this.steps.orientation]: 'Orientation',
        [this.steps.activate]: 'Confirm Email or Phone'
      }[this.step]
    },
    nextButtonTitle () {
      return {
        [this.steps.credentials]: 'Password',
        [this.steps.password]: 'Security Questions',
        [this.steps.securityQuestions]: 'Photo',
        [this.steps.photo]: 'Address',
        [this.steps.address]: 'Activate',
        [this.steps.activate]: 'Send Link'
      }[this.step]
    },
    isCreateAccountNowButtonShown () {
      return this.step > this.steps.securityQuestions &&
        [this.steps.done, this.steps.activate].indexOf(this.step) === -1
    }
  },
  methods: {
    async next () {
      const proceed = () => this.step++
      const stepValidationMap = {
        [this.steps.credentials]: UserService.validateSignUpCredentials.bind(UserService),
        [this.steps.password]: UserService.validateSignUpPassword.bind(UserService),
        [this.steps.securityQuestions]: UserService.validateSignUpSecurityQuestions.bind(UserService)
      }
      const validationFn = stepValidationMap[this.step]
      if (validationFn) {
        validationFn(this.user)
          .then(proceed)
          .catch(({ validationErrors }) => (this.errors = validationErrors))
      } else {
        proceed()
      }
    },
    async save () {
      try {
        await UserService.signUp(this.user)
        this.step = this.steps.activate
      } catch (error) {
        EventBus.$emit('show-snackbar', error, 'error')
      }
    },
    async sendActivationLink () {
      try {
        await UserService.sendActivationLink(this.user)
        this.step++
      } catch (error) {
        EventBus.$emit('show-snackbar', error, 'error')
      }
    }
  }
}
</script>

<style scoped>
  .create-account {
    max-width: 400px;
  }
</style>
