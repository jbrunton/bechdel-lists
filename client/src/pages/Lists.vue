<template>
<v-container>
  <v-row>
    <v-col cols="6">
      <ListsPanel ref="listsPanel" v-on:list-selected="listSelected" />
    </v-col>
    <v-col cols="6">
      <ListPanel v-bind:list-id="selectedListId" v-on:list-updated="listUpdated" />
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
    },
    listUpdated() {
      this.$refs.listsPanel.load();
    }
  }
}
</script>
