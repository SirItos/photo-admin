export default function({ app, redirect, route }) {
  if (!app.$cookies.get('access_token')) {
    if (route.name === 'auth') return
    redirect('/auth')
  } else if (route.name === 'auth') {
    redirect('/profiles')
  }
}
