<template>
	<div
		class="DataPreloader"
		:class="{
			'DataPreloader--light': light,
		}"
	>
		<div class="DataPreloader__smile">≧◉◡◉≦</div>
		<div v-if="$slots.title" class="DataPreloader__title">
			<slot name="title" />
		</div>
		<div v-if="$slots.subtitle" class="DataPreloader__subtitle">
			<slot name="subtitle" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'DataPreloader',
	props: {
		light: {
			type: Boolean,
			default: false,
		},
	},
}
</script>

<style lang="sass">
.DataPreloader
    color: #fff
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

    &__smile
        user-select: none
        font-size: 30px
        margin-bottom: 16px
        width: 150px
        height: 150px
        background-color: #272727
        padding: 10px
        display: flex
        align-items: center
        justify-content: center
        border-radius: 50%

    &__title
        font-size: 25px
        margin-bottom: 0px

    &__subtitle
        font-size: 20px
        color: #a8a8a8
        font-weight: 300

    &--light > &__title, &--light > &__subtitle
        color: #333
</style>
