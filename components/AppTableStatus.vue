<template >
  <span
    :class="{
    'new_item':!status,
    'primary':!status
  }"
    class="py-2 px-4"
  >{{statusToHumanView}}</span>
</template>

<script>
export default {
  name: 'AppTableStatus',
  props: {
    status: {
      type: Number,
      default: 0
    }
  },
  computed: {
    statusToHumanView() {
      switch (this.status) {
        case 0:
          return 'Новый'
        case 1:
          return 'Просмотрен'
        case 2:
          return 'Принят'
        case 3:
          return 'Отклонен'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.new_item {
  color: white;
  border-radius: 20px;
}
</style>