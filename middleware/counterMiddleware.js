export default function({ store }) {
  return new Promise(async resolve => {
    await store.dispatch('counter/loadCounter')

    resolve()
  })
}
