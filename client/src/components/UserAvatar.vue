<template lang="pug">
  .user-avatar-container.text-center.w-100(:class='[size, display]')
    v-icon.mx-auto(v-if='!user || !user.photo', :size='size === "large" ? 182 : 24') account_circle
    img.mx-auto.user-avatar(:src='user.photo' v-if='user && user.photo', :class='[size, display, { "elevation-8": size === "large" }]')
</template>

<script>
export default {
  name: 'userAvatar',
  props: {
    user: Object,
    size: String,
    display: String
  }
}
</script>

<style scoped>
  .user-avatar {
    border-radius: 50%;
    display: table-cell;
    vertical-align: middle;
    border: 1px solid black;
  }
  .user-avatar.large {
    max-width: 180px;
    max-height: 180px;
  }
  .user-avatar.small {
    max-width: 20px;
    max-height: 20px;
  }
  .user-avatar-container {
    display: table;
  }
</style>
