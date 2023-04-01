<template>
  <div>
    <ui-table
      :table="table"
      :loading="loading"
      :max-zet="maxZet"
      @edit="onEdit"
      @drag="onDrag"
    />
  </div>
</template>

<script>
import UiTable from '@components/ui/UiTable/UiTable.vue'
import MapsService from '@services/Maps/MapsService'

export default {
  components: { UiTable },
  props: {
    table: {
      type: Array,
      default: () => [],
    },
    loading: Boolean,
  },
  computed: {
    maxZet() {
      return MapsService.maxZet
    },
  },
  methods: {
    onEdit(event) {
      console.log(event)
    },
    onDrag({ data, columnIndex }) {
      const added = data?.added
			const removed = data?.removed
			const moved = data?.moved

      if (removed) {
        MapsService.deleteMapItemLocal(removed.element)
      }

      if (added) {
        const element = {
          ...added.element,
          num_col: columnIndex + 1,
          num_row: added.newIndex,
        }

        MapsService.addMapItemLocal(element)
      }

      if (moved) {
        MapsService.movedMapItemInColLocal(moved.element, moved.oldIndex, moved.newIndex)
      }
    }
  }
}
</script>

<style>

</style>