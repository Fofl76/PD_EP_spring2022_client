<template>
	<v-app-bar app class="MapHeader" height="80" dark clipped-right>
		<MapHeaderSelectBlock />

		<v-spacer></v-spacer>

		<MapHeaderControls />
	</v-app-bar>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import MapHeaderSelectBlock from '@components/Map/MapHeader/MapHeaderSelectBlock.vue'
import MapHeaderControls from '@components/Map/MapHeader/MapHeaderControls.vue'

export default {
	name: 'MapHeader',

	components: {
		MapHeaderSelectBlock,
		MapHeaderControls,
	},

	computed: {
		isReady() {
			return !!MapsService.mapList.value.length
		},

		aupCode() {
			return this.$route.query.aup
		},

		downloadURL() {
			return `${process.env.VUE_APP_API}/save_excel/${this.aupCode}`
		},
	},
}
</script>

<style lang="sass">
.MapHeader
</style>
