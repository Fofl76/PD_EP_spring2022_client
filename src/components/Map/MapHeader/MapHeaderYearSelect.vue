<template>
	<MSelect
		class="MapHeaderYearSelect"
		v-if="items.length"
		v-model="value_"
		:items="items"
		item-value=""
		:return-object="false"
		:disabled="items.length === 1"
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
