<template>
  <v-row no-gutters class="flex-column pb-8 px-4 fill-height">
    <v-col>
      <v-form ref="form" @submit="call" :value="valid" lazy-validation>
        <v-row class="px-4 pb-4 pt-10">
          <v-col cols="12" sm="6">
            <v-text-field
              v-if="role.id === 3 || role.id ===4"
              v-model="phone"
              autocomplete="off"
              prefix="+7"
              maxlength="10"
              label="Телефон"
              :rules="[val => !!val || 'Укажите телефон']"
            ></v-text-field>
            <v-text-field
              v-else
              v-model="login"
              label="Логин"
              :rules="[val => !!val || 'Укажите Логин']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="details.name"
              label="Имя"
              :rules="[val => !!val || 'Укажите имя']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              type="tel"
              inputmode="numeric"
              autocomplete="0ff"
              :hint="!$route.query.id ? `Минимум ${isAdmiOrManager ? 7 : 4} символов` : ''"
              :maxlength="role ? role.id === 1 || role.id === 2 ? 7 : 4 : 7"
              name="password"
              :counter="role ? role.id === 1 || role.id === 2 ? 7 : 4 : 0"
              :label="!$route.query.id ? 'Пароль' : 'Пароль (установить новый)'"
              :class="{ secure: !show }"
              :rules="!$route.query.id ? [val => !!val || 'Укажите Пароль', rules.length(isAdmiOrManager ? 7 : 4 )] : []"
              @click:append="show = !show"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="details.email"
              label="Email"
              :rules="[val => !!val || 'Укажите  Email', rules.email_rules]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="role"
              :items="availbRoleList"
              :loading="itemLoading"
              label="Роль"
              return-object
              item-text="text"
              item-value="id"
              style="text-transform:capitalize"
              :rules="[val => !!val.id || 'Укажите  Роль пользователя']"
            ></v-select>
          </v-col>
          <v-col v-if="$route.query.id" cols="12" sm="6">
            <v-checkbox :readonly="haveRights" label="Активирован" v-model="status"></v-checkbox>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
    <div class="d-flex justify-end">
      <v-btn @click="$router.back()" class="mr-2" large color="primary" depressed text>Назад</v-btn>
      <v-btn
        @click="call"
        large
        color="primary"
        depressed
      >{{$route.query.id ? "Сохранить" : 'Создать'}}</v-btn>
    </div>
  </v-row>
</template>

<script>
export default {
  name: 'DetailsUser',
  async asyncData({ store, query, $axios }) {
    if (!query.id) {
      return {
        id: null,
        role: {
          id: null,
          text: null
        },
        details: {
          name: null,
          email: null
        },
        statustitle: null,
        status: true,
        phone: null,
        login: null
      }
    }
    return await $axios
      .post('/user-params', {
        id: query.id,
        params: [
          'id',
          'roles',
          'userDetails',
          'statustitle',
          'phone',
          'login',
          'status'
        ]
      })
      .then(response => {
        return {
          id: response.data.id,
          role: {
            id: response.data.roles[0].id,
            text: response.data.roles[0].name_ru
          },
          details: {
            user_id: response.data.userDetails
              ? response.data.userDetails.id
              : null,
            name: response.data.userDetails
              ? response.data.userDetails.name
              : null,
            display_phone: response.data.userDetails
              ? response.data.userDetails.display_phone
              : null,
            email: response.data.userDetails
              ? response.data.userDetails.email
              : null,
            age_range: response.data.userDetails
              ? response.data.userDetails.age_range
              : null,
            online: response.data.userDetails
              ? response.data.userDetails.online
              : null
          },
          statustitle: response.data.statustitle.status_title,
          status: response.data.status === 5,
          phone: response.data.phone,
          login: response.data.login
        }
      })
  },
  data: () => ({
    valid: false,
    show: false,
    password: null,
    items: [],
    itemLoading: true,
    rules: {
      length: len => v => {
        if (!v) return true
        return (
          v.length >= len || `Проль должен содержать минимум ${len} символов`
        )
      },
      email_rules: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Некоректный email'
      }
    }
  }),
  computed: {
    availbRoleList() {
      return this.role.id === 1
        ? this.items
        : this.items.filter(item => {
            return item.id !== 1
          })
    },
    haveRights() {
      if (this.$store.state.user.role === 'admin') return false
      if (this.role.id === 1) return true
      return false
    },
    isAdmiOrManager() {
      return this.role ? this.role.id === 1 || this.role.id === 2 : false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadRoleList()
    })
  },
  methods: {
    async call() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('global/setOverlay', true)
        await this.$axios
          .post(`/admin/user/${this.$route.query.id ? 'edit' : 'save'}`, {
            id: this.id,
            role: this.role,
            details: this.details,
            status: this.status,
            login:
              this.role.id === 1 || this.role.id === 2
                ? this.login
                : this.phone,
            password: this.password
          })
          .then(response => {
            this.$store.dispatch('global/setOverlay', false)
          })
          .catch(e => {
            this.$store.dispatch('global/setOverlay', false)
            this.store.dispatch('dialog/setDialogParams', {
              visibility: true,
              title: 'Ошибка',
              text: 'Произошла ошибка при получение данных',
              okLabel: 'Ок'
            })
          })
      }
    },
    loadRoleList() {
      this.$axios
        .get('role-list')
        .then(response => {
          this.items = response.data.map(row => {
            return {
              id: row.id,
              text: row.name_ru
            }
          })
          this.itemLoading = false
        })
        .catch(e => {
          this.itemLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>