<template>
	<div ref="form" class="MapRightMenuValueMainForm">
		<MapRightMenuValueMainFormRow
			v-for="(type, i) in values"
			:key="i"
			:item="type"
			:index="i"
			@updateValue="onUpdateValue"
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
		onUpdateValue({ index, value }) {
			this.$emit('updateValue', { index, value })
		},

		onUpdateUnitOfMeasurement({ index }) {
			const value = this.values[index]

			const id_edizm = (value.id_edizm % 2) + 1

			const amount =
				value.id_edizm === 1
					? this.MapsService.convertHoursToZet(value.amount, value.id_edizm) /
					  this.MapsService.WEEKQUEALSZET
					: this.MapsService.convertHoursToZet(value.amount, value.id_edizm) *
					  this.MapsService.ZETQUEALSHOURS

			const newValue = Object.assign(value, {
				id_edizm,
				amount,
			})

			console.log(id_edizm, amount)

			this.$emit('updateValue', { index, value: newValue })
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
