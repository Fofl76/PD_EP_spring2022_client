<template>
  <ui-select
    class="HeaderFormDirection__input HeaderFormDirection__input-faculty"
    :items="items"
    v-model="_value"
    item-text="faculty_name"
    no-data-text="Факультеты не найдены"
    label="Выберите факультет"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import Vue from "vue"
import UiSelect from '@components/ui/UiSelect/UiSelect.vue';
export default {
  components: { UiSelect },
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
.HeaderFormDirection
    &__input-faculty
        width: 300px
</style>
