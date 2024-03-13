<template>
	<v-autocomplete
		v-model="_value"
		class="MAutocomplete"
		:label="label"
		:items="items"
		:no-data-text="noDataText"
		:item-text="itemText"
		:item-value="itemValue"
		return-object
		hide-details="auto"
		dark
		filled
		autocomplete="false"
		dense
		v-bind="$attrs"
		v-on="$listeners"
	>
		<template #item="item">
			<slot name="item" v-bind="item" />
		</template>
		<template v-for="(_, name) in $scopedSlots" #[name]="scope">
			<slot :name="name" v-bind="scope" />
		</template>
		<template v-for="(_, name) in $slots" #[name]>
			<slot :name="name" />
		</template>
	</v-autocomplete>
</template>

<script>
export default {
	name: 'MAutocomplete',

	props: {
		value: {
			type: [Object, String],
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
.MAutocomplete
    .v-select__slot > input
        padding: 8px 0 !important
</style>
