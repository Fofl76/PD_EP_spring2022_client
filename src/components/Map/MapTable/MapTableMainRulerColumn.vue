<template>
	<div class="MapTableMainRulerColumn">
		<div class="MapTableMainRulerColumn__header">ЗЕТ</div>

		<div
			class="MapTableMainRulerColumn__block"
			v-for="i in maxZet"
			:key="i"
			:style="{ height: heightZet() }"
		>
			<span>{{ i }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MapTableMainRulerColumn',

	props: {
		maxZet: {
			type: Number,
			default: 0,
		},

		heightZet: {
			type: Function,
			default: () => {
				return ''
			},
		},
	},
}
</script>

<style lang="sass">
.MapTableMainRulerColumn
    &__header
        margin-bottom: 6px

    &__block
        padding: 0
        text-align: center
        transition: all 0.3s ease
        display: flex
        justify-content: center
        align-items: center

        &:not(:last-of-type)
            border-bottom: 1px solid #fff
</style>
