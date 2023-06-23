<script>
import MSelect from '@components/common/MSelect.vue';
export default {
  name: 'SelectYear',
  components: {
    MSelect
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    }
  },
  computed: {
    value_: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }
}
</script>

<template>
  <MSelect class="MapPageHeaderSelectMap__input MapPageHeaderSelectMap__input-year" v-if="items.length" v-model="value_" :items="items" item-value="" :return-object="false" item-title=""
    height="52" />
</template>

<style lang="sass">
.MapPageHeaderSelectMap
    &__input-year
        .v-input__control .v-input__slot .v-select__slot
            margin-top: 20px !important

        .v-input__append-inner
            margin-top: 0 !important
</style>