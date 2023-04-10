<template>
	<v-autocomplete
		:label="label"
		v-model="_value"
		:items="items"
		:no-data-text="noDataText"
		:item-text="itemText"
    :item-value="itemValue"
		return-object
		hide-details="auto"
		dark
		filled
		dense
    v-bind="$attrs"
    v-on="$listeners"
	>
    <template #item="item">
      <slot
        name="item"
        v-bind="item"
      />
    </template>
		<template
        v-for="(_, name) in $scopedSlots"
        #[name]="scope"
      >
        <slot
          :name="name"
          v-bind="scope"
        />
      </template>
      <template
        v-for="(_, name) in $slots"
        #[name]
      >
        <slot :name="name" />
      </template>
	</v-autocomplete>
</template>

<script>
import Vue from "vue"
export default {
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
        return this.value;
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
}
</script>


<style>
</style>