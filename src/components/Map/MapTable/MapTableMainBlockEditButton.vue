<template>
	<v-btn
		class="MapTableMainBlockEditButton"
		:class="{ darkMode }"
		x-small
		fab
		icon
		@click="onClick"
	>
		<v-icon dark>mdi-pen</v-icon>
	</v-btn>
</template>

<script>
export default {
	name: 'MapTableMainBlockEditButton',

	props: {
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
.MapTableMainBlockEditButton
    position: absolute
    right: 8px
    top: 8px

    background-color: rgba(255, 255, 255, 0.1)
    color: #fff !important

    &.darkMode
        background-color: rgb(51, 51, 51, 0.1)
        color: #333 !important
</style>
