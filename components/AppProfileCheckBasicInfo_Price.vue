<template>
  <v-text-field :value="priceRange" label="Стоимость" readonly />
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
    priceRange() {
      if (!this.price[0] && !this.price[1]) {
        return 'Не указана'
      }
      if (Number(this.price[0]) > 10000 && Number(this.price[0]) > 10000) {
        return 'Вам не по карману'
      }
      if (this.price[0] === this.price[1]) {
        return `${this.price[0]} `
      }
      if (this.price.length < 2) {
        return `${this.price[0]} `
      }
      return this.startPrice + this.decim + this.endPrice
    },
    startPrice() {
      const startStr = Number(this.price[1]) > 10000 ? 'от ' : ''
      return this.price[0] ? `${startStr} ${this.price[0]} ` : ''
    },
    endPrice() {
      if (Number(this.price[1]) > 10000) return ''
      const startStr = Number(!this.price[0]) ? 'до ' : ''
      return this.price[1] ? `${startStr}${this.price[1]} ` : ''
    },
    decim() {
      return this.price[0] && this.endPrice ? '- ' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>