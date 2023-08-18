<template>
	<v-select
		class="MSelect"
		:menu-props="{ offsetY: false }"
		:items="items"
		v-model="_value"
		:item-text="itemText"
		:no-data-text="noDataText"
		:return-object="returnObject"
		:item-value="itemValue"
		:label="label"
		:dark="dark"
		hide-details="auto"
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

		dark: {
			type: Boolean,
			default: true,
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

<style lang="sass">
.MSelect
</style>
