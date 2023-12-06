<template>
	<div class="MapHeaderDropdown">
		<v-menu
			offset-y
			nudge-bottom="5"
			:value="value"
			@input="$emit('input', $event)"
		>
			<template v-slot:activator="{ on, attrs }">
				<slot name="activator">
					<v-btn
						v-bind="attrs"
						v-on="on"
						:disabled="disabled"
						:loading="loading"
						text
						dark
						icon
					>
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

		disabled: {
			type: Boolean,
			default: false,
		},

		loading: {
			type: Boolean,
			default: false,
		},
	},
}
</script>

<style lang="sass">
.MapHeaderDropdown
    &__list
        display: flex
        flex-direction: column
        gap: 8px

        & > *
            width: 100%

.MapHeaderDropdownListItem
    cursor: pointer
</style>
