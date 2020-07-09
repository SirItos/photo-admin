<template>
  <v-select
    readonly
    multiple
    :append-icon="null"
    :value="priceId"
    :items="optionsPriceRange"
    chips
    item-value="id"
    item-text="value"
    label="Оценка свидания"
  >
    <template></template>
    <template v-slot:selection="{item}">
      <v-chip @click:close="spliceSelected(item.id)" color="primary">{{item.value}}</v-chip>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'Profiele_Price',
  props: {
    price: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    optionsPriceRange() {
      return this.price.map(item => {
        return {
          id: item.id,
          value: `${item.min_cost}  ${this.checkMaxValue(item.max_cost)}`
        }
      })
    },
    priceId() {
      return this.price.map(item => {
        return item.id
      })
    }
  },
  methods: {
    checkMaxValue(value) {
      return value >= 999999999 ? ' и более' : ` - ${value}`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>