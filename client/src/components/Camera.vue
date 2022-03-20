<template lang="pug">
  .capture(@click='capture')
    #camera
    .instructions Click or tap anywhere to take a photo
    transition(name='fade')
      .flash(v-if='flashEffect')
    v-icon.camera-button(@click='switchCamera', v-show='multipleCameras') switch_camera
</template>

<script>
  import CameraService from '../services/CameraService'

  export default {
    name: 'camera',
    data: () => ({
      flashEffect: false,
      multipleCameras: false
    }),
    mounted () {
      CameraService.init().then(() => {
        CameraService.attach('camera').then(() => {
          this.multipleCameras = CameraService.cameraIdentifiers.length > 1
        })
      })
    },
    methods: {
      capture () {
        this.flashEffect = true
        setTimeout(() => {
          this.flashEffect = false
        }, 200)
        CameraService.snap().then((base64Data) => {
          this.$emit('data-captured', base64Data)
          this.$emit('image-captured', CameraService.convertBase64ToFile(base64Data))
          CameraService.detach()
        })
      },
      switchCamera () {
        CameraService.switchCamera()
      }
    }
  }
</script>

<style scoped>
  .capture {
    background-color: black;
    position: relative;
    height: 100%;
    width: 100%;
  }

  #camera, .flash {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99998;
  }

  .camera-button {
    color: white;
    text-shadow: 0 2px 4px rgba(150, 150, 150, 0.9);
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 32px;
    cursor: pointer;
    z-index: 99999;
  }

  .instructions {
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
    position: absolute;
    top: 24px;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: white;
    z-index: 99999;
  }

  .flash {
    background-color: white;
  }
</style>
