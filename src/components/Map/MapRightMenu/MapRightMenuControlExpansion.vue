<template>
	<MapRightMenuExpansion class="MapRightMenuControlExpansion">
		<template #header>
			<div class="MapRightMenuControlExpansion__header">
				<div>Настройки контроля</div>
			</div>
		</template>

		<template>
			<div class="MapRightMenuControlExpansion__content">
				<v-radio-group
					:value="currentControlTypeId"
					@change="onChange"
					hide-details="auto"
				>
					<v-radio
						v-for="control in allControlTypes"
						:key="control.id"
						:label="`${control.name}`"
						:value="control.id"
					>
						{{ control.name }}
					</v-radio>
				</v-radio-group>
			</div>
		</template>
	</MapRightMenuExpansion>
</template>

<script>
import MapRightMenuExpansion from './MapRightMenuExpansion.vue'

export default {
	name: 'MapRightMenuControlExpansion',
	components: { MapRightMenuExpansion },

	props: {
		currentControlTypeId: {
			type: Number,
			default: null,
		},

		allControlTypes: {
			type: Array,
			default: () => [],
		},
	},

	methods: {
		onChange(value) {
			this.$emit('changeControlType', value)
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuControlExpansion
    .v-input--selection-controls
        margin-top: 0 !important
</style>
