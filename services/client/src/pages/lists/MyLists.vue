<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
          <v-toolbar flat :color="showAddListItem ? 'pink' : 'grey lighten-4'" :dark="showAddListItem">
            <v-btn
              v-if="showAddListItem"
              icon
              @click="showAddListItem = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
                  
            <v-fade-transition mode="out-in">
              <v-toolbar-title :key="showAddListItem">
                    {{ showAddListItem ? 'New List' : 'My Lists' }}
              </v-toolbar-title>  
            </v-fade-transition>        

            <v-spacer></v-spacer>

            <v-fade-transition mode="out-in">
              <v-btn text @click="showAddListItem = true" v-if="!showAddListItem">
                <v-icon left color="pink">mdi-plus-circle</v-icon>New
              </v-btn>
            </v-fade-transition>

            <v-progress-linear
              :active="showLoadingIndicator"
              :indeterminate="showLoadingIndicator"
              absolute
              bottom
              color="deep-purple accent-4"
            ></v-progress-linear>
          </v-toolbar>

          <v-slide-y-transition mode="out-in">
            <v-card-text v-if="showAddListItem" key="addList">
              <form>
                <v-text-field
                  label="Title"
                  placeholder="My New List"
                  v-model="newListTitle"
                ></v-text-field>
                <v-btn class="mr-4" color="success" @click="addListClicked">add</v-btn>
              </form>
            </v-card-text>

            <ListIndex v-bind:lists="lists" parentTab="my" key="list" :showPrivacy="true" />
          </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const axios = require('axios');
import ListIndex from '@/components/ListIndex';

export default {
  components: {
    ListIndex
  },

  data() {
    return {
      lists: [],
      showLoadingIndicator: false,
      showAddListItem: false,
      newListTitle: ""
    }
  },

  created() {
    this.load();
  },

  methods: {
    async load() {
      this.lists = [];
      this.showLoadingIndicator = true;      
      const result = await axios.get('/api/lists');
      this.lists = result.data;
      this.showLoadingIndicator = false;
    },

    showAddListItemClicked() {
      this.showAddListItem = true;
    },

    hideAddListItemClicked() {
      this.showAddListItem = false;
    },

    listClicked(list) {
      this.$router.push({ name: 'ShowList', params: { id: list.id }})
    },

    async addListClicked() {
      try {
        this.showLoadingIndicator = true;
        await axios.post('/api/lists', { title: this.newListTitle });
        this.showAddListItem = false;
        this.load();
      } catch (e) {
        alert(e);
      }
    }
  }
}
</script>
