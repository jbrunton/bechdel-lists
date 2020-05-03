import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../pages/Home.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../pages/Profile.vue')
  },
  {
    path: '/browse',
    name: 'Browse',
    component: () => import(/* webpackChunkName: "browse" */ '../pages/lists/Browse.vue')
  },
  {
    path: '/lists',
    name: 'MyLists',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/Index.vue')
  },
  {
    path: '/lists/:id',
    name: 'ShowList',
    component: () => import(/* webpackChunkName: "showList" */ '../pages/lists/Show.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../pages/Search.vue')
  }
]

if (process.env.NODE_ENV == 'development') {
  routes.push({
    path: '/dev/idtoken',
    component: () => import(/* webpackChunkName: "idToken" */ '../pages/dev/IdToken.vue')
  })
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
