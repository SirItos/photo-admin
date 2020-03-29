<template>
  <v-row no-gutters class="px-4 pb-4 pt-6">
    <v-col cols="12 white" style="position:sticky; top:56px; z-index:1">
      <v-row no-gutters class="align-center __nuxt-error-page">
        <div style="max-width:36px" class="mr-2 d-none d-sm-block">
          <v-btn @click="$router.replace('/profiles')" color="primary" text icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </div>
        <div xs="12" class="title">
          {{item.title || 'Нет имени' }} :
          <b-table-status :status="item.statustitle.status_title" detail />
        </div>
        <v-spacer class="d-none d-sm-block"></v-spacer>
        <div>
          <v-row class="justify-end pt-xs-2">
            <v-col v-if="item.status !== 2 " xs="12">
              <v-btn @click="prompt(2,'Активировать')" depressed color="primary" block>Актвировать</v-btn>
            </v-col>
            <v-col v-if="item.status !== 3 && item.status !== 2 && item.status !== 6" xs="12">
              <v-btn
                @click="prompt(3,'Отклонить',{ form: true })"
                depressed
                color="primary"
                text
                block
              >Отклонить</v-btn>
            </v-col>
            <v-col v-if="item.status === 2" xs="12">
              <v-btn
                @click="prompt(6,'Заблокировать',{ form: true })"
                depressed
                color="primary"
                text
                block
              >Заблокировать</v-btn>
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
    prompt(status, title, options = {}) {
      const { form } = options
      this.$store.dispatch('dialog/setDialogParams', {
        visibility: true,
        title: `${title}?`,
        okLabel: 'Да',
        cancelLabel: 'Нет',
        form: form,
        confirm: true,
        okAction: async () => {
          this.$store.dispatch('dialog/setDialogParams', {})
          await this.activateApi(status)
          this.$store.dispatch('dialog/setReason', { reason: null })
        }
      })
    },
    async activateApi(status) {
      this.$store.dispatch('global/setOverlay', true)
      await this.$axios
        .post('/admin/resources/status', {
          obj: [this.item.id],
          status: status,
          reason: this.$store.state.dialog.reason
        })
        .then(response => {
          this.$store.dispatch('global/setOverlay', false)
          this.$set(this.item, 'status', response.data.obj[0].status)
          this.$set(this.item, 'statustitle', response.data.obj[0].statustitle)
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