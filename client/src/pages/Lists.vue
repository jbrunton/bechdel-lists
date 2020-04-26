<template>
<v-container>
  <v-row justify="center">
    <v-col cols="8">
      <ListsPanel ref="listsPanel" v-on:list-selected="listSelected" />
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import ListsPanel from '@/components/ListsPanel.vue'

export default {
  name: 'Lists',
  components: {
    ListsPanel
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
