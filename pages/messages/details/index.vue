<template>
  <v-row no-gutters class="flex-column pb-8 px-4 fill-height">
    <v-col>
      <v-row>
        <v-col cols="12" sm="4">
          <div
            v-if="message.status !== 1 && message.status !== 0"
            class="d-flex align-end primary--text title fill-height text-capitalize"
          >{{message.statustitle.status_title}}</div>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field readonly :value="message.email" label="От:" hide-details />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            :value="$moment(message.created_at).format('DD/MM/YYYY')"
            readonly
            label="Дата:"
            hide-details
          />
        </v-col>
        <v-col cols="1" class="align-end d-flex">
          <v-btn color="primary" text icon @click="callDeleteaction">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-textarea
            :value="message.description"
            readonly
            auto-grow
            label="Сообщение"
            hide-details
          />
        </v-col>
      </v-row>
      <v-divider class="mt-10 mb-2" />
      <v-row>
        <v-col cols="12" :sm="message.answer ? 8 : 12">
          <v-text-field
            label="Заголовк"
            v-model="title"
            :readonly="message.status===4"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="4" class="mb-5" v-if="message.answer">
          <v-text-field
            :value="$moment(message.answer.created_at).format('DD/MM/YYYY')"
            hide-details
            readonly
            label="Дата ответа"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="answer" label="Ответ" :readonly="message.status===4" hide-details />
        </v-col>
      </v-row>
    </v-col>
    <div class="d-flex justify-end">
      <v-btn @click="$router.back()" class="mr-2" large color="primary" depressed text>Назад</v-btn>
      <v-btn
        v-if="message.status !== 4"
        @click="sendAnswer"
        :disabled="!answer"
        large
        color="primary"
        depressed
      >Ответить</v-btn>
      <v-btn
        v-if="message.status !== 4"
        @click="sendAnswer"
        :disabled="!answer"
        large
        color="primary"
        depressed
      >Ответить</v-btn>
    </div>
  </v-row>
</template>

<script>
export default {
  name: 'MessageDetails',
  async asyncData({ store, query, $axios }) {
    if (!query.id) {
      return {
        message: {}
      }
    }
    return await $axios
      .post('/admin/feedback/details', { id: query.id })
      .then(response => {
        return { message: response.data, answer: response.data.answer?.answer }
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
    answer: null,
    title: null
  }),
  methods: {
    async sendAnswer() {
      this.$store.dispatch('global/setOverlay', true)
      this.$axios
        .post('/admin/feedback/answer', {
          id: this.message.id,
          answer: this.answer,
          title: this.title
        })
        .then(response => {
          this.$store.dispatch('global/setOverlay', false)
          this.message.status = response.data.status
          this.message.statustitle.status_title = response.data.status_title
          this.message.answer = response.data.answer
          this.$store.dispatch('dialog/setDialogParams', {
            visibility: true,
            title: 'Сообщение отправлено',
            okLabel: 'Ок',
            okAction: () => {
              this.$store.dispatch('dialog/setDialogParams', {}, { root: true })
              $nuxt.$router.back()
            }
          })
        })
        .catch(e => {
          this.$store.dispatch('global/setOverlay', false)
          this.$store.dispatch('dialog/setDialogParams', {
            visibility: true,
            title: 'Ошибка',
            text: 'Произошла ошибка при отправке сообщения',
            okLabel: 'Ок'
          })
        })
    },
    callDeleteaction() {
      this.$store.dispatch('dialog/setDialogParams', {
        visibility: true,
        title: `Удалить сообщение?`,
        okLabel: 'Да',
        cancelLabel: 'Нет',
        confirm: true,
        okAction: () => {
          this.deleteAction()
          this.$store.dispatch('dialog/setDialogParams', {})
        }
      })
    },
    async deleteAction() {
      this.$store.dispatch('global/setOverlay', true)
      await this.$axios
        .post(`/admin/feedback/status`, {
          obj: [this.message.id],
          status: -1
        })
        .then(response => {
          $nuxt.$router.back()
          this.$store.dispatch('global/setOverlay', false)
        })
        .catch(e => {
          this.$store.dispatch('global/setOverlay', false)
          this.$store.dispatch('dialog/setDialogParams', {
            visibility: true,
            title: `Что-то пошло не так`,
            okLabel: 'Ок'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>