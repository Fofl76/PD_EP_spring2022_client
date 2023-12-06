<template>
	<div class="MapRightMenuValueMainFormRow">
		<div class="MapRightMenuValueMainForm__label">
			{{ getControlTypesLabel(item.control_type_id) }}
		</div>

		<div class="MapRightMenuValueMainForm__input-row">
			<v-text-field
				:value="hours"
				:rules="hoursRules"
				:disabled="isIndependentWork"
				label="Часы"
				type="number"
				ref="zet"
				hide-details
				dense
				filled
				dark
				@input="onInputHours(index, $event)"
			/>

			<v-text-field
				:value="zet"
				:rules="zetRules"
				:disabled="isIndependentWork"
				label="ЗЕТ"
				:min="1"
				:max="10"
				type="number"
				ref="zet"
				hide-details
				dense
				filled
				dark
				@input="onInputZet"
			/>
		</div>

		<v-checkbox
			:value="unitOfMeasurement === 2"
			:disabled="isIndependentWork"
			class="MapRightMenuValueMainForm__week-checkbox"
			hide-details
			dense
			@change="onUpdateUnitOfMeasurement(index)"
		>
			<template #label>
				<div class="MapRightMenuValueMainForm__week-checkbox-label">
					Измерять в неделях
				</div>
			</template>
		</v-checkbox>
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

export default {
	name: 'MapRightMenuValueMainFormRow',

	props: {
		item: {
			type: Object,
			default: () => ({}),
		},

		index: {
			type: Number,
			default: null,
		},

		hoursRules: {
			type: Array,
			default: () => [],
		},

		zetRules: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({
		MapsService,
	}),

	computed: {
		/* Получение названия типа объема */
		getControlTypesLabel() {
			return control_id => {
				return this.MapsService.controlTypes.value.find(
					item => item.id === control_id
				)?.name
			}
		},

		hours() {
			return this.item.amount
		},

		zet: {
			set(newZet) {
				const hours = this.MapsService.convertZetToHours(
					newZet,
					this.unitOfMeasurement
				)
				this.onInputHours(this.index, hours)
			},

			get() {
				const hours = this.item.amount
				return this.MapsService.convertHoursToZet(hours, this.unitOfMeasurement)
			},
		},

		unitOfMeasurement() {
			return this.item.id_edizm
		},

		/* СРС (Самостоятельная работа) */
		isIndependentWork() {
			return this.item.control_type_id === 4
		},
	},

	methods: {
		onInputHours(index, value) {
			this.$emit('inputHours', { index, value })
		},

		onInputZet(value) {
			this.zet = value
		},

		onUpdateUnitOfMeasurement(index) {
			this.$emit('updateUnitOfMeasurement', { index })
		},
	},
}
</script>

<style lang="sass"></style>
