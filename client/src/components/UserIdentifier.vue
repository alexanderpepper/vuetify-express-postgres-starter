<template lang="pug">
  .user-identifier
    v-text-field(label='Name' v-model='user.name' ref='autofocusField' required autocomplete='newName' :error-messages='errors.name')
    v-text-field(label='Username' v-model='user.username' required autocomplete='newUsername' :error-messages='errors.username')
    v-text-field(type='email' label='Email Address' v-model='user.email' required autocomplete='newEmail' :error-messages='errors.email')
</template>

<script>
import autofocusFieldMixin from '@/mixins/autofocusFieldMixin'

export default {
  name: 'userIdentifier',
  mixins: [autofocusFieldMixin],
  props: {
    user: Object,
    errors: Object
  },

  watch: {
    'user.name' () {
      this.$emit('clear-errors', 'name')
    },
    'user.username' () {
      this.$emit('clear-errors', 'username')
    },
    'user.email' () {
      this.$emit('clear-errors', 'email')
    }
  }
}
</script>
