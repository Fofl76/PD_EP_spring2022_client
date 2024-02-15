<template>
	<div
		class="MapTableTools"
		:class="{ isOpenRightMenu: rightMenuEditModel }"
		:style="styleVars"
	>
		<v-btn
			v-if="availableSave"
			:loading="loadingSave"
			class="MapTableTools__save-btn"
			color="success"
			dark
			@click="onClickSave"
		>
			<span>Сохранить карту</span>
			<v-icon right dark>mdi-content-save</v-icon>
		</v-btn>

		<v-btn
			class="MapTableTools__change-mode-btn"
			color="success"
			dark
			@click="onClickChangeMode"
		>
			<span>Изменить вид таблицы</span>
		</v-btn>
	</div>
</template>

<script>
/* Нужно задизайнить этот компонент */

import { mapGetters } from 'vuex'

export default {
	name: 'MapTableTools',
	props: {
		availableSave: {
			type: Boolean,
			default: false,
		},

		loadingSave: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		...mapGetters('Map', ['rightMenuEditModel', 'rightMenuEditWidth']),

		styleVars() {
			return {
				'--right-menu-width': this.rightMenuEditWidth + 'px',
			}
		},
	},

	methods: {
		onClickSave() {
			this.$emit('clickSave')
		},

		onClickChangeMode() {
			this.$emit('clickChangeMode')
		},
	},
}
</script>

<style lang="sass">
.MapTableTools
    display: inline-flex
    flex-direction: column
    position: fixed
    bottom: 16px
    right: 16px
    transition: right .2s cubic-bezier(0.4, 0, 0.2, 1)
    z-index: 100

    &.isOpenRightMenu
        right: calc(16px + var(--right-menu-width))

    &__save-btn
        margin-bottom: 8px
</style>
