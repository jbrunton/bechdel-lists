<template>
  <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
</template>
<script>
export default {
  props: {
    params: Object
  },
  methods: {
    evaluateBreadcrumb(route) {
      const defn = route.meta.breadcrumb;
      if (!defn) {
        return null;
      }
      const breadcrumb = typeof defn === 'function'
        ? defn(this.$route, this.params)
        : { text: defn.text };
      if (route != this.$route) {
        breadcrumb.href = route.path;
      }
      return breadcrumb;
    },

    buildBreadcrumbs(route) {
      const crumbs = [];
      const breadcrumb = this.evaluateBreadcrumb(route);
      if (breadcrumb) {
        if (breadcrumb.parent) {
          const parentRoute = this.$router.resolve(breadcrumb.parent).route;
          crumbs.push(...this.buildBreadcrumbs(parentRoute));
        }
        crumbs.push(breadcrumb);
      }
      return crumbs;
    }
  },

  computed: {
    breadcrumbs() {
      const crumbs = this.buildBreadcrumbs(this.$route);
      return crumbs;
    }
  }
}
</script>
