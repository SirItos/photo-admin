<template>
  <v-row no-gutters class="px-4 pb-4 pt-12">
    <v-col cols="12">
      <v-row no-gutters class="align-center justify-space-between">
        <v-col sm="7" xs="12" class="title">
          {{item.title }} :
          <b-table-status :status="item.statustitle.status_title" />
        </v-col>
        <div>
          <v-row no-gutters class="justify-end">
            <v-col v-if="item.status !== 2" xs="12" md="6" class="pa-1">
              <v-btn depressed color="primary" block>Актвировать</v-btn>
            </v-col>
            <v-col v-if="item.status !== 3" xs="12" md="6" class="pa-1">
              <v-btn depressed color="primary" text block>Отклонить</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-row>
      <v-divider class="primary my-2"></v-divider>
    </v-col>

    <b-basic :item="item" />

    <v-col cols="12">
      <v-row>
        <v-col cols="8" class="title primary--text">
          Владелец
          <v-divider class="primary my-2"></v-divider>
        </v-col>
        <v-col sm="6" xs="12"></v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-row>
        <v-col cols="8" class="title primary--text">
          Фотографии
          <v-divider class="primary my-2"></v-divider>
        </v-col>
        <v-col sm="6" xs="12"></v-col>
      </v-row>
    </v-col>
    {{item}}
  </v-row>
</template>

<script>
export default {
  name: 'ProfileCheck',
  components: {
    'b-table-status': () => import('@/components/AppTableStatus'),
    'b-basic': () => import('@/components/ProfileCheckBasicInfo')
  },
  async asyncData({ store, router, query, $axios }) {
    if (!query.id) return
    return await $axios
      .post('/get-resource-params', { id: query.id, all: true })
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
  })
}
</script>

<style lang="scss" scoped>
</style>