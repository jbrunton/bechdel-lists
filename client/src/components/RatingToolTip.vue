<template>
  <ul style="list-style-type: none;" class="pa-0">
    <li>
      <v-rating class="d-inline mr-2"
        :readonly=true :value="0" :dense=true :small=true length="3"
        color="white" background-color="grey lighten-1"></v-rating>
      0 - Fewer than two named women
    </li>
    <li>
      <v-rating class="d-inline mr-2"
        :readonly=true :value="1" :dense=true :small=true length="3"
        color="white" background-color="grey lighten-1"></v-rating>
      1 - Has at least two named women in it
    </li>
    <li>
      <v-rating class="d-inline mr-2"
        :readonly=true :value="2" :dense=true :small=true length="3"
        color="white" background-color="grey lighten-1"></v-rating>
      2 - Who talk to each other
    </li>
    <li>
      <v-rating class="d-inline mr-2"
        :readonly=true :value="3" :dense=true :small=true length="3"
        color="white" background-color="grey lighten-1"></v-rating>
      3- About something besides a man
    </li>
  </ul>
</template>
