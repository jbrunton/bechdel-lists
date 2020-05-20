<template>
  <span>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="$emit('click')" v-bind:disabled="selected" :color="color">
          <v-icon>{{icon}}</v-icon>
        </v-btn>
      </template>
      <span>{{ text }}</span>
    </v-tooltip>  
  </span>
</template>

<script>
export default {
  props: {
    text: String,
    icon: String,
    selected: Boolean,
    color: String
  }
}
</script>
