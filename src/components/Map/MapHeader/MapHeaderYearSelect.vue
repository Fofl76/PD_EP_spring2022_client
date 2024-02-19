<template>
	<MSelect
		class="MapHeaderYearSelect"
		label="Год"
		v-model="value_"
		:items="items"
		item-value=""
		:return-object="false"
		no-data-text="Отсутствуют направления"
		item-title=""
		height="52"
	/>
</template>

<script>
import MSelect from '@components/common/MSelect.vue'
export default {
	name: 'MapHeaderYearSelect',
	components: { MSelect },

	props: {
		value: {
			type: Number,
			required: true,
		},
		items: {
			type: Array,
			required: true,
		},
	},

	computed: {
		value_: {
			get() {
				return this.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},
	},
}
</script>

<style lang="sass">
.MapHeaderYearSelect
    // Фикс непонятного бага со стрелочкой у селекта
    .v-input__append-inner
        margin-top: 14px !important
</style>
