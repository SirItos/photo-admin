<template>
  <v-list-item nuxt link v-ripple="{class:'white--text'}">
    <v-list-item-icon>
      <v-icon class="white--text">{{ item.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'AppNavigationList',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>