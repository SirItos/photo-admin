<template>
  <v-row no-gutters class="justify-center">
    <v-col md="6" sm="8" xs="8">
      <v-card
        elevation="6"
        class="border-4 overflow-hidden"
        style="transition: all 0.2s; overflow:hidden"
        :style="height"
      >
        <v-form
          @submit.prevent="auth"
          ref="form"
          lazy-validation
          :value="valid"
          style="height:100%"
        >
          <v-card-title class="primary white--text justify-center align-center">
            <div class="absolute-img"></div>
            <div>Вход</div>
          </v-card-title>
          <v-fade-transition mode="out-in">
            <div v-if="!loading" key="form">
              <v-card-text class="pa-6">
                <v-text-field
                  v-model="login"
                  :rules="[v => !!v || 'Введите логин']"
                  prepend-inner-icon="mdi-account"
                  label="Логин"
                  type="text"
                />
                <v-text-field
                  v-model="password"
                  @click:append="show = !show"
                  :rules="[v => !!v || 'Введите пароль']"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  color="primary"
                  label="Пароль"
                />
              </v-card-text>
              <v-card-actions class="d-flex justify-center pb-6">
                <v-btn
                  type="submit"
                  :disabled="loading"
                  large
                  width="250"
                  color="primary"
                  >Войти</v-btn
                >
              </v-card-actions>
            </div>
            <div
              v-else
              key="loading"
              class="px-6 py-12 d-flex flex-wrap justify-center align-center"
            >
              <v-progress-circular
                :size="86"
                color="primary"
                width="7"
                indeterminate
              ></v-progress-circular>
              <div style="width:100%" class="py-3 text-center">
                {{ loadingMessage }}
              </div>
            </div>
          </v-fade-transition>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'auth',
  layout: 'authLayout',
  data: () => ({
    login: null,
    loadingMessage: 'Загрузка...',
    password: null,
    show: false,
    loading: false,
    valid: false,
    height: {
      height: '64px'
    }
  }),
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$set(this.height, 'height', '328px')
      }, 300)
    })
  },
  beforeDestroy() {
    this.loading = false
  },
  methods: {
    async auth() {
      if (!this.$refs.form.validate()) {
        return
      }
      this.loading = true
      this.loadingMessage = 'Аунтификация'
      this.$set(this.height, 'height', '292px')

      await this.$store.dispatch('user/auth', {
        login: this.login,
        password: this.password
      })
      this.loadingMessage = 'Получение данных профиля'
      setTimeout(
        () => {
          this.$set(this.height, 'height', '328px')
          this.loading = false
        },
        this.$store.state.user.error ? 0 : 10000
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
