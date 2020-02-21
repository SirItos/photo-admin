<template>
  <v-app>
    <v-app-bar></v-app-bar>
    <!-- permanent -->
    <v-navigation-drawer
      v-model="drawler"
      class="white--text"
      color="primary"
      app
      permanent
      expand-on-hover
      mini-variant
    >
      <v-list nav class="py-0">
        <p-avatar
          :name="$store.state.user.name"
          :role="$store.state.user.role"
          :user_id="$store.state.user.id"
        />
        <v-list-item nuxt link v-ripple="{class:'white--text'}">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">Выход</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="white mb-3"></v-divider>
        <p-navigator-list v-for="item in items" :key="item.title" :item="item" />
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  middleware: 'checkRole',
  components: {
    'p-avatar': () => import('@/components/AppAvatarComponent'),
    'p-navigator-list': () => import('@/components/AppNavigationList')
  },
  data: () => ({
    drawler: true,
    items: [
      {
        title: 'Пользователи',
        icon: 'mdi-account-outline',
        to: null
      },
      {
        title: 'Анкеты',
        icon: 'mdi-clipboard-list-outline',
        to: null
      },
      {
        title: 'Сообщения',
        icon: 'mdi-message-alert-outline',
        to: null
      }
    ]
  })
}
</script>
