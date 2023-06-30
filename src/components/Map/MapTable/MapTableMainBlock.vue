<template>
	<div
		class="MapTableMainBlock__wrapper"
		:class="{
			isEditing,
			fitMode: fitMode && totalZet <= 2,
			'MapTableMainBlock__wrapper--small': fitMode,
		}"
		:style="styleVars"
	>
		<div
			class="MapTableMainBlock"
			:style="{ backgroundColor }"
			@mouseover="isHovered = true"
			@mouseleave="isHovered = false"
		>
			<v-tooltip bottom :open-delay="300">
				<template v-slot:activator="{ on, attrs }">
					<span class="MapTableMainBlock__name" v-bind="attrs" v-on="on">
						{{ data.element.discipline }}
					</span>
				</template>

				<span>{{ data.element.discipline }}</span>
			</v-tooltip>

			<MapTableMainBlockEditButton
				:darkMode="needIsDarkMode"
				:show="isHovered"
				@click="onEdit"
			/>
		</div>
	</div>
</template>

<script>
import determinateTextColor from '@utils/determinateTextColor'

import MapTableMainBlockEditButton from '@components/Map/MapTable/MapTableMainBlockEditButton.vue'

export default {
	name: 'MapTableMainBlock',
	components: { MapTableMainBlockEditButton },

	props: {
		data: {
			type: Object,
			required: true,
		},

		isEditing: {
			type: Boolean,
			default: false,
		},

		fitMode: {
			type: Boolean,
			default: false,
		},

		height: {
			type: String,
			default: '90px',
		},

		totalZet: {
			type: Number,
			default: 0,
		},
	},

	data() {
		return {
			modeTable: 'default',
			isHovered: false,
		}
	},

	computed: {
		backgroundColor() {
			return this.data.group?.color
		},

		needIsDarkMode() {
			return determinateTextColor(this.backgroundColor)
		},

		styleVars() {
			return {
				'--height-block': this.height,
				'--text-color': this.needIsDarkMode ? '#333' : '#fff',
			}
		},
	},

	methods: {
		onEdit() {
			this.$emit('edit', this.data.element)
		},
	},
}
</script>

<style lang="sass" scoped>
.MapTableMainBlock
    position: relative
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    padding: 5px
    text-align: center
    border-radius: 8px
    font-size: 100%
    font-family: sans-serif
    cursor: grab
    transition: box-shadow .25s ease

    &__wrapper
        transition: all 0.3s ease
        padding: 5px 0
        height: var(--height-block)

        &.fitMode:hover
          height: calc(var(--height-block) * 3)

        &.isEditing
            .MapTableMain__block
                box-shadow: 0px 0px 3px 7px rgba(10, 110, 189, 0.7)

        &--small
            .MapTableMainBlock__name
                transform: scale(.75)

    &__name
        color: var(--text-color)
        overflow: hidden
        line-height: 2rem
        max-height: 8rem
        -webkit-box-orient: vertical
        display: block
        max-height: 100%
        display: -webkit-box
        overflow: hidden !important
        text-overflow: ellipsis
        font-weight: bold
        -webkit-line-clamp: 4
        transition: transform .25s ease

        &__full
          -webkit-line-clamp: 1
</style>
