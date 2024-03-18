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
import MapRightMenuValueMainFormRow from './MapRightMenuValueMainFormRow.vue'

import { ValueAmountTypeEnum } from '@models/Maps/IMapItemValueRaw'

import MapsService from '@services/Maps/MapsService'

export default {
	name: 'MapRightMenuValueMainForm',
	components: { MapRightMenuValueMainFormRow },

	props: {
		values: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({
		MapsService,
	}),

	methods: {
		onUpdateValue({ index, value }) {
			this.$emit('updateValue', { index, value })
		},

		onUpdateUnitOfMeasurement({ index }) {
			const value = this.values[index]

			const amount_type =
				value.amount_type === ValueAmountTypeEnum.HOUR
					? ValueAmountTypeEnum.WEEK
					: ValueAmountTypeEnum.HOUR

			const amount =
				value.amount_type === ValueAmountTypeEnum.HOUR
					? this.MapsService.convertHoursToZet(
							value.amount,
							value.amount_type,
						) / this.MapsService.WEEKQUEALSZET
					: this.MapsService.convertHoursToZet(
							value.amount,
							value.amount_type,
						) * this.MapsService.ZETQUEALSHOURS

			const newValue = Object.assign(value, {
				amount_type,
				amount,
			})

			this.$emit('updateValue', { index, value: newValue })
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueMainForm
    margin-bottom: 12px

    .MapRightMenuValueMainFormRow
        &:not(:last-child)
            margin-bottom: 12px
</style>
