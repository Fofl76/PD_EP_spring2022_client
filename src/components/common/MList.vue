<template>
  <v-list-item
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-list-item-icon class="mr-1">
      <v-icon
        size="medium"
        :color="color"
        >mdi-circle</v-icon
      >
    </v-list-item-icon>
    <v-list-item-content>
      {{ text }}
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: null,
    },
    text: {
      type: String,
      required: true,
    },
  }
}
</script>

<style>
</style>