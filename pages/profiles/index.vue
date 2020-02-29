<template>
  <v-row class="column pa-4 fill-height" no-gutters>
    <v-col class="pt-12">
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
              <span>Проверить</span>
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
                  @click="menuAction(listItem.actions,[item], listItem.status)"
                >
                  <v-list-item-title>{{ listItem.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-data-table>
      <v-expand-transition>
        <v-col xs="12" sm="4" class="d-felx dropdown py-0" v-if="selected.length" key="actions_btn">
          <v-overflow-btn
            :items="dropdown_icon"
            background-color="primary"
            color="white"
            class="text--white text-none"
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
export default {
  name: 'ProfilesPage',
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
      .post('/admin/resources', payload)
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
  middleware: ['counterMiddleware'],
  components: {
    'b-table-status': () => import('@/components/AppTableStatus')
  },
  data: vm => ({
    search: null,
    wait: false,
    page_mounted: false,
    singleSelect: false,
    selected: [],
    total: 0,
    loading: false,
    options: {
      itemsPerPage: 15
    },
    headers: [
      {
        text: 'id',
        align: 'center',
        value: 'id',
        sortable: true
      },

      {
        text: 'Название',
        value: 'title',
        align: 'center',
        sortable: true
      },
      {
        text: 'Дата создания',
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
        text: 'Активировать',
        value: 'activate',
        callback: () => vm.prompt(vm.selected, 2)
      },
      {
        text: 'Отклонить',
        value: 'deactivate',
        callback: () => vm.prompt(vm.selected, 3)
      }
    ]
  }),
  watch: {
    options: {
      handler() {
        if (!this.page_mounted) return
        this.loadApiData()
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.page_mounted = true
    })
  },
  methods: {
    fillSelected(arr) {
      this.selected = arr
    },
    searching() {
      if (!this.wait) {
        this.wait = true
        setTimeout(() => {
          this.loadApiData()
          this.wait = false
        }, 1000)
      }
    },
    async loadApiData() {
      this.cahngeRouteParams()
      this.loading = true
      await this.$axios
        .post('/admin/resources', {
          page: this.options.page,
          paginate: this.options.paginate,
          sortBy: this.options.sortBy[0],
          sortDesc: this.options.sortDesc[0] ? 'desc' : 'asc',
          search: this.search
        })
        .then(response => {
          this.loading = false
          this.items = response.data.data
          this.total = response.data.total
        })
        .catch(e => {
          this.$store.dispatch('dialog/setDialogParams', {
            visibility: true,
            title: 'Ошибка',
            text:
              'Произошла ошибка при получение данных, повтороите попытку позднее',
            okLabel: 'Ок'
          })
        })
    },
    cahngeRouteParams() {
      let query = Object.assign({}, this.$route.query, {
        page: this.options.page,
        paginate: this.options.itemsPerPage,
        order: this.options.sortBy[0],
        desc: this.options.sortDesc[0],
        search: this.search
      })
      this.$router.push({ query: query })
    },

    menuListPrepare(status) {
      return status === 3
        ? [
            {
              label: 'Просмортреть',
              actions: 'check',
              status: 1
            },
            {
              label: 'Активировать',
              actions: 'prompt',
              status: 2
            }
          ]
        : status === 2
        ? [
            {
              label: 'Просмортреть',
              actions: 'check',
              status: 1
            },
            {
              label: 'Отклонить',
              actions: 'prompt',
              status: 3
            }
          ]
        : [
            {
              label: 'Просмортреть',
              actions: 'check',
              status: 1
            },
            {
              label: 'Активировать',
              actions: 'prompt',
              status: 2
            },
            {
              label: 'Отклонить',
              actions: 'prompt',
              status: 3
            }
          ]
    },
    menuAction(action, payload, status) {
      if (!action) return
      this[action](payload, status)
    },
    check(payload) {
      this.$router.push({
        path: `/profiles/check`,
        query: { id: payload[0].id }
      })
    },
    prompt(payload, status) {
      this.$store.dispatch('dialog/setDialogParams', {
        visibility: true,
        title: status === 2 ? 'Активировать?' : 'Отклонить',
        okLabel: 'Да',
        cancelLabel: 'Нет',
        confirm: true,
        okAction: () => {
          this.activateApi(payload, status)
          this.$store.dispatch('dialog/setDialogParams', {})
        }
      })
    },
    async activateApi(payload, status) {
      this.loading = true
      await this.$axios
        .post('/admin/resource/status', {
          resources: this.payloadStatusCreate(payload),
          status: status
        })
        .then(response => {
          this.changeItemsStauts(response.data.resources)
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
    },
    payloadStatusCreate(resources) {
      return resources.map(item => {
        return item.id
      })
    },
    changeItemsStauts(arr) {
      arr.forEach(res => {
        try {
          let newItem = this.items.find(item => {
            return item.id === res.id
          })
          newItem.status = res.status
          newItem.statustitle = res.statustitle
        } catch (error) {}
      })
      this.selected = []
      this.$refs.table.$data.selection = {}
    }
  }
}
</script>

<style lang="scss">
.dropdown {
  .v-btn__content,
  i.v-icon {
    color: white !important;
    text-transform: capitalize;
  }
}
</style>