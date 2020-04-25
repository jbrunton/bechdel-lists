<template>
<v-container>
  <v-row>
    <v-col cols="6">
      <ListsPanel v-on:list-selected="listSelected" />
    </v-col>
    <v-col cols="6">
      <ListPanel v-bind:list-id="selectedListId" />
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import ListsPanel from '@/components/ListsPanel.vue'
import ListPanel from '@/components/ListPanel.vue'

export default {
  name: 'Lists',
  components: {
    ListsPanel,
    ListPanel
  },

  data() {
    return {
      selectedListId: null
    }
  },

  methods: {
    listSelected(list) {
      this.selectedListId = list.id;
    }
  }
}
</script>
