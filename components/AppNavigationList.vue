<template>
  <v-list-item nuxt link :to="item.to" v-ripple="{class:'white--text'}" class="nav-padding-b">
    <v-list-item-icon>
      <v-badge
        :content="badgeCounter"
        :value="badgeCounter"
        color="white"
        overlap
        bordered
        class="nav-badge"
      >
        <v-icon class="white--text">{{ item.icon }}</v-icon>
      </v-badge>
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
  },
  computed: {
    badgeCounter() {
      if (!this.item.target) return 0
      return this.$store.state.counter[this.item.target]
    }
  }
}
</script>

<style lang="scss">
.nav-badge {
  .v-badge__badge {
    color: #ff473a !important;
    &::after {
      border-color: #ff473a !important;
    }
  }
}

.v-list-item--active {
  .nav-badge {
    .v-badge__badge {
      color: #e54034 !important;
      &::after {
        border-color: #e54034 !important;
      }
    }
  }
}
</style>