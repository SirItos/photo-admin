<template>
  <v-col cols="12">
    <v-row>
      <v-col sm="8" cols="12" class="title primary--text">
        Контактная информация пользователя
        <v-divider class="primary my-2"></v-divider>
      </v-col>
      <!-- <v-col sm="6" xs="12" v-if="item.user.user_details">
        <v-text-field label="Имя" readonly :value="item.user.user_details.name || 'Не указано'" />
      </v-col>-->
      <v-col sm="6" xs="12" v-if="item.user.user_details">
        <v-text-field
          label="Email"
          readonly
          :value="item.user.user_details.email || 'Не указан'"
        />
      </v-col>
      <v-col sm="6" xs="12" v-if="item.user.user_details">
        <v-text-field
          label="Телефон"
          readonly
          :value="item.user.phone || 'Не указан'"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'OwnerInfo',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped></style>
