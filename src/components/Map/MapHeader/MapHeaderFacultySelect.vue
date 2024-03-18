<template>
	<MSelect
		v-model="_value"
		:items="sortedItems"
		:loading="loading"
		class="MapHeaderFacultySelect"
		:menu-props="{ maxWidth: 600 }"
		item-text="faculty_name"
		no-data-text="Факультеты не найдены"
		label="Выберите факультет"
	>
		<template #item="{ item }">
			<v-list-item-title>{{ item.faculty_name }}</v-list-item-title>

			<div v-if="item.admin_only" class="MapHeaderFacultySelect__chip-wrapper">
				<v-tooltip top>
					<template #activator="{ on }">
						<v-chip
							class="MapHeaderFacultySelect__chip"
							pill
							label
							color="red darken-2"
							text-color="white"
							v-on="on"
						>
							A
						</v-chip>
					</template>

					<span>
						Данный факультет доступен для просмотра <br />только Администраторам
					</span>
				</v-tooltip>
			</div>
		</template>
	</MSelect>
</template>

<script>
import MSelect from '@components/common/MSelect.vue'

import _ from 'lodash'

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

		loading: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		sortedItems() {
			return _.orderBy(
				this.items,
				['admin_only', 'faculty_name'],
				['desc', 'asc'],
			)
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

    &__chip
        cursor: pointer
        font-weight: bold

    &__chip-wrapper
        margin-left: 4px
</style>
