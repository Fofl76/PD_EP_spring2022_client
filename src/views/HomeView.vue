<template>
	<v-app>
		<div class="Home">
			<home-header :tableReady="false" :aupCode="'aupCode'" />
		</div>
	</v-app>
</template>

<script lang="ts">
import HomeHeader from '../components/HomeHeader.vue'
import Vue from 'vue'
import MapsService from '@services/Maps/MapsService'

export default Vue.extend({
	name: 'HomeView',
	components: {
		HomeHeader,
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
