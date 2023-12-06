<template>
	<div ref="form" class="MapRightMenuValueMainForm">
		<MapRightMenuValueMainFormRow
			v-for="(type, i) in values"
			:key="i"
			:item="type"
			:index="i"
			@inputHours="onInputHours"
			@updateUnitOfMeasurement="onUpdateUnitOfMeasurement"
		/>
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import MapRightMenuValueMainFormRow from './MapRightMenuValueMainFormRow.vue'

export default {
	name: 'MapRightMenuValueMainForm',
	components: { MapRightMenuValueMainFormRow },

	data: () => ({
		MapsService,
	}),

	props: {
		values: {
			type: Array,
			default: () => [],
		},
	},

	methods: {
		onInputHours({ index, value }) {
			this.$emit('updateValue', { index, hours: +value })
		},

		onUpdateUnitOfMeasurement({ index }) {
			const currentValue = this.values[index]

			const id_edizm = (currentValue.id_edizm % 2) + 1

			const hours =
				currentValue.id_edizm === 1
					? currentValue.zet / this.MapsService.WEEKQUEALSZET
					: currentValue.zet * this.MapsService.ZETQUEALSHOURS

			this.$emit('updateUnitOfMeasurement', { index, id_edizm, hours })
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueMainForm
    margin-bottom: 8px

    .MapRightMenuValueMainFormRow
        &:not(:last-child)
            margin-bottom: 16px

    &__week-checkbox
        margin-top: 0

    &__week-checkbox-label
        font-size: 14px
</style>
