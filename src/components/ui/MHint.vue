<template>
	<v-tooltip class="MHint" top>
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

		<span>{{ tooltipText }}</span>
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
</style>
