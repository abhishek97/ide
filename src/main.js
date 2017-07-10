// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import App from './App'
import store from './store'
// import 'bootstrap/dist/css/bootstrap.css'

// import BootstrapVue from 'bootstrap-vue'

Vue.config.productionTip = false

// Vue.use(BootstrapVue)
Vue.use(Vue2Filters)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
