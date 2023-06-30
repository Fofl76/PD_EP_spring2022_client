<template>
	<v-app-bar app class="MapHeader" height="80" dark clipped-right>
		<MapHeaderSelectBlock />

		<v-spacer></v-spacer>

		<MapHeaderControls />
	</v-app-bar>
</template>

<script>
import MapHeaderSelectBlock from '@components/Map/MapHeader/MapHeaderSelectBlock.vue'
import MapHeaderControls from '@components/Map/MapHeader/MapHeaderControls.vue'

export default {
	name: 'MapHeader',

	components: {
		MapHeaderSelectBlock,
		MapHeaderControls,
	},
}
</script>
