<template>
	<ui-autocomplete label="Введите направление" class="DirectionAutocomplete__input DirectionAutocomplete__input-direction"
		v-model="_value" :items="sortedItems" no-data-text="Сначала выберите факультет" item-text="name" filled :menu-props="{
			maxWidth: 500,
		}" v-bind="$attrs" v-on="$listeners">
		<template #append>
			<div class="DirectionAutocomplete__year-chip--selected">
				<v-chip v-if="_value" class="DirectionAutocomplete__year-chip" pill label>
					{{ formEduc[_value.form_educ] }}
				</v-chip>
			</div>
		</template>

		<template #item="{ item }">
			<v-list-item-title>{{ item.name }}</v-list-item-title>
			<div>
				<v-chip class="DirectionAutocomplete__year-chip" pill label>{{
					formEduc[item.form_educ]
				}}</v-chip>
			</div>
		</template>
	</ui-autocomplete>
</template>

<script>
import UiAutocomplete from '@components/common/MAutocomplete.vue'
import formEduc from '@services/utils/formEduc'
export default {
	name: 'DirectionAutocomplete',

	components: { UiAutocomplete },
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
				if (a.name < b.name) {
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
.DirectionAutocomplete
    &__input-direction
        width: 500px

    &__year-chip
        justify-content: center
        margin-right: 4px

        &--selected
            margin-right: 4px
</style>
