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
          v-tab(ripple, v-for='tabTitle in tabTitles', :key='tabTitle' )
            span(:class='{ "error--text" : tabErrors[tabTitle] }') {{ tabTitle }}
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
                  @clear-errors='errors.birthday = []')
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
                  .d-flex
                    v-checkbox.mr-6(label='Activated', v-model='user.isActivated')
                    v-checkbox(label='Locked', v-model='user.isLocked', disabled)
                  v-dialog(v-model='showDeleteDialog', width='300')
                    template(v-slot:activator='{ on }')
                      v-btn(v-on='on', small, outlined, slot='activator', v-show='user.id && !isAccount && currentUser.isAdmin') Delete User
                    v-card
                      v-card-title.headline Delete this user?
                      v-card-text Are you sure you want to delete this user? This action cannot be undone.
                      v-card-actions
                        v-spacer
                        v-btn(text, @click='showDeleteDialog = false') Cancel
                        v-btn(outlined, @click='deleteUser') Delete
                  v-menu(offset-y, right, v-show='availableRoles.length')
                    template(v-slot:activator='{ on }')
                      v-btn.ml-2(v-on='on', outlined, small, slot='activator', v-show='availableRoles.length') Send Password Reset Link
                    v-list(dense)
                      v-list-item(@click='sendPasswordResetLink(false)')
                        v-list-item-title Send Link in Email
                      v-list-item(@click='sendPasswordResetLink(true)')
                        v-list-item-title Send Link in Text Message
                  v-btn.ml-2(small, outlined, v-if='user.isLocked', @click='setLocked(false)') Unlock User
                  v-btn.ml-2(small, outlined, v-if='!user.isLocked', @click='setLocked(true)') Lock User
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
    tabs: {
      general: 'General',
      security: 'Security',
      photo: 'Photo',
      address: 'Address'
    },
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
    if (!this.isAccount) {
      await this.getRoles()
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
    tabErrors () {
      const tabErrors = {}
      const hasErrors = keys => keys.find(key => this.errors[key] && this.errors[key].length)
      if (hasErrors(['username', 'email', 'name', 'birthday', 'phone', 'password'])) {
        tabErrors[this.tabs.general] = true
      }
      if (hasErrors(['securityQuestion1', 'securityQuestion2', 'securityAnswer1', 'securityAnswer2'])) {
        tabErrors[this.tabs.security] = true
      }
      return tabErrors
    },
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
    async getRoles () {
      try {
        this.roles = await RoleService.all()
      } catch (error) {
        this.roles = []
      }
    },
    async initialize () {
      this.errors = {}
      if (this.isAccount) {
        this.user = await UserService.account()
      } else if (this.id) {
        this.user = await UserService.get(this.id)
        this.oldRoles = this.user.roles
          ? JSON.parse(JSON.stringify(this.user.roles))
          : []
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
        EventBus.$emit('show-success-snackbar', 'User saved successfully')
      } catch ({ validationErrors }) {
        this.errors = validationErrors
      }
    },
    addRole (role) {
      this.user.roles.push(role)
    },
    removeRole () {
      this.user.roles = this.user.roles.filter(role => role.enabled !== false)
    },
    async deleteUser () {
      this.showDeleteDialog = false
      const response = await UserService.remove(this.user)
      EventBus.$emit('show-success-snackbar', response)
      this.$router.push({ name: 'users' })
    },
    async sendPasswordResetLink (sendViaSms) {
      const response = await UserService.sendPasswordResetLink({ ...this.user, sendViaSms })
      EventBus.$emit('show-success-snackbar', response)
    },
    async setLocked (isLocked) {
      const response = await UserService.lockUser(this.user, isLocked)
      await this.initialize()
      EventBus.$emit('show-success-snackbar', response)
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
