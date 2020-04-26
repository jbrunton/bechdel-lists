import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Lists',
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
