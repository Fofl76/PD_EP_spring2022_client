<template>
	<div
		class="aup-table__block-wrapper"
		:style="{ height: totalZet * 90 + 'px' }"
	>
		<div class="aup-table__block" :style="{ backgroundColor }">
			<v-tooltip bottom :open-delay="300">
				<template v-slot:activator="{ on, attrs }">
					<span
						:style="styleName"
						class="aup-table__name"
						v-bind="attrs"
						v-on="on"
					>
						{{ data.element.discipline }}
					</span>
				</template>

				<span>{{ data.element.discipline }}</span>
			</v-tooltip>

			<v-btn
				class="aup-table__edit-btn"
				color="white"
				x-small
				fab
				icon
				@click="onEdit"
			>
				<v-icon dark> mdi-pen </v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
import determinateTextColor from '@utils/determinateTextColor'

export default {
	name: 'TableBlock',

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	computed: {
		totalZet() {
			return this.data.element?.type.reduce((sum, zetBlock) => {
				return sum + zetBlock?.zet
			}, 0)
		},

		needIsDarkText() {
			return determinateTextColor(this.backgroundColor)
		},

		styleName() {
			const styles = {}

			if (this.needIsDarkText) styles.color = '#333'
			else styles.color = '#fff'

			return styles
		},

		backgroundColor() {
			return this.data.group?.color
		},
	},

	methods: {
		onEdit() {
			this.$emit('edit', this.data.element)
		},
	},
}
</script>

<style lang="sass" scoped></style>
