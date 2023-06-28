<template>
	<v-tooltip
		class="MHint"
		top
		v-bind="$attrs"
		content-class = "MHint-tooltip"
	>
		<template v-slot:activator="{ on, attrs }">
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
		</template>
		<slot>
			<span>{{ tooltipText }}</span>
		</slot>
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
	},
}
</script>

<style lang="sass">
.MHint
    &-icon
        cursor: pointer
    &-tooltip
        background: rgba(97,97,97,1)
        opacity: 1 !important
</style>
