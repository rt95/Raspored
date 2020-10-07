import login from './views/login.vue'
import main from './views/main.vue'
import naslovnica from './views/naslovnica.vue'

const routes = [
  { path: '/login', component: login },
  {
    path: '/raspored',
    name: 'Raspored',
    component: main,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/naslovnica',
    component: naslovnica,
    meta: {
      requiresAuth: true
    }
  },
  // path za sve ostale za istom domenom
  {
    path: '*',
    redirect: '/naslovnica'
  }
]

export default routes
