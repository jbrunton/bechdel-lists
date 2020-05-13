<template>
  <RatingToolTip :rating="rating">
    <v-chip color="grey">
      <v-rating :dense=true :small=true :half-increments=true :readonly=true
        color="white" background-color="grey lighten-1"
        v-model="rating" length="3"></v-rating>
      <b class="ml-2 white--text" v-text="rating.toFixed(1)" v-if="showScore"></b>
    </v-chip>
  </RatingToolTip>
</template>

<script>
import RatingToolTip from '@/components/RatingToolTip';

export default {
  components: {
    RatingToolTip: RatingToolTip
  },
  props: {
    rating: Number,
    showScore: Boolean
  }
}
</script>
