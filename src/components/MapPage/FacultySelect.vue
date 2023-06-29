<template>
	<ui-select
		class="MapHeaderSelectMap__input MapHeaderSelectMap__input-faculty"
		:items="sortedItems"
		v-model="_value"
		item-text="faculty_name"
		no-data-text="Факультеты не найдены"
		label="Выберите факультет"
		v-bind="$attrs"
		v-on="$listeners"
	/>
</template>

<script>
import Vue from 'vue'
import UiSelect from '@components/common/MSelect.vue'
export default {
	components: { UiSelect },
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
.MapHeaderSelectMap
    &__input-faculty
        width: 300px
</style>
