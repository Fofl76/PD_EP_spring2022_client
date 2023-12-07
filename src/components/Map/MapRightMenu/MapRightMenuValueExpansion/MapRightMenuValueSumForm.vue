<template>
	<div class="MapRightMenuValueSumForm">
		<div class="MapRightMenuValueSumForm__row">
			<v-text-field
				:value="sumHours"
				:rules="rules"
				:disabled="!hasIndependentWorkValue"
				label="Сумма часов"
				type="number"
				ref="hours"
				hide-details="auto"
				dense
				filled
				dark
				@input="onInput($event, 'hours')"
			/>

			<v-text-field
				:value="sumZet"
				:rules="rules"
				:disabled="!hasIndependentWorkValue"
				label="Сумма ЗЕТ"
				type="number"
				ref="zet"
				hide-details="auto"
				dense
				filled
				dark
				@input="onInput($event, 'zet')"
			/>
		</div>
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import { ValueAmountTypeEnum } from '@models/Maps/IMapItemValueRaw'

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
		// Остаток суммы для назначения СРС, используем только
		// для отображения ошибки если он стал меньше нуля
		independentWorkValue() {
			return this.values.find(value => value.control_type_id === 4)
		},

		hasIndependentWorkValue() {
			return !!this.independentWorkValue
		},

		residualHours() {
			// control_type_id 4 === 'СРС'
			return this.independentWorkValue?.amount
		},

		sumHours() {
			return this.getSumHours()
		},

		sumZet() {
			return this.MapsService.convertHoursToZet(this.sumHours)
		},

		rules() {
			return [
				v => !!String(v).length || 'Значение должно быть числом',
				v => +v >= 0 || 'Значение должно быть неотрицательным',
				/* () => this.residualHours >= 0 || 'Часы/ЗЕТ у СРС вышли отрицательными', */
			]
		},
	},

	methods: {
		/* Подсчет суммы с/без учетом СРС. control_type_id = 4 === 'СРС' */
		getSumHours(withoutIndependentWork = false) {
			return this.values.reduce((accumulator, currentValue) => {
				if (withoutIndependentWork && currentValue.control_type_id === 4)
					return accumulator

				const hours =
					currentValue.amount_type === ValueAmountTypeEnum.HOUR
						? currentValue.amount
						: currentValue.amount * this.MapsService.WEEKQUEALSHOURS

				return accumulator + hours
			}, 0)
		},

		onInput(value, type) {
			if (type === 'hours' && !this.$refs.hours.validate()) return
			if (type === 'zet' && !this.$refs.zet.validate()) return

			/* Если изменился ЗЕТ, то конвертируем в часы и работаем как и с часами */
			if (type === 'zet') value = this.MapsService.convertZetToHours(value)

			/* Высчитываем остаток суммы часов/зет, чтобы назначить их СРС */
			let hours = value - this.getSumHours(true)

			this.$emit('input', hours)
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueSumForm
    margin: 8px 0

    &__row
        display: grid
        grid-template-columns: 1fr 1fr
        grid-template-rows: 1fr
        gap: 8px
</style>
