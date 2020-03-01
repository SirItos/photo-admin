<template>
  <v-app>
    <v-app-bar app color="white" class="elevation-0">
      <v-toolbar-title>{{$store.state.global.header}}</v-toolbar-title>
      <!-- 
      <template v-slot:extension>
        <v-breadcrumbs class="px-0 py-2" :items="$store.state.global.breadcrumbs"></v-breadcrumbs>
      </template>-->
    </v-app-bar>
    <v-overlay :value="$store.state.global.overlay" opacity="0.8">
      <v-progress-circular indeterminate color="primary" width="7" size="64"></v-progress-circular>
    </v-overlay>
    <v-navigation-drawer
      v-model="drawler"
      class="white--text"
      color="primary"
      app
      permanent
      expand-on-hover
      mini-variant
    >
      <v-list nav class="pa-0">
        <p-avatar
          :name="$store.state.user.name"
          :role="$store.state.user.role"
          :user_id="$store.state.user.id"
        />
        <v-list-item @click="logout" link v-ripple="{class:'white--text'}" class="nav-padding-b">
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
    <v-content style="background-color:rgba(255,255,255)">
      <nuxt />
    </v-content>
    <v-dialog
      :value="visibility"
      max-width="400"
      @click:outside="$store.dispatch('dialog/setDialogParams',{})"
      style="z-index:1200"
    >
      <dialog-content />
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { logoutMixin } from '@/mixins'

export default {
  middleware: 'checkRole',
  components: {
    'p-avatar': () => import('@/components/AppAvatarComponent'),
    'p-navigator-list': () => import('@/components/AppNavigationList'),
    'dialog-content': () => import('@/components/DialogComponent')
  },
  mixins: [logoutMixin],
  data: () => ({
    drawler: true,
    items: [
      {
        title: 'Анкеты',
        icon: 'mdi-clipboard-list-outline',
        to: '/profiles',
        target: 'resources'
      },
      {
        title: 'Сообщения',
        icon: 'mdi-message-alert-outline',
        to: '/messages',
        target: 'feedback'
      },
      {
        title: 'Пользователи',
        icon: 'mdi-account-outline',
        to: '/users'
      }
    ]
  }),
  computed: {
    ...mapState('dialog', ['visibility'])
  },
  methods: {
    ...mapActions('dialog', ['setDialogParams'])
  }
}
</script>

<style>
html {
  overflow-y: auto;
}
</style>
