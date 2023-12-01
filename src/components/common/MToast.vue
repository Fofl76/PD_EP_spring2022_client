<template>
	<div class="MToast">
		<div class="MToast__title">{{ title }}</div>
		<span class="MToast__text">{{ text }}</span>
	</div>
</template>

<script>
export default {
	name: 'MToast',

	props: {
		title: {
			type: String,
			default: '',
		},

		text: {
			type: String,
			default: '',
		},
	},
}
</script>

<style lang="sass">

.MToast
    display: flex
    flex-direction: column
    justify-content: center
    height: 100%

    &__title
        font-size: 15px
        font-weight: bold

    &__text
        font-size: 14px
</style>
