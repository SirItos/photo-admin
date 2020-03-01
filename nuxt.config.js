import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',

  head: {
    titleTemplate: '%s',
    title: 'BazaBab - панель администратора',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  router: {
    middleware: 'auth'
  },

  loading: { color: '#FF473A' },

  css: ['~/assets/app.scss'],

  plugins: [{ src: '~/plugins/axios.js' }],

  buildModules: [
    '@nuxtjs/vuetify',
    ['@nuxtjs/moment', { locales: ['ru'], defaultLocale: 'ru' }]
  ],

  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],

  axios: {
    baseURL:
      process.env.NODE_ENV === 'development'
        ? 'http://photo/api'
        : 'https://back.bazabab.ru/api',
    progress: false
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    optionsPath: './vuetify.options.js'
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
