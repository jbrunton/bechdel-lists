import Vue from 'vue'
import VueRouter from 'vue-router'

import { Auth } from '@/auth';

Vue.use(VueRouter)

function getParentRoute(parentTab) {
  if (parentTab == 'my') {
    return { name: 'MyLists' };
  } else if (parentTab == 'browse') {
    return { name: 'Browse' };
  } else {
    throw new Error(`Unexpected parent tab: ${parentTab}`);
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../pages/Home.vue')
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "signin" */ '../pages/SignIn.vue')
  },
  {
    path: '/my/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../pages/Profile.vue')
  },
  {
    path: '/browse/lists',
    name: 'BrowseLists',
    component: () => import(/* webpackChunkName: "browse" */ '../pages/lists/Browse.vue'),
    meta: {
      breadcrumb: {
        text: 'Browse'
      }
    }
  },
  {
    path: '/my/lists',
    name: 'MyLists',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/MyLists.vue'),
    meta: {
      breadcrumb: {
        text: 'My Lists'
      }
    }
  },
  {
    path: '/:parentTab/lists/:id',
    name: 'List',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/Show.vue'),
    meta: {
      breadcrumb: (route, params) => {
        const parentTab = route.params.parentTab;
        return {
          text: params.list.title,
          parent: getParentRoute(parentTab)
        }
      }
    }
  },
  {
    path: '/:parentTab/lists/:id/charts',
    name: 'ListCharts',
    component: () => import(/* webpackChunkName: "lists" */ '../pages/lists/Charts.vue'),
    meta: {
      breadcrumb: (route) => {
        const parentTab = route.params.parentTab;
        return {
          text: 'Charts',
          parent: { name: 'List', params: { parentTab: parentTab} }
        }
      }
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../pages/Search.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../pages/404.vue')
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
});

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some(route => route.meta.requireAuth) || to.path.startsWith('/my/');
  if (requireAuth) {
    const { signedIn } = await Auth.getStatus();
    if (!signedIn) {
      next({ path: '/signin', query: { redirectTo: to.path } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
