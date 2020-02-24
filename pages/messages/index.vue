<template>
  <b-in-progress />
</template>

<script>
export default {
  name: 'MessagesPage',
  components: {
    'b-in-progress': () => import('~/components/AppInWork')
  }
}
</script>

<style lang="scss" scoped>
</style>