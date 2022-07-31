<template lang="pug">
  .edit-user-photo.text-center
    div(v-if='showCroppa')
      croppa(
        :initial-image='cameraImage'
        :width='200'
        :height='200'
        :prevent-white-space='true'
        v-model='croppa'
        remove-button-color='gray'
        :remove-button-size='20'
        :placeholder-font-size='16'
        placeholder='Choose a photo'
        @new-image-drawn='fileChosen = true'
        @image-remove='fileChosen = false')
      div(v-if='fileChosen')
        .my-2
          v-btn(block, small, outlined, @click='croppa.rotate(1)') Rotate
        .mt-2
          v-btn(block, small, outlined, @click='save') Save
        .mt-2
          v-btn(block, small, text, @click='reset') Cancel
      div(v-else)
        .my-2
          v-btn(block, small, outlined, @click='showCamera = true') Take a Selfie
        .mt-2
          v-dialog(v-model='showGravatarDialog', width='290')
            template(v-slot:activator='{ on }')
              v-btn(block, small, outlined, slot='activator', v-on='on') Use Gravatar
            v-card
              v-card-title.headline Use a Gravatar Photo
              v-card-text
                v-text-field(v-model='gravatarEmail', label='Email', @keydown.enter='getGravatar')
              v-card-actions
                v-spacer
                v-btn(text, @click='showGravatarDialog = false') Cancel
                v-btn(outlined, @click='getGravatar') Get Photo
        .mt-2(v-if='currentUser.photo')
          v-btn(block, small, text, @click='reset') Cancel
    div(v-else)
      .mb-4.edit-user-photo-container.mx-auto(:style='{ "border-color": $vuetify.theme.dark ? "white" : "black" }')
        img.edit-user-photo-img(:src='currentUser.photo' v-if='!showCroppa', @error='imageLoadError')
      v-btn(block, small, outlined, @click='isEditing = true', v-if='!isRegistration') Edit Photo
    .absolute-fill(v-if='showCamera')
      camera(@data-captured='setCameraImage')
</template>

<script>
import UploadButton from '../components/UploadButton'
import UploadService from '../services/UploadService'
import Camera from '../components/Camera'
import GravatarService from '../services/GravatarService'
import UserService from '../services/UserService'
import { mapGetters } from 'vuex'

export default {
  name: 'editUserPhoto',
  components: { UploadButton, Camera },
  props: {
    isRegistration: Boolean
  },
  data: () => ({
    showCamera: false,
    uploadingPhoto: false,
    isEditing: false,
    fileChosen: false,
    cameraImage: null,
    showGravatarDialog: false,
    gravatarEmail: null,
    croppa: {}
  }),
  computed: {
    ...mapGetters(['currentUser']),
    showCroppa () {
      return !this.currentUser.photo || this.isEditing
    }
  },
  watch: {
    currentUser: {
      handler (val) {
        this.gravatarEmail = val.email
      },
      immediate: true
    }
  },
  methods: {
    imageLoadError () {
      this.$emit('set-photo', null)
    },
    async save () {
      this.showCamera = false
      this.uploadingPhoto = true
      const blob = await this.croppa.promisedBlob('image/jpeg', 0.9)
      const photoUrl = await UploadService.uploadFile(blob)
      this.$emit('set-photo', photoUrl)
      if (!this.isRegistration) {
        await UserService.save(this.currentUser)
        this.$emit('show-snackbar', 'Saved')
        this.reset()
      }
    },
    reset () {
      this.uploadingPhoto = false
      this.isEditing = false
      this.cameraImage = null
      this.fileChosen = false
      this.croppa.refresh()
    },
    setCameraImage (base64Data) {
      this.showCamera = false
      this.cameraImage = base64Data
      this.croppa.refresh()
    },
    getGravatar () {
      this.showGravatarDialog = false
      this.cameraImage = GravatarService.getAccountPhotoUrl(this.gravatarEmail)
      this.croppa.refresh()
    }
  }
}
</script>

<style scoped>
  .edit-user-photo-container {
    width: 200px;
    height: 200px;
    overflow: hidden;
    border-radius: 50%;
    border-width: 1px;
    border-style: solid;
    position: relative;
  }

  .edit-user-photo-img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
</style>
