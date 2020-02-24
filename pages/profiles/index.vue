<template>
  <v-row class="column pa-4 fill-height" no-gutters>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :server-items-length="total"
        :single-select="singleSelect"
        item-key="id"
        show-select
      ></v-data-table>
      {{$moment(test).format('ddd-M-YYYY')}}
    </v-col>
  </v-row>
</template>

<script>
export default {
  async asyncData({ store, $axios }) {
    return await $axios
      .post('/admin/resources', {
        page: 1
      })
      .then(response => {
        return {
          items: response.data.data,
          total: response.data.total,
          test: response.data.data[0].created_at
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
  components: {},
  data: () => ({
    singleSelect: false,
    selected: [],
    total: 0,
    test: null,
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
  created() {
    this.$store.dispatch('global/changeHeader', 'Анкеты пользователей')
  }
}
//  query (params) {
//       let query = Object.assign({}, this.$route.query, params)
//       this.$router.push({ query: query })
//       this.get(query)
//     }
</script>
