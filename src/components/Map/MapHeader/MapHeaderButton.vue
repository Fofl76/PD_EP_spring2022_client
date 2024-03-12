<template>
	<v-btn
		class="MapHeaderButton"
		:loading="loading"
		:disabled="disabled"
		:outlined="outlined"
		height="100%"
		text
		dark
		@click="onClick"
	>
		<v-icon v-if="icon" left dark>{{ icon }}</v-icon>
		<span>{{ label }}</span>
	</v-btn>
</template>

<script>
export default {
	name: 'MapHeaderButton',
	props: {
		label: {
			type: String,
			default: '',
		},

		icon: {
			type: String,
			default: null,
		},

		loading: {
			type: Boolean,
			default: false,
		},

		disabled: {
			type: Boolean,
			default: false,
		},

		outlined: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		onClick(e) {
			this.$emit('click', e)
		},
	},
}
</script>

<style lang="sass">
.MapHeaderButton
    display: inline-block
</style>
