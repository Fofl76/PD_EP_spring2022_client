<template>
	<v-btn class="MapHeaderButton" @click="onClick" text dark>
		<span>{{ label }}</span>
		<v-icon v-if="icon" right dark>{{ icon }}</v-icon>
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
