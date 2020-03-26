export default function({ app, $axios, store, redirect }) {
  $axios.onRequest(config => {
    if (app.$cookies.get('access_token')) {
      config.headers.Authorization = `Bearer ${app.$cookies.get(
        'access_token'
      )}`
    }
    return config
  })
  // $axios.onResponse(() => {
  //   // store.dispatch('settings/setChainAction', {})
  //   store.dispatch('settings/setOverlay', false)
  // })
  $axios.onError(error => {
    // console.log('global error handler')
    // store.dispatch('settings/setOverlay', false)
    if (error.response.status === 401) {
      redirect('/auth')
    }
  })
}
