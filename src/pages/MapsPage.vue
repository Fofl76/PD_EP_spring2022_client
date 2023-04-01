<template>
	<v-app>
		<div class="Home">
			<home-header v-if="false" :aupCode="'aupCode'" />
      <test />
		</div>
	</v-app>
</template>

<script lang="ts">
import HomeHeader from '../components/HomeHeader.vue'
import Vue from 'vue'
import MapsService from '@services/Maps/MapsService'
import Test from '@components/test.vue'

export default Vue.extend({
	name: 'HomeView',
	components: {
		HomeHeader,
    Test
	},
	data() {
		return {
			mapsService: MapsService,
		}
	},
	async created() {
		await this.mapsService.fetchMapList()
	},
})
</script>
