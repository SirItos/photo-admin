export default function({ app, route, store, redirect }) {
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
      if (route.fullPath === '/') {
        redirect('/profiles')
      }
      // await store.dispatch('counter/loadCounter')
      store.dispatch('global/changeHeader', setHeader(route.fullPath))
      resolve()
    }
  })
}
function setHeader(path) {
  if (path.startsWith('/profiles')) {
    return 'Анкеты'
  } else if (path.startsWith('/messages')) {
    return 'Сообщения'
  } else if (path.startsWith('/users')) {
    return 'Пользователи'
  }
  return
}
