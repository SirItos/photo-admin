<template >
  <span
    style="text-transform: capitalize;"
    :class="{
    'new_item':status==='новый',
    'primary':status==='новый'
  }"
    class="py-2 px-4"
  >{{status}}</span>
</template>

<script>
export default {
  name: 'AppTableStatus',
  props: {
    status: {
      type: String,
      default: 0
    },
    detail: Boolean
  }
}
</script>

<style lang="scss" scoped>
.new_item {
  color: white;
  border-radius: 20px;
}
</style>