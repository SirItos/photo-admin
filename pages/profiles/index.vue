<template>
  <v-row>PRofiles</v-row>
</template>

<script>
export default {
  middleware: ['counterMiddleware'],
  components: {},
  created() {
    this.$store.dispatch('global/changeHeader', 'Анкеты пользователей')
  }
}
</script>
