<template>
	<div class="MapTableMainColumnHeader">
		<MapTableMainColumnHeaderDetails
			:activator-text="orderWords[ordinalNumber]"
			:items="columnData"
		/>
	</div>
</template>

<script>
import orderWords from '@utils/orderWords'
import MapTableMainColumnHeaderDetails from '@components/Map/MapTable/MapTableMainColumnHeaderDetails.vue'

export default {
	name: 'MapTableMainColumnHeader',
	components: { MapTableMainColumnHeaderDetails },

	props: {
		ordinalNumber: {
			type: Number,
			default: null,
		},

		columnData: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({ orderWords }),
}
</script>

<style lang="sass">
.MapTableMainColumnHeader
    display: flex
    justify-content: center
    margin-bottom: 6px

    &__order
        margin-right: 8px
</style>
