<template lang="pug">
  .users.pa-md-12.pa-sm-8.pa-xs-0.max-width-800
    v-card.elevation-12(:class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-text
        v-layout.mb-4(align-center)
          .headline.mr-2 Users
          v-btn(small, outlined, :router='true', :to='{name: "user"}') New
          v-spacer
          v-text-field.pt-0.ml-2(append-icon='search', label='Search', single-line, hide-details, v-model='search')
        v-data-table.hidden-xs-only(:headers='headers', :items='users', :search='search', sort-by='id')
          template(slot='item', slot-scope='props')
            tr.cursor-pointer(@click='edit(props.item)')
              td {{ props.item.username }}
              td {{ props.item.email }}
              td {{ props.item.roles }}
        v-divider.hidden-sm-and-up
        v-data-iterator.hidden-sm-and-up(:items='users', :search='search', sort-by='id')
          template(v-slot:item='props')
            .d-flex.pa-2.cursor-pointer.data-iterator-list-item(@click='edit(props.item)', v-ripple='{ class: "black--text" }')
              .flex-grow-1
                .subtitle-1.grey--text.text--darken-3 {{ props.item.username }}
                .body-1 {{ props.item.email }}
              .align-self-center(v-if="props.item.roles !== 'None'")
                v-chip(v-for='(role, index) in props.item.roles.split(", ")', :key='index') {{ role }}
            v-divider
</template>

<script>
import UserService from '../services/UserService'
import RoleService from '../services/RoleService'

export default {
  name: 'users',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Roles', value: 'roles', align: 'left' }],
      users: [],
      roles: []
    }
  },
  async created () {
    this.$emit('set-active-menu-item', 'users')
    this.getUsers()
    this.getRoles()
  },
  methods: {
    edit (user) {
      this.$router.push({ name: 'user', params: { id: user.id } })
    },
    async getRoles () {
      this.roles = await RoleService.all()
      this.roles = this.roles.map(role => {
        role.text = this.$options.filters.capitalize(role.name)
        return role
      })
      this.roles.unshift({ text: 'None', id: null })
    },
    async getUsers () {
      this.users = await UserService.all()
      this.users = this.users.map(user => {
        if (user.roleMappings && user.roleMappings.length) {
          user.roles = user.roleMappings
            .filter(roleMapping => roleMapping.role.name !== 'registered')
            .map(roleMapping => this.$options.filters.capitalize(roleMapping.role.name))
            .join(', ')
        } else {
          user.roles = 'None'
        }
        return user
      })
    }
  }
}
</script>

<style scoped>
  .users {
    max-width: 800px;
  }
</style>
