<template>
	<div class="MapRightMenuValueMainFormRow">
		<div class="MapRightMenuValueMainFormRow__header">
			<div class="MapRightMenuValueMainFormRow__label">
				{{ getControlTypesLabel(item.control_type_id) }}
			</div>

			<div
				v-if="isIndependentWork"
				class="MapRightMenuValueMainFormRow__hint-independent"
			>
				<MHint :top="false" maxWidth="200px" bottom>
					<div>
						Настройка значений у этого поля ограничена. Остаток суммы будет
						автоматически назначаться в СРС
					</div>
				</MHint>
			</div>
		</div>

		<div class="MapRightMenuValueMainFormRow__input-row">
			<v-text-field
				:value="hours"
				:rules="rules"
				:disabled="isIndependentWork"
				:label="isWeekAmount ? 'Недели' : 'Часы'"
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

		<v-checkbox
			v-if="!isIndependentWork"
			:input-value="isWeekAmount"
			:disabled="isIndependentWork"
			class="MapRightMenuValueMainFormRow__week-checkbox"
			hide-details
			dense
			@change="onUpdateUnitOfMeasurement(index)"
		>
			<template #label>
				<div class="MapRightMenuValueMainFormRow__week-checkbox-label">
					Измерять в неделях
				</div>
			</template>
		</v-checkbox>
	</div>
</template>

<script>
import MHint from '@components/common/MHint.vue'

import { ValueAmountTypeEnum } from '@models/Maps/IMapItemValueRaw'
import MapsService from '@services/Maps/MapsService'

import _ from 'lodash'

export default {
	name: 'MapRightMenuValueMainFormRow',
	components: { MHint },

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
				let amount = this.item.amount

				return this.MapsService.convertHoursToZet(
					amount,
					this.unitOfMeasurement
				)
			},
		},

		unitOfMeasurement() {
			return this.item.amount_type
		},

		/* СРС (Самостоятельная работа) */
		isIndependentWork() {
			return this.item.control_type_id === 4
		},

		isWeekAmount() {
			return this.unitOfMeasurement === ValueAmountTypeEnum.WEEK
		},
	},

	methods: {
		onInputHours(index, hours) {
			const isValid = this.$refs.hours.validate()
			if (isValid) {
				const value = Object.assign(this.item, {
					amount: +hours,
				})

				this.$emit('updateValue', { index, value })
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
    &__header
        display: flex
        align-items: center

    &__hint-independent
        display: flex
        align-items: center
        margin-left: 8px
        margin-bottom: 2px

    &__label
        font-size: 16px

    &__input-row
        margin-top: 4px
        display: grid
        grid-template-columns: 1fr 1fr
        grid-template-rows: 1fr
        gap: 8px

    &__week-checkbox
        margin-top: 0

    &__week-checkbox-label
        font-size: 14px

    /* Затираем vuetify стили у ошибки */
    .v-text-field.v-text-field--enclosed .v-text-field__details
        margin-bottom: 0px !important

    .v-text-field.v-input--is-disabled
        .v-input__control
            & > .v-text-field__details
                & > .v-messages
                    color: #FF5252 !important
</style>
