<template>
  <v-col cols="12">
    <v-row>
      <v-col sm="8" cols="12" class="title primary--text">
        Общая информация
        <v-divider class="primary my-2"></v-divider>
      </v-col>
      <v-col sm="6" cols="12">
        <v-text-field readonly label="Адресс" :value="item.address" />
      </v-col>
      <v-col sm="6" cols="12">
        <v-text-field
          readonly
          label="Свидания"
          :value="item.resource_type === 1 ? 'С подругами' : 'Индивидуально'"
        />
      </v-col>
      <v-col sm="6" cols="12">
        <v-text-field
          readonly
          label="Возростной диапозон"
          :value="item.user.user_details.age_range"
        />
      </v-col>
      <v-col sm="6" cols="12">
        <v-text-field readonly label="Стоиомсть" :value="item.address" />
      </v-col>
      <v-col sm="6" cols="12">
        <v-text-field
          readonly
          label="Дата создания анкеты"
          :value="$moment(item.created_at).format('DD/MM/YYYY')"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea label="Описание" auto-grow readonly :value="item.description" />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'BaseInfo',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>