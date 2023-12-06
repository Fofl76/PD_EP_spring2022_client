<template>
	<div class="MapRightMenuValueMainForm">
		<MapRightMenuValueMainFormRow
			v-for="(type, i) in values"
			:key="i"
			:item="type"
			:index="i"
			:hourRules="hoursRules"
			:zetRules="zetRules"
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

		zetRules: [
			v => !!String(v).length || 'Это поле является обязательным',
			v => +v >= 0 || 'Значение должно быть больше, либо равно нулю',
			v => +v <= 10 || 'Значение должно быть меньше, либо равно 10',
		],

		hoursRules: [
			v => !!String(v).length || 'Это поле является обязательным',
			v => +v >= 0 || 'Значение должно быть больше нуля, либо равно нулю',
			v => +v <= 320 || 'Значение должно быть меньше, либо равно 320',
		],
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

    &__input-row
        margin: 8px 0
        display: grid
        grid-template-columns: 1fr 1fr
        grid-template-rows: 1fr
        gap: 8px

    &__week-checkbox
        margin-top: 0

    &__week-checkbox-label
        font-size: 14px
</style>
