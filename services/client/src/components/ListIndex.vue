<template>
  <v-list class="mb-4 mt-2">
    <v-list-item v-for="list in lists" :key="list.id" :to="{ name: 'BrowseList', params: { id: list.id }}">
      <v-list-item-content>
        <v-list-item-title class="primary--text" v-text="list.title"></v-list-item-title>
        <v-list-item-subtitle v-text="list.description"></v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <Rating v-bind:rating="list.averageRating" :showScore="true" />
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
import Rating from '@/components/Rating';

export default {
  props: {
    lists: Array
  },
  components: {
    Rating    
  }
}
</script>