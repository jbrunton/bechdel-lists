<template>
  <div>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-chip class="mr-2" color="white" v-on="on" style="align: flex-end;">
        <span class="grey--text text--darken-1">Avg</span>
        <b class="ml-2 mr-2">{{list.averageRating.toFixed(1)}}</b>
        <v-rating :dense=true :small=true :half-increments="true" :readonly="true" :hover="false"
          color="grey darken-1" background-color="grey lighten-1"
          v-model="list.averageRating" length="3"></v-rating>
      </v-chip>
    </template>
    <RatingToolTip :rating="list.averageRating"></RatingToolTip>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-chip class="mr-2" color="white" v-on="on">
        <span class="grey--text text--darken-1">Min</span>
        <b class="ml-2">{{list.minRating}}</b>
      </v-chip>
    </template>
    <RatingToolTip :rating="list.minRating"></RatingToolTip>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-chip color="white" v-on="on">
        <span class="grey--text text--darken-1">Max</span>
        <b class="ml-2">{{list.maxRating}}</b>
      </v-chip>
    </template>
    <RatingToolTip :rating="list.maxRating"></RatingToolTip>
  </v-tooltip>
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
