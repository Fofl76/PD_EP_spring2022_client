<template>
	<v-icon class="MChevron" :class="{ isOpen }" small> mdi-chevron-down </v-icon>
</template>

<script>
export default {
	name: 'MChevron',

	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
	},
}
</script>

<style lang="sass" scoped>
.MChevron
    transition: transform .25s ease

    &.isOpen
        transform: rotate(180deg)
</style>
