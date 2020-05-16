<template>
  <div>
    <RatingToolTip :rating="list.averageRating">
      <v-chip class="mr-2" color="white" style="align: flex-end;">
        <span class="grey--text text--darken-1">Avg</span>
        <b class="ml-2 mr-2">{{list.average_rating.toFixed(1)}}</b>
        <v-rating :dense=true :small=true :half-increments="true" :readonly="true" :hover="false"
          color="grey darken-1" background-color="grey lighten-1"
          v-model="list.average_rating" length="3"></v-rating>
      </v-chip>
    </RatingToolTip>

    <RatingToolTip :rating="list.min_rating">
      <v-chip class="mr-2" color="white">
        <span class="grey--text text--darken-1">Min</span>
        <b class="ml-2">{{list.min_rating}}</b>
      </v-chip>
    </RatingToolTip>
    
    <RatingToolTip :rating="list.max_rating">
      <v-chip color="white">
        <span class="grey--text text--darken-1">Max</span>
        <b class="ml-2">{{list.max_rating}}</b>
      </v-chip>
    </RatingToolTip>
  </div>
</template>

<script>
import RatingToolTip from '@/components/RatingToolTip';

export default {
  components: {
    RatingToolTip: RatingToolTip
  },
  props: {
    list: Object
  }
}
</script>
