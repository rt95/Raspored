import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import routes from './routes'
import App from './App.vue'
import { store } from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './registerServiceWorker'
const fb = require('./firebaseConfig.js')
require('moment/locale/hr')
Vue.use(VueRouter)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router: router,
      store: store,
      render: h => h(App)
    })
  }
})
