export default function({ app, redirect, route }) {
  if (!app.$cookies.get('access_token')) {
    redirect('/auth')
  } else if (route.name === 'auth') {
    redirect('/')
  }
}
