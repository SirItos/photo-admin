export default function({ app, store, redirect }) {
  return new Promise(async (resolve, reject) => {
    if (!store.state.user.role) {
      await store.dispatch('user/getUserParams', ['roles', 'id', 'userDetails'])
    }
    if (
      store.state.user.role !== 'admin' &&
      store.state.user.role !== 'manager'
    ) {
      app.$cookies.removeAll()
      redirect('/auth')
      resolve()
    } else {
      resolve()
    }
  })
}
