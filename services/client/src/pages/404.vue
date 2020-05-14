<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-banner single-line>
          <v-avatar slot="icon" color="primary" size="40">
            <v-icon icon="mdi-glasses" color="white">mdi-glasses</v-icon>
          </v-avatar>
          Oops! We couldn't find the page you're looking for.
        </v-banner>
        <div class="text-center ma-8">
          <v-btn dark color="pink" href="/">
            Back to Home
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
