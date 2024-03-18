<template>
	<v-tooltip class="MHint" top v-bind="$attrs">
		<template #activator="{ on, attrs }">
			<div v-bind="attrs" v-on="on">
				<slot name="activator">
					<v-icon
						class="MHint-icon"
						:class="[contentClass]"
						color="grey lighten-1"
						:size="size"
						dense
						v-bind="attrs"
						v-on="on"
					>
						{{ icon }}
					</v-icon>
				</slot>
			</div>
		</template>

		<div class="MHint__content" :style="{ maxWidth }">
			<slot>
				<span>{{ tooltipText }}</span>
			</slot>
		</div>
	</v-tooltip>
</template>

<script>
export default {
	name: 'MHint',

	props: {
		icon: {
			type: String,
			default: 'mdi-information',
		},

		tooltipText: {
			type: String,
			default: null,
		},

		size: {
			type: [String, Number],
			default: 16,
		},

		contentClass: {
			type: String,
			default: '',
		},

		maxWidth: {
			type: String,
			default: '400px',
		},
	},
}
</script>

<style lang="sass">
.MHint
    $tooltip-opacity: 1

    &-icon
        cursor: pointer
</style>
