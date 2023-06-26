<template>
	<ui-autocomplete label="Выберите факультет" class="MapPageHeaderSelectMap__input MapPageHeaderSelectMap__input-faculty"
									 v-model="_value" :items="sortedItems" no-data-text="Факультеты не найдены" item-text="faculty_name" filled :menu-props="{
			maxWidth: 300,
		}" v-bind="$attrs" v-on="$listeners">
		<template #item="{ item }">
			<v-list-item-title>{{ item.faculty_name }}</v-list-item-title>
		</template>
	</ui-autocomplete>
</template>

<script>
import UiAutocomplete from '@components/common/MAutocomplete.vue'
export default {
	components: { UiAutocomplete },
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
.MapPageHeaderSelectMap
    &__input-faculty
        width: 300px
</style>
