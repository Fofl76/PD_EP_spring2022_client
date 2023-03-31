<template>
  <v-app>
    <div
			class="Home"
		>
			<home-header
				:tableReady="false"
				:aupCode="'aupCode'"
			/>
    </div>
  </v-app>
</template>

<script lang="ts">
import HomeHeader from '../components/HomeHeader.vue'
import Vue from "vue";
import MapService from '../services/service/MapService'

export default Vue.extend({
  name: "HomeView",
  components: {
    HomeHeader,
  },
  data() {
    return {
      mapService: MapService,
    }
  },
  async created() {
    await this.mapService.fetchMapList()
  }
});
</script>
