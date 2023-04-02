<template>
  <div>
    <ui-table
      :table="table"
      :loading="loading && !isLoadingSaveMapList"
      :max-zet="maxZet"
      @edit="onEdit"
      @drag="onDrag"
    />
    <v-btn
      v-if="isAvailableSave"
      class="Home__save-table-btn"
      :loading="isLoadingSaveMapList"
      color="success"
      dark
      @click="onSaveMap"
    >
      <span>Сохранить карту</span>
      <v-icon right dark> mdi-content-save </v-icon>
    </v-btn>
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
  data() {
    return {
      isAvailableSave: false,
    }
  },
  computed: {
    maxZet() {
      return MapsService.maxZet
    },
    isLoadingSaveMapList() {
      return MapsService.isLoadingSaveMapList
    }
  },
  methods: {
    onEdit(event) {
      console.log(event)
    },
    async onSaveMap() {
      const aup = this.$route.query.aup

      if (!aup) return

      await MapsService.saveAllMap(aup)

      this.isAvailableSave = false
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

      this.isAvailableSave = true
    }
  }
}
</script>

<style>

</style>