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
					class="MapRightMenuControlExpansion__radio-group"
					:value="currentControlTypeId"
					@change="onChange"
					hide-details="auto"
				>
					<v-radio
						class="MapRightMenuControlExpansion__radio"
						v-for="control in allControlTypes"
						:key="control.id"
						:value="control.id"
					>
						<template #label>
							<div class="MapRightMenuControlExpansion__label">
								{{ control.name }}
							</div>
						</template>
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
    &__radio-group
        .v-input--radio-group__input
            gap: 8px

    &__label
        margin-left: 8px

    .v-input--selection-controls
        margin-top: 0 !important
</style>
