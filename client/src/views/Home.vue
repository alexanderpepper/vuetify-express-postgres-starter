<template lang="pug">
  .home.text-center.mt-12
    .display-1.font-weight-light Home Page
    .subtitle-1.mb-4 Signed in as {{ $store.state.user.name }}
    div
      v-btn(outlined, x-large, router, :to='{ name: "account" }') Edit My Account
</template>

<script>
export default {
  name: 'home',
  props: ['current-user']
}
</script>
