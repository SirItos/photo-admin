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
        <template v-slot:body="{ items,isSelected, select }">
          <tbody style="cursor:pointer">
            <tr v-for="item in items" :key="item.id">
              <td>
                <v-simple-checkbox :value="isSelected(item)" @input="select(item, $event)"></v-simple-checkbox>
              </td>
              <td @dblclick="clickRow(item.id)" class="text-center">{{ item.id }}</td>
              <td @dblclick="clickRow(item.id)" class="text-center">{{ item.title }}</td>
              <td
                @dblclick="clickRow(item.id)"
                class="text-center"
              >{{$moment(item.created_at).format('DD/MM/YYYY')}}</td>
              <td @dblclick="clickRow(item.id)" class="text-center">
                <b-table-status :status="item.statustitle.status_title" />
              </td>
            </tr>
          </tbody>
        </template>
        <!-- <template
          v-slot:item.created_at="{ item }"
        >{{$moment(item.created_at).format('DD/MM/YYYY')}}</template>
        <template v-slot:item.status="{ item }">
          <b-table-status :status="item.statustitle.status_title" />
        </template>-->
      </v-data-table>
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
  data: () => ({
    search: null,
    wait: false,
    page_mounted: false,
    singleSelect: false,
    selected: [],
    total: 0,
    loading: false,
    options: {
      // sortBy: ['created_at'],
      // sortDesc: [true],
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
      }
    ],
    items: []
  }),
  watch: {
    options: {
      handler() {
        console.log(this.options)
        if (!this.page_mounted) return
        this.loadApiData()
      }
    }
  },
  created() {
    this.$store.dispatch('global/changeHeader', 'Анкеты пользователей')
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
    clickRow(val) {
      console.log(val)
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
    }
  }
}
//  query (params) {
//       let query = Object.assign({}, this.$route.query, params)
//       this.$router.push({ query: query })
//       this.get(query)
//     }
</script>
