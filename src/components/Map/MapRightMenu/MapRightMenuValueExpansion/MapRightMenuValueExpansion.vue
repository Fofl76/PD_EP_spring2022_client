<template>
	<MapRightMenuExpansion class="MapRightMenuValueExpansion">
		<template #header>
			<div class="MapRightMenuValueExpansion__header">
				<div class="MapRightMenuValueExpansion__label">Настройка объема</div>

				<v-icon v-if="!isValid" size="24" dark color="red" text-color="white">
					mdi-alert-circle
				</v-icon>
			</div>
		</template>

		<template>
			<v-form
				class="MapRightMenuValueExpansion__content"
				v-model="isValid"
				@input="onInputError"
			>
				<div class="MapRightMenuValueExpansion__values-wrapper">
					<MapRightMenuValueMainForm
						:values="values"
						@updateValue="onUpdateValue"
						@updateUnitOfMeasurement="onUpdateUnitOfMeasurement"
					/>

					<v-divider dark class="MapRightMenu__divider" />

					<div class="MapRightMenuValueExpansion__sum-wrapper">
						<MapRightMenuValueSumForm
							v-if="hasIndependentWorkValue"
							label="Сумма"
							:values="values"
							:item="item"
							@input="onInputSums"
						/>

						<MapRightMenuValueSumForm
							:label="hasIndependentWorkValue ? 'Сумма без СРС' : 'Сумма'"
							:values="values"
							:item="item"
							withoutIndependentWork
						/>
					</div>

					<MapRightMenuValueLoadForm
						:values="values"
						@selectControlTypes="onSelectControlTypes"
					/>
				</div>
			</v-form>
		</template>
	</MapRightMenuExpansion>
</template>

<script>
import MapRightMenuExpansion from '@components/Map/MapRightMenu/common/MapRightMenuExpansion.vue'
import MapRightMenuValueMainForm from './MapRightMenuValueMainForm/MapRightMenuValueMainForm.vue'
import MapRightMenuValueSumForm from './MapRightMenuValueSumForm.vue'
import MapRightMenuValueLoadForm from './MapRightMenuValueLoadForm.vue'

import MapsService from '@services/Maps/MapsService'

export default {
	name: 'MapRightMenuValueExpansion',
	components: {
		MapRightMenuExpansion,
		MapRightMenuValueMainForm,
		MapRightMenuValueSumForm,
		MapRightMenuValueLoadForm,
	},

	props: {
		values: {
			type: Array,
			default: () => [],
		},

		item: {
			type: Object,
			default: () => ({}),
		},
	},

	data: () => ({
		MapsService,

		isValid: true,
	}),

	computed: {
		independentWorkValue() {
			return this.values.find(value => value.control_type_id === 4)
		},

		hasIndependentWorkValue() {
			return !!this.independentWorkValue
		},
	},

	methods: {
		onUpdateValue({ index, value }) {
			this.$emit('updateValue', { index, value })
		},

		onSelectControlTypes(values) {
			this.$emit('selectControlTypes', values)
		},

		onUpdateUnitOfMeasurement(data) {
			this.$emit('updateUnitOfMeasurement', data)
		},

		onInputSums(hours) {
			/* control_type_id 4 === 'СРС' */
			const independentWorkValueIndex = this.values.findIndex(
				value => value.control_type_id === 4
			)
			const independentWorkValue = this.values[independentWorkValueIndex]

			/* Изменяем СРС, добавляя к нему лишний остаток от суммы */
			this.onUpdateValue({
				index: independentWorkValueIndex,
				value: Object.assign(independentWorkValue, { amount: hours }),
			})
		},

		onInputError(value) {
			this.$emit('inputError', !value)
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueExpansion
    &__header
        display: flex
        align-items: center
        justify-content: space-between
        margin-right: 8px

    &__sum-wrapper
        margin: 12px 0
        display: flex
        flex-direction: column
        gap: 12px
</style>
