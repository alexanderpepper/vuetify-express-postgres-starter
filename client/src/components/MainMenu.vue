<template lang="pug">
  .main-menu
    v-menu(offset-y, transition='slide-y-transition')
      template(v-slot:activator='{ on }')
        v-btn.ml-2(small, icon, slot='activator', v-on='on')
          user-avatar(size='small', :user='$store.state.user')
      v-list.py-0.main-menu-content(shaped, dense)
        v-list-item(:to='{ name: "home", params: { id: $store.state.user.id } }')
          v-list-item-icon
            user-avatar(size='small', :user='$store.state.user')
          v-list-item-content
            v-list-item-title {{ $store.state.user.name }}
        v-divider
        v-list-item(
          :to='{ name: item.name }',
          v-for='(item, i) in menuItems', :key='i',
          v-show="!item.isAdminOnly || $store.state.user.isAdmin",
          ripple)
          v-list-item-icon
            v-icon(v-html='item.icon')
          v-list-item-content
            v-list-item-title.font-weight-light(v-text='item.title')
        v-list-item(@click='$emit("toggle-theme")')
          v-list-item-icon
            v-icon invert_colors
          v-list-item-content
            v-list-item-title.font-weight-light Switch Themes
        v-divider
        v-list-item(@click='$emit("logout")', ripple)
          v-list-item-icon
            v-icon exit_to_app
          v-list-item-content
            v-list-item-title.font-weight-light Sign Out
</template>

<script>
import UserAvatar from './UserAvatar'

export default {
  name: 'mainMenu',
  components: { UserAvatar },
  data () {
    return {
      menuItems: [
        { icon: 'lock', title: 'Account', name: 'account' },
        { icon: 'people', title: 'Manage Users', name: 'users', isAdminOnly: true },
        { icon: 'help', title: 'Contact Support', name: 'support' }
      ]
    }
  }
}
</script>

<style>
  .main-menu-content .v-list__tile__action {
    min-width: 40px;
  }
</style>
