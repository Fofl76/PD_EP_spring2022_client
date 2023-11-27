<template>
	<div class="MapRightMenuValueMainForm">
		<div
			class="MapRightMenuValueMainForm__row"
			v-for="(type, i) in values"
			:key="i"
		>
			<div class="MapRightMenuValueMainForm__label">
				{{ getControlTypesLabel(type.control_type_id) }}
			</div>

			<div class="MapRightMenuValueMainForm__input-row">
				<v-text-field
					:value="type.amount"
					:rules="hoursRules"
					label="Часы"
					type="number"
					ref="zet"
					hide-details
					dense
					filled
					dark
					@input="onInputHours(i, $event)"
				/>

				<v-text-field
					:value="type.zet"
					:rules="zetRules"
					label="ЗЕТ"
					:min="1"
					:max="10"
					type="number"
					ref="zet"
					hide-details
					dense
					filled
					dark
					@input="onInputZet(i, $event)"
				/>
			</div>

			<v-checkbox
				:value="type.id_edizm === 2"
				class="MapRightMenuValueMainForm__week-checkbox"
				hide-details
				dense
				@change="onUpdateUnitOfMeasurement(i)"
			>
				<template #label>
					<div class="MapRightMenuValueMainForm__week-checkbox-label">
						Измерять в неделях
					</div>
				</template>
			</v-checkbox>
		</div>
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

export default {
	name: 'MapRightMenuValueMainForm',

	data: () => ({
		MapsService,

		zetRules: [
			v => !!String(v).length || 'Это поле является обязательным',
			v => +v >= 0 || 'Значение должно быть больше, либо равно 0',
			v => +v <= 10 || 'Значение должно быть меньше, либо равно 10',
		],

		hoursRules: [
			v => !!String(v).length || 'Это поле является обязательным',
			v => +v >= 0 || 'Значение должно быть больше 0, либо равно 0',
			v => +v <= 320 || 'Значение должно быть меньше, либо равно 320',
		],
	}),

	props: {
		values: {
			type: Array,
			default: () => [],
		},
	},

	computed: {
		getControlTypesLabel() {
			return control_id => {
				return this.MapsService.controlTypes.value.find(
					item => item.id === control_id
				)?.name
			}
		},
	},

	methods: {
		onInputHours(index, value) {
			const hours = +value
			const zet = this.calculateZet(hours, this.values[index].id_edizm)

			this.$emit('updateValue', { index, hours, zet })
		},

		onInputZet(index, value) {
			const zet = +value
			const hours = this.calculateHours(zet, this.values[index].id_edizm)

			this.$emit('updateValue', { index, hours, zet })
		},

		calculateZet(hours, id_edizm) {
			if (id_edizm === 2) return hours * this.MapsService.WEEKQUEALSZET
			return hours / this.MapsService.ZETQUEALSHOURS
		},

		calculateHours(zet, id_edizm) {
			if (id_edizm === 2) return zet / this.MapsService.WEEKQUEALSZET
			return zet * this.MapsService.ZETQUEALSHOURS
		},

		onUpdateUnitOfMeasurement(index) {
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

    &__row
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
