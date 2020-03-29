<template>
  <v-app>
    <v-content>
      <v-container class="fill-height d-flex align-center">
        <nuxt />
      </v-container>
    </v-content>
    <v-dialog
      :value="visibility"
      max-width="400"
      @click:outside="$store.dispatch('dialog/setDialogParams',{})"
      style="z-index:1200"
      @keydown.esc="$store.dispatch('dialog/setDialogParams',{})"
    >
      <dialog-content />
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'authLayout',
  components: {
    'dialog-content': () => import('@/components/DialogComponent')
  },
  data: () => ({}),
  computed: {
    ...mapState('dialog', ['visibility'])
  }
}
</script>
