<template>
	<div class="MapTableMainRulerColumn">
		<div class="MapTableMainRulerColumn__header">ЗЕТ</div>

		<div
			class="aup-table__zet-block"
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
        margin-bottom: 5px
</style>
