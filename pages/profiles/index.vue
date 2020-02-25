<template>
  <v-row class="column pa-4 fill-height" no-gutters>
    <v-col class="pt-12">
      <div>
        <v-text-field></v-text-field>
      </div>
      <v-data-table
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
          <b-table-status :status="item.status" />
        </template>
      </v-data-table>
      <!-- {{$moment(test).format('ddd-M-YYYY')}} -->
    </v-col>
  </v-row>
</template>

<script>
export default {
  async asyncData({ store, $axios }) {
    return await $axios
      .post('/admin/resources', {
        page: 1,
        paginate: 1
      })
      .then(response => {
        return {
          items: response.data.data,
          total: response.data.total
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
  data: () => ({
    singleSelect: false,
    selected: [],
    total: 0,
    loading: false,
    options: {
      // sortBy: ['created_at'],
      // sortDesc: [true],
      itemsPerPage: 1
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
      }
    ],
    items: []
  }),
  watch: {
    options: {
      handler() {
        this.loadApiData()
      }
    }
  },
  created() {
    this.$store.dispatch('global/changeHeader', 'Анкеты пользователей')
  },
  methods: {
    async loadApiData() {
      this.cahngeRouteParams()
      this.loading = true
      await this.$axios
        .post('/admin/resources', {
          page: this.options.page,
          paginate: 1,
          sortBy: this.options.sortBy[0],
          sortDesc: this.options.sortDesc[0] ? 'desc' : 'asc'
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
        desc: this.options.sortDesc[0]
      })
      this.$router.push({ query: query })
    }
  }
}
//  query (params) {
//       let query = Object.assign({}, this.$route.query, params)
//       this.$router.push({ query: query })
//       this.get(query)
//     }
</script>
