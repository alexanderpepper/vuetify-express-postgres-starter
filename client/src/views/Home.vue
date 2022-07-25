<template lang="pug">
  .home.text-center.mt-12
    .display-1.font-weight-light Home Page
    .subtitle-1.mb-4 Signed in as {{ currentUser.name }}
    div
      v-btn(outlined, x-large, router, :to='{ name: "account" }') Edit My Account
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  computed: mapGetters(['currentUser'])
}
</script>
