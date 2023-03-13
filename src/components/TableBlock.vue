<template>
	<div
		class="aup-table__block-wrapper"
		:style="{ height: totalZet * 90 + 'px' }"
	>
		<div class="aup-table__block" :style="{ backgroundColor: color }">
			<v-tooltip bottom :open-delay="300">
				<template v-slot:activator="{ on, attrs }">
					<span class="aup-table__name" v-bind="attrs" v-on="on">
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
export default {
	name: 'TableBlock',

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	methods: {
		onEdit() {
			this.$emit('edit', this.data.element)
		},
	},

	computed: {
		totalZet() {
			return this.data.element?.type.reduce((sum, zetBlock) => {
				return sum + zetBlock?.zet
			}, 0)
		},

		color() {
			return this.data.group?.color
		},
	},
}
</script>

<style lang="sass" scoped></style>
