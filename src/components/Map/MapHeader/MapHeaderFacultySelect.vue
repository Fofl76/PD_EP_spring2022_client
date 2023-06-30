<template>
	<MSelect
		v-model="_value"
		:items="sortedItems"
		v-bind="$attrs"
		v-on="$listeners"
		class="MapHeaderFacultySelect"
		item-text="faculty_name"
		no-data-text="Факультеты не найдены"
		label="Выберите факультет"
	/>
</template>

<script>
import MSelect from '@components/common/MSelect.vue'
export default {
	name: 'MapHeaderFacultySelect',
	components: { MSelect },

	props: {
		value: {
			type: [Object, String],
			default: () => ({}),
		},

		items: {
			type: Array,
			default: () => [],
		},
	},

	computed: {
		sortedItems() {
			return [...this.items].sort((a, b) => {
				if (a.faculty_name < b.faculty_name) {
					return -1
				}

				return 1
			})
		},

		_value: {
			get() {
				return this.value
			},
			set(v) {
				this.$emit('input', v)
			},
		},
	},
}
</script>

<style lang="sass">
.MapHeaderFacultySelect
    width: 300px
</style>
