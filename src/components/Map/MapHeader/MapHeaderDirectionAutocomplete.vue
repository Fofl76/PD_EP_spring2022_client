<template>
	<MAutocomplete
		v-model="_value"
		:items="sortedItems"
		v-bind="$attrs"
		v-on="$listeners"
		:menu-props="{ maxWidth: 500 }"
		class="MapHeaderDirectionAutocomplete"
		label="Введите направление"
		no-data-text="Сначала выберите факультет и год"
		item-text="name"
		filled
	>
		<template #append>
			<div class="MapHeaderDirectionAutocomplete__year-chip--selected">
				<v-chip
					v-if="_value"
					class="MapHeaderDirectionAutocomplete__year-chip"
					pill
					label
				>
					{{ formEduc[_value.form_educ] }}
				</v-chip>
			</div>
		</template>

		<template #item="{ item }">
			<v-list-item-title>{{ item.name }}</v-list-item-title>

			<div class="MapHeaderDirectionAutocomplete__chip-wrapper">
				<v-chip
					v-if="item.canEdit"
					class="MapHeaderDirectionAutocomplete__chip MapHeaderDirectionAutocomplete__edit-chip"
					pill
					label
				>
					<v-icon small color="grey darken-3">mdi-pen</v-icon>
				</v-chip>
				<v-chip
					class="MapHeaderDirectionAutocomplete__chip MapHeaderDirectionAutocomplete__year-chip"
					pill
					label
				>
					{{ formEduc[item.form_educ] }}
				</v-chip>
			</div>
		</template>
	</MAutocomplete>
</template>

<script>
import MAutocomplete from '@components/common/MAutocomplete.vue'
import formEduc from '@services/utils/formEduc'
export default {
	name: 'MapHeaderDirectionAutocomplete',
	components: { MAutocomplete },

	data() {
		return {
			formEduc,
		}
	},

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
			return this.items.toSorted((a, b) => {
				if (a.name < b.name) return -1
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
.MapHeaderDirectionAutocomplete
    width: 500px

    &__chip-wrapper
        display: flex
        align-items: center
        margin-left: 4px

        *:not(:last-child)
            margin-right: 4px

    &__edit-chip
        color: rgba(0, 0, 0, 0.87)
        padding: 0 8px

    &__chip
        justify-content: center

        &--selected
            margin-right: 4px

        .v-chip__content
            padding: 0 4px !important
            justify-content: center
            width: 20px
</style>
