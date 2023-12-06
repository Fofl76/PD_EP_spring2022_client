<template>
	<div class="MapRightMenuValueSumForm">
		<v-text-field
			:value="sumHours"
			label="Сумма часов"
			type="number"
			hide-details
			dense
			filled
			dark
			@input="onInput($event, 'hours')"
		/>

		<v-text-field
			:value="sumZet"
			label="Сумма ЗЕТ"
			type="number"
			hide-details
			dense
			filled
			dark
			@input="onInput($event, 'zet')"
		/>
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

export default {
	name: 'MapRightMenuValueSumForm',

	props: {
		values: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({
		MapsService,
	}),

	computed: {
		sumHours() {
			return this.getSumHours()
		},

		residualSumHours() {
			return this.getSumHours()
		},

		sumZet() {
			return this.MapsService.convertHoursToZet(this.sumHours)
		},
	},

	methods: {
		/* Подсчет суммы с/без учетом СРС. control_type_id = 4 === 'СРС' */
		getSumHours(withoutIndependentWork = false) {
			return this.values.reduce((accumulator, currentValue) => {
				if (withoutIndependentWork && currentValue.control_type_id === 4)
					return accumulator

				const hours =
					currentValue.id_edizm === 1
						? currentValue.amount
						: currentValue.amount * this.MapsService.WEEKQUEALSHOURS

				return accumulator + hours
			}, 0)
		},

		onInput(value, type) {
			if (type === 'zet') value = this.MapsService.convertZetToHours(value)
			/* Высчитываем остаток суммы часов/зет, чтобы назначить их СРС */
			const hours = value - this.getSumHours(true)

			this.$emit('input', hours)
		},

		onInputZet(zet) {
			console.log(zet)
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueSumForm
    margin: 8px 0
    display: grid
    grid-template-columns: 1fr 1fr
    grid-template-rows: 1fr
    gap: 8px
</style>
