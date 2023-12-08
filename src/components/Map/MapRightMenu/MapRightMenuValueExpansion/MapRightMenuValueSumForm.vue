<template>
	<div class="MapRightMenuValueSumForm">
		<div class="MapRightMenuValueSumForm__label">{{ label }}</div>

		<div class="MapRightMenuValueSumForm__row">
			<v-text-field
				:value="sumHours"
				:rules="rules"
				:disabled="disabled"
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
				:disabled="disabled"
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

export default {
	name: 'MapRightMenuValueSumForm',

	props: {
		label: {
			type: String,
			default: 'Сумма',
		},

		values: {
			type: Array,
			default: () => [],
		},

		item: {
			type: Object,
			default: () => ({}),
		},

		withoutIndependentWork: {
			type: Boolean,
			default: false,
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
			return this.getSumHours(this.item, this.withoutIndependentWork)
		},

		sumZet() {
			return this.MapsService.convertHoursToZet(this.sumHours)
		},

		/* Редактирование выключено если нету СРС или подсчет суммы идет без СРС */
		disabled() {
			return !this.independentWorkValue || this.withoutIndependentWork
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
		getSumHours(item, withoutIndependentWork) {
			return this.MapsService.getSumLoadsByItem(item, withoutIndependentWork)
		},

		onInput(value, type) {
			if (type === 'hours' && !this.$refs.hours.validate()) return
			if (type === 'zet' && !this.$refs.zet.validate()) return

			/* Если изменился ЗЕТ, то конвертируем в часы и работаем как и с часами */
			if (type === 'zet') value = this.MapsService.convertZetToHours(value)

			/* Высчитываем остаток суммы часов/зет, чтобы назначить их СРС */
			let hours = value - this.getSumHours(this.item, true)

			this.$emit('input', hours)
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueSumForm
    &__row
        margin-top: 4px
        display: grid
        grid-template-columns: 1fr 1fr
        grid-template-rows: 1fr
        gap: 8px

    &__label
        font-size: 16px
</style>
