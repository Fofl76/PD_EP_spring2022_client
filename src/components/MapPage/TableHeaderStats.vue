<template>
  <MHint
    v-if="items.length"
    :top="false"
    bottom
  >
    <div
      v-for="stats in controlStats"
      :key="stats.id"
    >
      <span>
        {{ stats.name }}:
      </span>
      <span>
        {{ stats.hours }}ч,
      </span>
      <span>
        {{ stats.zet?.toFixed(2) }}зет
      </span>
    </div>
    <div>
      Всего: {{ allStats.hours }}ч, {{ allStats.zet.toFixed(2) }}зет
    </div>
  </MHint>
</template>

<script>
import MHint from '@components/common/MHint.vue'
import MapsService from '@services/Maps/MapsService'
import { forEach } from 'lodash'
export default {
  components: { MHint },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      controlTypes: MapsService.controlTypes,
      zetQuealsHours: MapsService.ZETQUEALSHOURS,
    }
  },
  computed: {
    stats() {
      const stats = {}

      // this.items.forEach((item) => {
      //   item.type.value.forEach((type) => {
      //     if (stats[type.value.controlTypeId]) {
      //       stats[type.value.controlTypeId] += type.amount
      //     }
      //     else {
      //       stats[type.value.controlTypeId] = type.amount
      //     }
      //   })
      // })

      return stats
    },
    controlStats() {
      const stats = []

      this.controlTypes.value.forEach((item) => {
        if (this.stats[item.id]) {
          stats.push({
            ...item,
            hours: this.stats[item.id],
            zet: this.stats[item.id] / this.zetQuealsHours,
          })
        }
      })

      return stats
    },
    allStats() {
      return this.controlStats.reduce((sumObj, el) => ({
        hours: sumObj.hours + el.hours,
        zet: sumObj.zet + el.zet,
      }), { hours: 0, zet: 0})
    }
  }
}
</script>

<style>

</style>