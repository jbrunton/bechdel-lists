<template>
  <v-list class="mb-4 mt-2">
    <v-list-item v-for="list in lists" :key="list.id" :to="{ name: 'List', params: { id: list.id, parentTab: parentTab }}">
      <v-list-item-content>
        <v-list-item-title class="primary--text" v-text="list.title"></v-list-item-title>
        <v-list-item-subtitle v-text="list.description"></v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action class="d-flex align-center flex-row">
        <v-btn icon class="primary--text mr-2"
          :to="{ name: 'ListCharts', params: { id: list.id, parentTab: parentTab }}"
        >
          <v-icon color="pink">mdi-chart-timeline-variant</v-icon>
        </v-btn>
        <Rating v-bind:rating="list.averageRating" :showScore="true" />
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
import Rating from '@/components/Rating';

export default {
  props: {
    lists: Array,
    parentTab: String
  },
  components: {
    Rating    
  }
}
</script>