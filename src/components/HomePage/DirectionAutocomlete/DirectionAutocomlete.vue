<template>
	<ui-autocomplete
		label="Введите направление"
		class="DirectionAutocomplete__input DirectionAutocomplete__input-direction"
		v-model="_value"
		:items="items"
		no-data-text="Направления не найдены"
		item-text="name"
		v-bind="$attrs"
    v-on="$listeners"
	>
		<template #append>
			<div class="DirectionAutocomplete__year-chip--selected">
				<v-chip v-if="_value" class="DirectionAutocomplete__year-chip" pill label>
					{{ _value.year }}
				</v-chip>
			</div>
		</template>

		<template #item="{ item }">
			<v-list-item-title>{{ item.name }}</v-list-item-title>
			<div>
				<v-chip class="DirectionAutocomplete__year-chip" pill label>{{
					item.year
				}}</v-chip>
			</div>
		</template>
	</ui-autocomplete>
</template>

<script>
import Vue from "vue"
import UiAutocomplete from '@components/ui/UiAutocomplete/UiAutocomplete.vue';
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
    _value: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
}
</script>


<style lang="sass">
.DirectionAutocomplete
    &__input-direction
        width: 500px

    &__year-chip
        justify-content: center

        &--selected
            margin-right: 4px

        .v-chip__content
            padding: 0 4px !important
</style>
