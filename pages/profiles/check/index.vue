<template>
  <v-row no-gutters class="px-4 pb-4 pt-6">
    <v-col cols="12 white" style="position:sticky; top:56px; z-index:1">
      <v-row no-gutters class="align-center __nuxt-error-page">
        <div style="max-width:36px" class="mr-2 d-none d-sm-block">
          <v-btn nuxt to="/profiles" color="primary" icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </div>
        <v-col sm="7" xs="12" class="title">
          {{item.title }} :
          <b-table-status :status="item.statustitle.status_title" detail />
        </v-col>
        <div>
          <v-row no-gutters class="justify-end pt-xs-2">
            <v-col v-if="item.status !== 2" xs="12" md="6" class="pa-1">
              <v-btn @click="prompt(2)" depressed color="primary" block>Актвировать</v-btn>
            </v-col>
            <v-col v-if="item.status !== 3" xs="12" md="6" class="pa-1">
              <v-btn @click="prompt(3)" depressed color="primary" text block>Отклонить</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-row>
      <v-divider class="primary my-2"></v-divider>
    </v-col>

    <b-basic :item="item" />
    <b-owner :item="item" />
    <b-photos :images="item.images" />
  </v-row>
</template>

<script>
export default {
  name: 'ProfileCheck',
  components: {
    'b-table-status': () => import('@/components/AppTableStatus'),
    'b-basic': () => import('@/components/ProfileCheckBasicInfo'),
    'b-owner': () => import('@/components/ProfileCheckOwnerInfo'),
    'b-photos': () => import('@/components/ProfileCheckPhoto')
  },
  async asyncData({ store, router, query, $axios }) {
    if (!query.id) return
    return await $axios
      .post('/get-resource-params', { id: query.id, all: true, admin: true })
      .then(response => {
        store.dispatch('counter/subCounter', {
          key: 'resources'
        })

        return {
          item: response.data
        }
      })
      .catch(e => {
        store.dispatch('dialog/setDialogParams', {
          visibility: true,
          title: 'Ошибка',
          text: 'Произошла ошибка при получение данных',
          okLabel: 'Ок'
        })
      })
  },
  data: () => ({
    item: null
  }),
  methods: {
    prompt(status) {
      this.$store.dispatch('dialog/setDialogParams', {
        visibility: true,
        title: status === 2 ? 'Активировать?' : 'Отклонить',
        okLabel: 'Да',
        cancelLabel: 'Нет',
        confirm: true,
        okAction: () => {
          this.activateApi(status)
          this.$store.dispatch('dialog/setDialogParams', {})
        }
      })
    },
    async activateApi(status) {
      this.$store.dispatch('global/setOverlay', true)
      await this.$axios
        .post('/admin/resource/status', {
          resources: [this.item.id],
          status: status
        })
        .then(response => {
          this.$store.dispatch('global/setOverlay', false)
          this.$set(this.item, 'status', response.data.resources[0].status)
          this.$set(
            this.item,
            'statustitle',
            response.data.resources[0].statustitle
          )
        })
        .catch(e => {
          this.$store.dispatch('global/setOverlay', false)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>