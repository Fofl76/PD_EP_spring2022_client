<template>
	<v-btn
		class="MapTableMainBlockButton"
		:class="{ darkMode }"
		x-small
		fab
		icon
		@click="onClick"
	>
		<v-icon dark>{{ icon }}</v-icon>
	</v-btn>
</template>

<script>
export default {
	name: 'MapTableMainBlockEditButton',

	props: {
		icon: {
			type: String,
			default: 'mdi-pen',
		},

		darkMode: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		onClick() {
			this.$emit('click')
		},
	},
}
</script>

<style lang="sass">
.MapTableMainBlockButton
    position: absolute
    right: 8px
    top: 8px

    background-color: rgba(255, 255, 255, 0.1)
    color: #fff !important

    &.darkMode
        background-color: rgb(51, 51, 51, 0.1)
        color: #333 !important
</style>
