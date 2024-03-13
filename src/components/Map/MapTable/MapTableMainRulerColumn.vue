<template>
	<div class="MapTableMainRulerColumn">
		<div class="MapTableMainRulerColumn__header">ЗЕТ</div>

		<div
			v-for="i in maxZet"
			:key="i"
			class="MapTableMainRulerColumn__block"
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
        text-align: center

    &__block
        opacity: .7
        font-size: 14px
        padding: 0
        text-align: center
        transition: all 0.3s ease
        display: flex
        justify-content: center
        align-items: center
        position: relative

        &:after
            position: absolute
            content: ''
            background-color: #fff
            opacity: .7
            top: 100%
            width: 80%
            height: 1px
            left: 50%
            transform: translateX(-50%)

/*         &:not(:last-of-type)
            border-bottom: 1px solid #fff */
</style>
