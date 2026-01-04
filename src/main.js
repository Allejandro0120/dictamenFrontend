import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import vuetify from './plugins/vuetify'
import api from './plugins/axios'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.prototype.$axios = api

new Vue({
  router,
  store,
  vuetify,
  moment,
  render: function (h) { return h(App) }
}).$mount('#app')
