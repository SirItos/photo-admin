<template>
  <!-- <b-in-progress /> -->
  <v-row class="column pa-4 fill-height" no-gutters>
    <v-col class="pt-12">
      <div class="d-flex justify-center">
        <v-icon size="18" color="primary" class="d-flex justify-center">mdi-alert-outline</v-icon>Остался функционал добавления новых пользователей( частично готово)
        <v-icon size="18" color="primary" class="d-flex justify-center">mdi-alert-outline</v-icon>
      </div>
      <div>
        <v-row no-gutters class="align-center flex-wrap">
          <v-col cols="12" sm="auto">
            <v-btn
              @click="$router.push({
        path: `/users/details`})"
              block
              depressed
              color="primary"
            >
              Добавить
              <v-icon rigth>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col lg="4" md="5" sm="6" cols="12">
            <v-text-field
              v-model="search"
              @input="searching"
              label="Поиск"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <v-data-table
        ref="table"
        @input="fillSelected"
        :headers="headers"
        :items="items"
        :items-per-page="20"
        :server-items-length="total"
        :options.sync="options"
        :loading="loading"
        :single-select="singleSelect"
        :footer-props="{
            itemsPerPageOptions:[]
        }"
        item-key="id"
        show-select
      >
        <template v-slot:item.login="{ item }">{{item.login || `+7 ${item.phone}` || '----'}}</template>
        <template v-slot:item.roles[0].name="{ item }">{{item.roles[0].name_ru}}</template>
        <template v-slot:item.user_details.activated="{ item }">
          {{
          item.user_details ? item.user_details.activated ? 'Да' : "Нет" : '----'}}
        </template>
        <template
          v-slot:item.user_details.email="{ item }"
        >{{item.user_details ? item.user_details.email || '----' : '----'}}</template>
        <template
          v-slot:item.created_at="{ item }"
        >{{$moment(item.created_at).format('DD/MM/YYYY')}}</template>
        <template v-slot:item.status="{ item }">
          <b-table-status :status="item.statustitle.status_title" />
        </template>
        <template v-slot:item.action="{ item }">
          <div class="d-flex justify-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn small text icon v-on="on" class="mr-2" @click="check([item])">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Редактировать</span>
            </v-tooltip>

            <v-menu offset-y v-if="compareRoles(item)">
              <template v-slot:activator="{ on: menu }">
                <v-tooltip top>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn small icon text v-on="{ ...tooltip, ...menu }">
                      <v-icon small>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <span>меню</span>
                </v-tooltip>
              </template>
              <v-list>
                <v-list-item
                  v-for="(listItem, index) in menuListPrepare(item.status)"
                  :key="index"
                  @click="menuAction(listItem.actions,[item],listItem.label, listItem.status)"
                >
                  <v-list-item-title>{{ listItem.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-data-table>
      <v-expand-transition>
        <v-col xs="12" sm="5" class="d-felx dropdown py-0" v-if="selected.length" key="actions_btn">
          <v-overflow-btn
            :items="dropdown_icon"
            background-color="primary"
            color="white"
            class="text--white"
            style="text-transform:none!important"
            value="activate"
            segmented
            target="#dropdown-example"
          ></v-overflow-btn>
        </v-col>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script>
import { tableMixins } from '@/mixins'
export default {
  name: 'UsersPage',
  async asyncData({ query, store, $axios }) {
    const payload = Object.keys(query).length
      ? {
          page: query.page,
          paginate: query.paginate,
          sortBy: query.order,
          sortDesc: query.desc ? 'desc' : 'asc',
          search: query.search ? query.search : null
        }
      : {
          page: 1,
          paginate: 15
        }
    return await $axios
      .post('/admin/user', payload)
      .then(response => {
        return {
          items: response.data.data,
          total: response.data.total,
          search: query.search,
          options: Object.keys(query).length
            ? {
                sortBy: [query.order],
                sortDesc: [query.desc],

                itemsPerPage: query.paginate
              }
            : { itemsPerPage: 15 }
        }
      })
      .catch(e => {
        store.dispatch('dialog/setDialogParams', {
          visibility: true,
          title: 'Ошибка',
          text:
            'Произошла ошибка при получение данных, повтороите попытку позднее',
          okLabel: 'Ок'
        })
      })
  },
  components: {
    'b-in-progress': () => import('~/components/AppInWork')
  },
  mixins: [tableMixins],
  data: vm => ({
    api: 'user',
    headers: [
      {
        text: 'id',
        align: 'center',
        value: 'id',
        sortable: false
      },

      {
        text: 'Логин / Номер телефона',
        value: 'login',
        align: 'center',
        sortable: false
      },
      // {
      //   text: 'Активная учетная запиьс',
      //   value: 'user_details.activated',
      //   align: 'center',
      //   sortable: true
      // },
      // {
      //   text: 'Номер телефона',
      //   value: 'phone',
      //   align: 'center',
      //   sortable: true
      // },

      {
        text: 'Email',
        value: 'user_details.email',
        align: 'center',
        sortable: false
      },

      {
        text: 'Роль',
        value: 'roles[0].name',
        align: 'center',
        sortable: false
      },
      {
        text: 'Активный',
        value: 'statustitle.status_title',
        align: 'center',
        sortable: false
      },
      {
        text: 'Дата регистрации',
        value: 'created_at',
        align: 'center',
        sortable: false
      },
      {
        text: 'Действия',
        value: 'action',
        align: 'center',
        sortable: false
      }
    ],
    items: [],
    dropdown_icon: [
      {
        text: 'Активировать',
        value: 'activate',
        callback: () => vm.prompt(vm.selected, 'Активировать', 5)
      },
      {
        text: 'Заблокировать',
        value: 'deactivate',
        callback: () => vm.prompt(vm.selected, 'Заблокировать', 6)
      }
    ]
  }),
  methods: {
    menuListPrepare(status) {
      return status === 5
        ? [
            {
              label: 'Редактировать',
              actions: 'check',
              status: 5
            },
            {
              label: 'Заблокировать',
              actions: 'prompt',
              status: 6
            }
          ]
        : [
            {
              label: 'Редактировать',
              actions: 'check',
              status: 6
            },
            {
              label: 'Активировать',
              actions: 'prompt',
              status: 5
            }
          ]
    },
    compareRoles(item) {
      if (this.$store.state.user.role === 'admin') return true
      return item.roles[0].name !== 'admin'
    },
    check(payload) {
      this.$router.push({
        path: `/users/details`,
        query: { id: payload[0].id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>