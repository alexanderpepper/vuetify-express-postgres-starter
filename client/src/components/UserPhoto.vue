<template lang="pug">
  .user-photo.mx-auto
    v-layout(wrap, align-center)
      v-flex(sm6, xs12)
        .text-sm-right.text-center
          v-icon(v-if='!user.photo', :size='180') account_circle
          img.user-photo-img(:src='user.photo' v-if='user.photo', @error="imageLoadError")
      v-flex(sm6, xs12)
        .text-sm-left.text-center.mb-3
          upload-button(outlined, @file-selected='photoSelected', title='Upload a Photo', :loading='uploadingPhoto')
        .text-sm-left.text-center.mb-3
          v-btn(small, outlined, @click='showCamera = true') Take a Selfie
        .text-sm-left.text-center.mb-3
          v-btn(small, outlined, @click='getGravatar()') Use Gravatar
    div(v-if='showCamera', style='position: absolute; top: 0; right: 0; bottom: 0; left: 0;')
      camera(@image-captured='photoSelected')
</template>

<script>
import UploadButton from '../components/UploadButton'
import UploadService from '../services/UploadService'
import Camera from '../components/Camera'
import GravatarService from '../services/GravatarService'

export default {
  name: 'userPhoto',
  components: { UploadButton, Camera },
  props: {
    user: Object
  },
  data: () => ({
    showCamera: false,
    uploadingPhoto: false
  }),
  methods: {
    imageLoadError () {
      this.$emit('set-photo', null)
    },
    async photoSelected (file) {
      this.showCamera = false
      this.uploadingPhoto = true
      const photoUrl = await UploadService.uploadFile(file)
      this.$emit('set-photo', photoUrl)
      this.uploadingPhoto = false
    },
    getGravatar () {
      this.$emit('set-photo', GravatarService.getAccountPhotoUrl(this.user.email))
    }
  }
}
</script>

<style scoped>
  .user-photo-img {
    max-width: 240px;
    max-height: 180px;
    object-fit: contain;
  }
</style>
