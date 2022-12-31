<template>
	<div
		class="aup-table__block-wrapper"
		:style="{ height: item.zet * 90 + 'px' }"
	>
		<div class="aup-table__block" :style="{ backgroundColor: item.disc_color }">
			<v-tooltip bottom :open-delay="300">
				<template v-slot:activator="{ on, attrs }">
					<span class="aup-table__name" v-bind="attrs" v-on="on">
						{{ item.discipline }}
					</span>
				</template>

				<span>{{ item.discipline }}</span>
			</v-tooltip>

			<v-btn
				class="aup-table__edit-btn"
				color="white"
				x-small
				fab
				icon
				@click="onEdit(item)"
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
		item: {
			type: Object,
			required: true,
		},
	},

	methods: {
		onEdit(item) {
			this.$emit('edit', item)
		},
	},
}
</script>
