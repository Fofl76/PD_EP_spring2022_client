<template>
	<div class="MapHeaderDropdown">
		<v-menu offset-y :value="value">
			<template v-slot:activator="{ on, attrs }">
				<slot name="activator">
					<v-btn v-bind="attrs" v-on="on" text dark icon>
						<v-icon v-if="icon" dark>{{ icon }}</v-icon>
					</v-btn>
				</slot>
			</template>
			<v-list class="MapHeaderDropdown__list" dark>
				<slot />
			</v-list>
		</v-menu>
	</div>
</template>

<script>
export default {
	name: 'MapHeaderDropdown',

	props: {
		value: {
			type: Boolean,
		},

		icon: {
			type: String,
			default: null,
		},
	},
}
</script>

<style lang="sass" scoped>
.MapHeaderDropdown
    &__list
        display: flex
        flex-direction: column
        gap: 8px

        & > *
            width: 100%
</style>
