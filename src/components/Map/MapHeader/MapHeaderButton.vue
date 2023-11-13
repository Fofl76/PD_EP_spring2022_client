<template>
	<v-btn class="MapHeaderButton" @click="onClick" height="100%" text dark>
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
