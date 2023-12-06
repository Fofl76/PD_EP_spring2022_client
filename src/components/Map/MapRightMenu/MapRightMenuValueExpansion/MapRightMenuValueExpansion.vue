<template>
	<MapRightMenuExpansion class="MapRightMenuValueExpansion">
		<template #header>
			<div class="MapRightMenuValueExpansion__header">Настройка объема</div>
		</template>

		<template>
			<div class="MapRightMenuValueExpansion__content">
				<div class="MapRightMenuValueExpansion__values-wrapper">
					<MapRightMenuValueMainForm
						:values="values"
						@updateValue="onUpdateValue"
						@updateUnitOfMeasurement="onUpdateUnitOfMeasurement"
					/>

					<v-divider dark class="MapRightMenu__divider" />

					<MapRightMenuValueSumForm :values="values" @input="onInputSums" />

					<MapRightMenuValueLoadForm
						:values="values"
						@selectControlTypes="onSelectControlTypes"
					/>
				</div>
			</div>
		</template>
	</MapRightMenuExpansion>
</template>

<script>
import MapRightMenuExpansion from '../MapRightMenuExpansion.vue'
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
	},

	data: () => ({
		MapsService,
	}),

	computed: {},

	methods: {
		onUpdateValue({ index, hours }) {
			this.$emit('updateValue', { index, hours })
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

			this.onUpdateValue({
				index: independentWorkValueIndex,
				hours: hours,
			})
		},
	},
}
</script>

<style lang="sass"></style>
