<template>
  <ul style="list-style-type: none;" class="pa-0">
    <li v-for="r in ratings" v-bind:key="r.key">
      <v-rating class="d-inline mr-2"
        :readonly=true :value="r.rating" :dense=true :small=true length="3"
        color="white" background-color="grey lighten-1"></v-rating>
      <span v-bind:class="{ selected: shouldSelect(r.rating) }" v-text="r.description"></span>
    </li>
  </ul>
</template>

<style scoped>
.selected {
  font-weight: bold;
}
</style>

<script>
export default {
  props: {
    rating: Number
  },

  data() {
    return {
      ratings: [
        { rating: 0, selected: true, description: 'Fewer than two named women' },
        { rating: 1, description: 'Has at least two named women in it' },
        { rating: 2, description: 'Who talk to each other' },
        { rating: 3, description: 'About something besides a man' }
      ]
    };
  },

  methods: {
    shouldSelect(rating) {
      return Math.floor(this.rating) == rating || Math.ceil(this.rating) == rating;
    }
  }
}
</script>