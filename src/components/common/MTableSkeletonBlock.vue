<template>
	<div
		class="MTableSkeletonBlock"
		:style="{ height: getRandomNum() * 90 + 'px' }"
	>
		<v-skeleton-loader
			dark
			class="MTableSkeletonBlock__skeleton"
			max-width="300"
			type="list-item-two-line"
		></v-skeleton-loader>
	</div>
</template>

<script>
export default {
	name: 'TableSkeletonBlock',

	data: () => ({
		randomNums: [1, 2, 3, 4],
	}),

	methods: {
		getRandomNum() {
			return Math.floor(Math.random() * (4 - 1) + 1)
		},
	},
}
</script>

<style lang="sass">
.MTableSkeletonBlock
    width: 100%
    padding: 5px 0

    &__skeleton
        height: 100%

        & > div
            height: 100%
            width: 100%
</style>
