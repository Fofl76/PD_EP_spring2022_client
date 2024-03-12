<template>
	<v-app-bar app class="MapHeader" height="80" dark clipped-right>
		<MapHeaderSelectBlock />

		<v-spacer />

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

<style lang="sass">
.MapHeader
    .v-toolbar__content
        padding: 8px 16px !important

    &__divider
        margin: 0 4px
</style>
