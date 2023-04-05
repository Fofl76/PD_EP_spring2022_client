<template>
	<v-tooltip class="MHint" top>
		<template v-slot:activator="{ on, attrs }">
			<v-btn class="MHintActivator" icon v-bind="attrs" v-on="on">
				<v-icon color="grey lighten-1" :size="size" dense>{{ icon }}</v-icon>
			</v-btn>
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
			default: 'mdi-help',
		},

		tooltipText: {
			type: String,
			default: null,
		},

		size: {
			type: [String, Number],
			default: 16,
		},
	},
}
</script>

<style></style>
