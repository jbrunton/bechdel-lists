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
    path: '/browse/lists',
    name: 'BrowseLists',
    component: () => import(/* webpackChunkName: "browse" */ '../pages/lists/Browse.vue')
  },
  {
    path: '/my/lists',
    name: 'MyLists',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/MyLists.vue')
  },
  {
    path: '/browse/lists/:id',
    name: 'BrowseList',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/Show.vue')
  },
  {
    path: '/my/lists/:id',
    name: 'MyList',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/Show.vue')
  },
  {
    path: '/browse/lists/:id/charts',
    name: 'BrowseListCharts',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/Charts.vue')
  },
  {
    path: '/my/lists/:id/charts',
    name: 'MyListCharts',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/Charts.vue')
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
