<template>
  <div>
    {{ mapList }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MapService from '../services/service/MapService'

export default Vue.extend({
  name: "HomeView",
  components: {},
  data() {
    return {
      mapList: MapService,
    }
  },
});
</script>

<style>

</style>