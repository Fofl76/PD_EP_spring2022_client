<template>
	<v-select
		v-model="_value"
		class="MSelect"
		:menu-props="{ offsetY: false }"
		:items="items"
		:item-text="itemText"
		:no-data-text="noDataText"
		:return-object="returnObject"
		:item-value="itemValue"
		:label="label"
		:disabled="disabled"
		hide-details="auto"
		dark
		filled
		dense
		v-bind="$attrs"
		v-on="$listeners"
	>
	</v-select>
</template>

<script>
export default {
	name: 'MSelect',

	props: {
		value: {
			type: [Object, String, Number, Boolean],
			default: () => ({}),
		},

		label: {
			type: String,
			default: '',
		},

		noDataText: {
			type: String,
			default: '',
		},

		itemText: {
			type: String,
			default: null,
		},

		itemValue: {
			type: String,
			default: null,
		},

		items: {
			type: Array,
			default: () => [],
		},

		returnObject: {
			type: Boolean,
			default: true,
		},

		disabled: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
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
