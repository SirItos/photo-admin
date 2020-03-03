export const tableMixins = {
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
      itemsPerPage: 15
    }
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

    async loadApiData() {
      this.cahngeRouteParams()
      this.loading = true
      await this.$axios
        .post(`/admin/${this.api}`, {
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
    prompt(payload, title, status) {
      this.$store.dispatch('dialog/setDialogParams', {
        visibility: true,
        title: `${title}?`,
        okLabel: 'Да',
        cancelLabel: 'Нет',
        confirm: true,
        okAction: () => {
          this.changeStatusApi(payload, status)
          this.$store.dispatch('dialog/setDialogParams', {})
        }
      })
    },
    async changeStatusApi(payload, status) {
      this.loading = true
      await this.$axios
        .post(`/admin/${this.api}/status`, {
          obj: this.payloadStatusCreate(payload),
          status: status
        })
        .then(response => {
          this.$store.dispatch('counter/loadCounter')
          this.changeItemsStauts(response.data.obj)
          this.loading = false
        })
        .catch(e => {
          this.loading = false
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
    },
    payloadStatusCreate(resources) {
      return resources.map(item => {
        return item.id
      })
    },
    menuAction(action, payload, title, status) {
      if (!action) return
      this[action](payload, title, status)
    }
  }
}
