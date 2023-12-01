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

					<MapRightMenuValueSumForm :hours="sumHours" :zet="sumZet" />

					<v-divider dark class="MapRightMenu__divider" />

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
import MapRightMenuValueMainForm from './MapRightMenuValueMainForm.vue'
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

	computed: {
		sumHours() {
			return this.values.reduce((accumulator, currentValue) => {
				if (currentValue.id_edizm === 1) {
					return accumulator + currentValue.amount
				} else {
					return (
						accumulator + currentValue.amount * this.MapsService.WEEKQUEALSHOURS
					)
				}
			}, 0)
		},

		sumZet() {
			return this.values.reduce((accumulator, currentValue) => {
				return accumulator + currentValue.zet
			}, 0)
		},
	},

	methods: {
		onUpdateValue({ index, hours, zet }) {
			this.$emit('updateValue', { index, hours, zet })
		},

		onSelectControlTypes(values) {
			this.$emit('selectControlTypes', values)
		},

		onUpdateUnitOfMeasurement(data) {
			this.$emit('updateUnitOfMeasurement', data)
		},
	},
}
</script>

<style lang="sass"></style>
