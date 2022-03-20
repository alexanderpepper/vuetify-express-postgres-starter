<template lang="pug">
  .user-address
    v-autocomplete(label='Country', :items='countries', item-text='name', item-value='name', v-model='user.country', autocomplete='off')
    v-text-field.pt-0(label='Street Address Line 1', v-model='user.addressLine1')
    v-text-field(label='Street Address Line 2', v-model='user.addressLine2')
    v-text-field(label='City', v-model='user.city')
    v-autocomplete(label='State', :items='states' item-text='name' item-value='name' v-model='user.state')
    v-text-field(label='Zip Code' v-model='user.zipCode')
</template>

<script>
import states from '../constants/states'
import countries from '../constants/countries'

export default {
  name: 'userAddress',
  props: {
    user: Object
  },
  data: () => ({
    states,
    countries
  })
}
</script>
