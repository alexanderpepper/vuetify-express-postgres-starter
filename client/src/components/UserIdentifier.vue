<template lang="pug">
  .user-identifier
    v-text-field(label='Name', v-model='user.name', required, autocomplete='newName')
    v-text-field(label='Username', v-model='user.username', required, autocomplete='newUsername')
    v-text-field(type='email', label='Email Address', v-model='user.email', required, autocomplete='newEmail')
</template>

<script>
export default {
  name: 'userIdentifier',
  props: {
    user: Object
  }
}
</script>
