<template>
  <v-select
    class="HomeHeader__input HomeHeader__input-faculty"
    :menu-props="{ offsetY: false }"
    :items="items"
    v-model="_value"
    :item-text="itemText"
    :no-data-text="noDataText"
    return-object
    :item-value="itemValue"
    :label="label"
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