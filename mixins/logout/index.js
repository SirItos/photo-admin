export const logoutMixin = {
  methods: {
    logout() {
      this.setDialogParams({
        visibility: true,
        title: 'Выход',
        text: 'Вы уверены что хотите выйте?',
        okLabel: 'Да',
        cancelLabel: 'Нет',
        confirm: true,
        okAction: async () => {
          await this.$store.dispatch('user/logout')
          this.$store.dispatch('dialog/setDialogParams', {}, { root: true })
          $nuxt.$router.push('/auth')
        }
      })
    }
  }
}
