export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  loading: false,
  head: {
    title: 'hyundai',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'vue-select/dist/vue-select.css',
    'assets/scss/style.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/vueInputMask.client.js'},
    {src: '~/plugins/vSelect.client.js'},
    {src: '~/plugins/paginate.client.js'},
    {src: '~/plugins/vue-prototype.js'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    'nuxt-route-meta',
  ],
  // router: {
  //  middleware: "route"
  // },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config, { isClient }) {
      if (isClient) {
        config.devtool = '#source-map'
      }
    }
  }
}
