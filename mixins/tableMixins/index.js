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
    filteredRole: [],
    statusFilter: [],
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
          search: this.search,
          filter: {
            role: this.filteredRole.length ? this.filteredRole : undefined,
            status: this.statusFilter.length ? this.statusFilter : undefined
          }
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
    prompt(payload, title, status, options = {}) {
      const { form } = options

      this.$store.dispatch('dialog/setDialogParams', {
        visibility: true,
        title: `${title}?`,
        okLabel: 'Да',
        cancelLabel: 'Нет',
        confirm: true,
        form: form,
        okAction: async () => {
          this.$store.dispatch('dialog/setDialogParams', {})
          await this.changeStatusApi(payload, status)
          this.$store.dispatch('dialog/setReason', { reason: null })
        }
      })
    },
    async changeStatusApi(payload, status) {
      this.loading = true
      await this.$axios
        .post(`/admin/${this.api}/status`, {
          obj: this.payloadStatusCreate(payload),
          status: status,
          reason: this.$store.state.dialog.reason
        })
        .then(response => {
          this.$store.dispatch('counter/loadCounter')
          response.data.delete
            ? this.deleteRows(response.data.obj)
            : this.changeItemsStauts(response.data.obj)

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
    deleteRows(arr) {
      arr.forEach(res => {
        try {
          let itemToDelete = this.items.findIndex(item => {
            return Number(item.id) === Number(res)
          })

          this.items.splice(itemToDelete, 1)
        } catch (error) {}
      })
    },
    payloadStatusCreate(resources) {
      return resources.map(item => {
        return item.id
      })
    },
    menuAction(action, payload, title, status, options = {}) {
      if (!action) return

      this[action](payload, title, status, options)
    },
    remove(index, target) {
      if (index >= 0) {
        this[target].splice(index, 1)
        this.loadApiData()
      }
    },
    formatPhone(phone) {
      let phone_numeric = new String(phone).replace(/[^\d]+/g, '')
      const phone_formatted = phone_numeric.replace(
        /(\d{3})(\d{3})(\d{2})(\d{2})/,
        '+7 ($1) $2-$3-$4'
      )

      return phone_formatted
    }
  }
}
