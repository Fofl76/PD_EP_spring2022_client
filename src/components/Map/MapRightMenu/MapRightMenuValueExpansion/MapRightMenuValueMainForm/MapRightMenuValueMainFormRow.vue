<template>
	<div class="MapRightMenuValueMainFormRow">
		<div class="MapRightMenuValueMainForm__label">
			{{ getControlTypesLabel(item.control_type_id) }}
		</div>

		<div class="MapRightMenuValueMainFormRow__input-block">
			<div class="MapRightMenuValueMainFormRow__input-row">
				<v-text-field
					:value="hours"
					:rules="rules"
					:disabled="isIndependentWork"
					label="Часы"
					type="number"
					ref="hours"
					:hide-details="'auto'"
					dense
					filled
					dark
					@input="onInputHours(index, $event)"
				/>

				<v-text-field
					:value="zet"
					:rules="rules"
					:disabled="isIndependentWork"
					label="ЗЕТ"
					:min="1"
					:max="10"
					type="number"
					ref="zet"
					:hide-details="'auto'"
					dense
					filled
					dark
					@input="onInputZet"
				/>
			</div>
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

import _ from 'lodash'

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
	},

	data: () => ({
		MapsService,

		rules: [
			v => !!String(v).length || 'Значение должно быть числом',
			v => +v >= 0 || 'Значение должно быть неотрицательным',
		],
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
		onInputHours(index, hours) {
			const isValid = this.$refs.hours.validate()
			if (isValid) {
				const value = Object.assign(this.item, {
					amount: +hours,
				})

				this.$emit('inputHours', { index, value })
			}
		},

		onInputZet(value) {
			const isValid = this.$refs.zet.validate()
			if (isValid) this.zet = value
		},

		onUpdateUnitOfMeasurement(index) {
			this.$emit('updateUnitOfMeasurement', { index })
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueMainFormRow

    &__input-block
        margin: 8px 0

    &__input-row
        display: grid
        grid-template-columns: 1fr 1fr
        grid-template-rows: 1fr
        gap: 8px

    /* Затираем vuetify стили у ошибки */
    .v-text-field.v-text-field--enclosed .v-text-field__details
        margin-bottom: 0px !important

    .v-text-field.v-input--is-disabled
        .v-input__control
            & > .v-text-field__details
                & > .v-messages
                    color: #FF5252 !important
</style>
