<template>
	<div class="MapHeaderDropdown">
		<v-menu
			offset-y
			nudge-bottom="8"
			:value="value"
			@input="$emit('input', $event)"
		>
			<template #activator="{ on, attrs }">
				<slot name="activator" :on="on" :attrs="attrs">
					<v-btn
						v-bind="attrs"
						:disabled="disabled"
						:loading="loading"
						text
						dark
						icon
						v-on="on"
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

<style lang="scss">
.MapHeaderDropdown {
	height: 100%;
}

.MapHeaderDropdownListItem {
	cursor: pointer;

	&--active {
		background: #171717;
	}
}
</style>
