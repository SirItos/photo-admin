<template>
  <!-- <b-in-progress /> -->
  <v-row class="column pa-4 fill-height" no-gutters>
    <v-col class="pt-12">
      <div class="d-flex justify-center">
        <v-icon size="18" color="primary" class="d-flex justify-center">mdi-alert-outline</v-icon>Нет детального экрана
        <v-icon size="18" color="primary" class="d-flex justify-center">mdi-alert-outline</v-icon>
      </div>
      <div>
        <v-row class="justify-end">
          <v-col lg="4" md="5" sm="6" xs="12">
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
        <template
          v-slot:item.user_id="{ item }"
        >{{item.user ? `+7 ${item.user.phone}` : 'Не указан номер'}}</template>
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
                  <v-icon small>mdi-email-send-outline</v-icon>
                </v-btn>
              </template>
              <span>Ответить</span>
            </v-tooltip>

            <v-menu offset-y>
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
  name: 'MessagesPage',
  components: {
    'b-in-progress': () => import('~/components/AppInWork')
  },
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
      .post('/admin/feedback', payload)
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

  mixins: [tableMixins],
  data: vm => ({
    api: 'feedback',
    headers: [
      {
        text: 'id',
        align: 'center',
        value: 'id',
        sortable: true
      },

      {
        text: 'Отправитель',
        value: 'user_id',
        align: 'center',
        sortable: true
      },

      {
        text: 'Email',
        value: 'email',
        align: 'center',
        sortable: true
      },
      {
        text: 'Дата отправки',
        value: 'created_at',
        align: 'center',
        sortable: true
      },
      {
        text: 'Статус',
        value: 'status',
        align: 'center',
        sortable: true
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
        text: 'Отметить как прочитанное',
        value: 'activate',
        callback: () => vm.prompt(vm.selected, 'Отметить как прочитанное', 4)
      },
      {
        text: 'Отметить как не прочитанное',
        value: 'deactivate',
        callback: () => vm.prompt(vm.selected, 'Отметить как не прочитанное', 1)
      }
    ]
  }),
  methods: {
    menuListPrepare(status) {
      return status === 4
        ? [
            {
              label: 'Просмортреть',
              actions: 'check',
              status: 1
            },
            {
              label: 'Отменить как не прочитанное',
              actions: 'prompt',
              status: 1
            }
          ]
        : [
            {
              label: 'Просмортреть',
              actions: 'check',
              status: 1
            },
            {
              label: 'Отметить как отработанное',
              actions: 'prompt',
              status: 4
            }
          ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>