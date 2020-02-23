<template>
  <v-list-item link two-line class v-ripple="{class:'white--text'}">
    <v-list-item-avatar color="white" class="primary--text">{{initial}}</v-list-item-avatar>

    <v-list-item-content class="white--text">
      <v-list-item-title>{{name || `User ${user_id || ''}`}}</v-list-item-title>
      <v-list-item-subtitle class="white--text">{{humanRole}}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'AppAvatarComponent',
  props: {
    name: {
      type: String,
      default: 'User'
    },
    user_id: {
      type: Number,
      default: 1
    },
    role: {
      type: String,
      default: null
    }
  },
  computed: {
    initial() {
      const name = this.name || 'user'
      const words = name.split(/[\s]+/)
      let init = ''

      words.forEach(word => {
        init += word.substr(0, 1).toUpperCase()
      })
      if (init.length > 3) {
        init.substr(0, 3)
      }
      return init
    },
    humanRole() {
      return this.role === 'admin' ? 'Администратор' : 'Менеджер'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>