<template lang="pug">
  .user.pa-md-12.pa-sm-8.pa-xs-0.max-width-800
    v-card.elevation-12(:class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-text
        v-layout.mb-4(wrap, align-center)
          .d-flex.headline
            span.font-weight-light {{ title }}
            v-icon.align-self-center chevron_right
            span.font-weight-thin(v-text='tabTitles[activeTab]')
          v-spacer
          v-btn.hidden-xs-only.mr-2(text, onclick="window.history.back()") Back
          v-btn(outlined, @click='save', :disabled='!isValid') Save
        v-tabs(:vertical="$vuetify.breakpoint.smAndUp", v-model='activeTab')
          v-tab(ripple, v-for='tabTitle in tabTitles', :key='tabTitle') {{ tabTitle }}
          v-tab-item
            v-card(flat)
              v-card-text.pt-sm-0
                user-identifier(:user='user')
                user-birthday(:user='user')
                user-phone(:user='user')
                user-password(v-if='!user.id', :user='user')
                div(v-if='!isAccount && $store.state.user.isAdmin')
                  .caption.grey--text.text--darken-1 Roles
                  v-chip.mr-2(
                    :active.sync='role.enabled',
                    v-for='(role, index) in user.roles',
                    :key='index',
                    :class='{"ml-0": index === 0 }',
                    close,
                    @update:active='removeRole') {{ role.name | capitalize }}
                  v-menu(offset-y, right, v-show='availableRoles.length')
                    template(v-slot:activator='{ on }')
                      v-btn.ml-0(v-on='on', outlined, small, slot='activator', v-show='availableRoles.length') Add
                    v-list
                      v-list-item(@click='addRole(role)', v-for='(role, index) in availableRoles', :key='index')
                        v-list-item-title {{ role.name | capitalize }}
                  v-checkbox(label='Activated', v-model='user.isActivated')
                  v-dialog(v-show='user.id && !isAccount && $store.state.user.isAdmin', v-model='showDeleteDialog', width='300')
                    template(v-slot:activator='{ on }')
                      v-btn.mx-0(v-on='on', small, outlined, slot='activator') Delete User
                    v-card
                      v-card-title.headline Delete this user?
                      v-card-text Are you sure you want to delete this user? This action cannot be undone.
                      v-card-actions
                        v-spacer
                        v-btn(text, @click='showDeleteDialog = false') Cancel
                        v-btn(outlined, @click='deleteUser') Delete
          v-tab-item
            v-card(flat)
              v-card-text.pt-sm-0
                user-security-questions(:user='user')
                .mt-6(v-if='isAccount')
                  v-btn(block, outlined, :router='true', :to='{ name: "password" }') Change Password
          v-tab-item
            v-card(flat)
              v-card-text.pt-sm-0
                edit-user-photo.mb-6.mx-auto.mw-edit-user-photo(:user='user')
          v-tab-item
            v-card(flat)
              v-card-text.pt-sm-0
                user-address(:user='user')
</template>

<script>
import UserService from '../services/UserService'
import RoleService from '../services/RoleService'
import UserStructure from '../constants/user-structure'
import UserAddress from '../components/UserAddress'
import UserIdentifier from '../components/UserIdentifier'
import UserPassword from '../components/UserPassword'
import UserPhone from '../components/UserPhone'
import UserPhoto from '../components/UserPhoto'
import UserSecurityQuestions from '../components/UserSecurityQuestions'
import UserValidationService from '../services/UserValidationService'
import UserBirthday from '../components/UserBirthday'
import EditUserPhoto from '../components/EditUserPhoto'

export default {
  name: 'user',
  props: ['id'],
  components: {
    EditUserPhoto,
    UserAddress,
    UserBirthday,
    UserIdentifier,
    UserPassword,
    UserPhone,
    UserPhoto,
    UserSecurityQuestions
  },
  data () {
    return {
      tabTitles: [
        'General',
        'Security',
        'Photo',
        'Address'
      ],
      activeTab: 0,
      showDeleteDialog: false,
      title: '',
      roles: [],
      user: JSON.parse(JSON.stringify(UserStructure)),
      oldRoles: []
    }
  },
  async created () {
    try {
      this.roles = await RoleService.all()
    } catch (error) {
      this.roles = []
    }

    await this.initialize()
  },
  watch: {
    $route: {
      handler () {
        this.initialize()
      }
    }
  },
  computed: {
    availableRoles () {
      if (this.user.roles) {
        const assignedRoleIds = this.user.roles.map(role => role.id)
        return this.roles.filter(role => {
          return !assignedRoleIds.includes(role.id)
        })
      } else {
        return []
      }
    },
    isAccount () {
      return this.$route.name === 'account'
    },
    isValid () {
      return UserValidationService.hasValidPrimaryCredentials(this.user) &&
        UserValidationService.hasValidBirthday(this.user) &&
        UserValidationService.hasValidSecurityQuestions(this.user) &&
        UserValidationService.hasValidSecondaryIdentifier(this.user)
    }
  },
  methods: {
    async initialize () {
      if (this.isAccount) {
        UserService.account().then(user => {
          this.user = user
        })
      } else if (this.id) {
        UserService.get(this.id).then(user => {
          this.user = user
          this.oldRoles = JSON.parse(JSON.stringify(user.roles))
        })
      }
      this.title = this.isAccount ? 'Account' : (this.id ? 'Edit User' : 'New User')
    },
    async save () {
      if (this.isValid) {
        try {
          const response = this.isAccount
            ? await UserService.saveAccount(this.user)
            : await UserService.save(this.user)
          if (response.id !== this.user.id) {
            this.$router.push({ name: 'user', params: { id: response.id } })
          }
          this.$emit('show-snackbar', 'Saved')
        } catch (error) {
          this.$emit('show-snackbar', error, 'error')
        }
      }
    },
    updateRoles () {
      const promises = []
      const currentRoleIds = this.user.roles.map(role => role.id)
      const oldRoleIds = this.oldRoles.map(role => role.id)
      this.oldRoles.forEach(role => {
        if (!currentRoleIds.includes(role.id)) {
          promises.push(RoleService.removeRole(role))
        }
      })
      this.user.roles.forEach(role => {
        if (!oldRoleIds.includes(role.id)) {
          promises.push(RoleService.addRole(this.user, role.role))
        }
      })
      return Promise.all(promises)
    },
    addRole (role) {
      this.user.roles.push(role)
    },
    removeRole () {
      this.user.roles = this.user.roles.filter(role => role.enabled !== false)
    },
    async deleteUser () {
      await UserService.remove(this.user)
      this.$router.push({ name: 'users' })
    }
  }
}
</script>

<style scoped>
  .avatar img {
    width: 100%;
  }

  .user {
    max-width: 800px;
  }

  .data-iterator-list-item:hover {
    background-color: #eee;
  }

  @media screen and (max-width: 600px) {
    .px-xs-0 {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }

</style>

<style>
  .v-tabs-bar.v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-tabs-bar--show-arrows):not(.v-slide-group--has-affixes) .v-slide-group__prev {
    display: none !important;
  }
  .mw-edit-user-photo {
    max-width: 200px;
  }
</style>
