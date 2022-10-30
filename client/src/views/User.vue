..<template lang="pug">
  .user.pa-md-12.pa-sm-8.pa-xs-0.max-width-800
    v-card.elevation-12(:class='{ "elevation-0": $vuetify.breakpoint.xsOnly }')
      v-card-text
        .d-flex.flex-wrap.mb-4
          .d-flex.headline
            span.font-weight-light(v-text='title')
            v-icon.align-self-center chevron_right
            span.font-weight-thin(v-text='tabTitles[activeTab]')
          v-spacer
          v-btn.hidden-xs-only.mr-2(text, onclick='window.history.back()') Back
          v-btn(outlined, @click='save') Save
        v-tabs(:vertical='$vuetify.breakpoint.smAndUp', v-model='activeTab')
          v-tab(ripple, v-for='tabTitle in tabTitles', :key='tabTitle') {{ tabTitle }}
          v-tab-item
            v-card(flat)
              v-card-text.pt-sm-0
                user-identifier(
                  :user='user',
                  :errors='errors',
                  @clear-errors='key => errors[key] = []')
                user-birthday(
                  :user='user',
                  :errors='errors',
                  @set-birthday='birthday => (user.birthday = birthday)',
                  @clear-errors='key => errors[key] = []')
                user-phone(
                  :user='user',
                  :errors='errors',
                  @set-phone='phone => (user.phone = phone)',
                  @clear-errors='errors.phone = []')
                user-password(
                  v-if='!user.id',
                  :user='user',
                  :errors='errors',
                  @clear-errors='key => errors[key] = []')
                div(v-if='!isAccount && currentUser.isAdmin')
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
                  v-dialog(v-show='user.id && !isAccount && currentUser.isAdmin', v-model='showDeleteDialog', width='300')
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
                user-security-questions(
                  :user='user',
                  :errors='errors',
                  @clear-errors='key => errors[key] = []')
                .mt-6(v-if='isAccount')
                  v-btn(block, outlined, :router='true', :to='{ name: "password" }') Change Password
          v-tab-item
            v-card(flat)
              v-card-text.pt-sm-0
                edit-user-photo.mb-6.mx-auto.mw-edit-user-photo(:user='user' @set-photo='photo => (user.photo = photo)')
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
import UserSecurityQuestions from '../components/UserSecurityQuestions'
import UserBirthday from '../components/UserBirthday'
import EditUserPhoto from '../components/EditUserPhoto'
import { mapGetters } from 'vuex'
import EventBus from '@/services/EventBus'

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
    UserSecurityQuestions
  },
  data: () => ({
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
    user: UserStructure(),
    oldRoles: [],
    errors: {}
  }),
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
    ...mapGetters(['currentUser']),
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
      try {
        const response = this.isAccount
          ? await UserService.saveAccount(this.user)
          : await UserService.save(this.user)
        if (!this.isAccount && response.id !== this.user.id) {
          this.$router.push({ name: 'user', params: { id: response.id } })
        }
        EventBus.$emit('show-snackbar', 'Saved')
      } catch (error) {
        console.log(error)
        EventBus.$emit('show-snackbar', error, 'error')
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
