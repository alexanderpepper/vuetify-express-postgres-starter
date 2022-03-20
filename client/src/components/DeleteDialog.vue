<template lang="pug">
  v-dialog(v-model='showModal', width='290')
    template(v-slot:activator='{ on }')
      v-btn(v-if='deleteIcon', icon, :small='!xSmall', :x-small='xSmall', v-on='on')
        v-icon delete
      v-btn(v-if='closeIcon', icon, x-small, v-on='on', slot='activator', @click.stop.prevent)
        v-icon.grey--text.text--lighten-1(:size='16') close
      v-btn(v-if='button', v-on='on', small, outlined, slot='activator') Delete {{ entity }}
    v-card
      v-card-title.headline Delete {{ entity }}?
      v-card-text Are you sure you want to delete this {{ entity }}? This action cannot be undone.
      v-card-actions
        v-spacer
        v-btn(text, @click='$emit("close")') Cancel
        v-btn(outlined, @click='$emit("confirmed")') Delete
</template>

<script>
export default {
  names: 'deleteDialog',
  props: {
    deleteIcon: Boolean,
    closeIcon: Boolean,
    button: Boolean,
    show: Boolean,
    entity: String,
    xSmall: Boolean
  },
  data: () => ({
    showModal: false
  }),
  watch: {
    show (val) {
      this.showModal = val
    }
  }
}
</script>
