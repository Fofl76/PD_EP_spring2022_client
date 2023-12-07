<template>
	<MHint
		class="MapTableMainColumnHeaderDetails"
		v-if="items.length"
		:top="false"
		bottom
	>
		<div v-for="stats in controlStats" :key="stats.id">
			<span> {{ stats.name }}: </span>
			<span> {{ stats.count }}, </span>
		</div>
		<div v-for="stats in valueStats" :key="stats.id">
			<span> {{ stats.name }}: </span>
			<span> {{ stats.hours }}ч, </span>
			<span> {{ stats.zet?.toFixed(2) }}зет </span>
		</div>
	</MHint>
</template>

<script>
import MHint from '@components/common/MHint.vue'
import { ValueAmountTypeEnum } from '@models/Maps/IMapItemValueRaw'
import MapsService from '@services/Maps/MapsService'

export default {
	name: 'MapTableMainColumnHeaderDetails',
	components: { MHint },
	props: {
		items: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			MapsService,
			controlTypes: MapsService.controlTypes,
			zetQuealsHours: MapsService.ZETQUEALSHOURS,
		}
	},

	computed: {
		stats() {
			const typeValueByStats = MapsService.controlTypes.value.filter(
				item => item.name === 'СРС' || item.name === 'Лекции'
			)
			const stats = {
				value: {},
				session: {},
			}

			this.items.forEach(item => {
				item.type.value?.forEach(type => {
					const typeValue = typeValueByStats.find(
						_item => type.control_type_id === _item.id
					)

					if (typeValue) {
						if (stats.value[type.control_type_id]) {
							if (type.amount_type === ValueAmountTypeEnum.WEEK) {
								stats.value[type.control_type_id] +=
									type.amount * MapsService.WEEKQUEALSHOURS
							} else {
								stats.value[type.control_type_id] += type.amount
							}
						} else {
							if (type.amount_type === ValueAmountTypeEnum.WEEK) {
								stats.value[type.control_type_id] =
									type.amount * MapsService.WEEKQUEALSHOURS
							} else {
								stats.value[type.control_type_id] = type.amount
							}
						}
					}
				})

				item.type.session?.forEach(session => {
					if (stats.session[session.control_type_id]) {
						stats.session[session.control_type_id] += 1
					} else {
						stats.session[session.control_type_id] = 1
					}
				})
			})

			return stats
		},

		valueStats() {
			const stats = []

			this.controlTypes.value.forEach(item => {
				if (this.stats.value[item.id]) {
					stats.push({
						...item,
						hours: this.stats.value[item.id],
						zet: this.stats.value[item.id] / this.zetQuealsHours,
					})
				}
			})

			return stats
		},

		controlStats() {
			const stats = []

			this.controlTypes.value.forEach(item => {
				if (this.stats.session[item.id]) {
					stats.push({
						...item,
						count: this.stats.session[item.id],
					})
				}
			})

			return stats
		},

		allStats() {
			return this.controlStats.reduce(
				(sumObj, el) => ({
					hours: sumObj.hours + el.hours,
					zet: sumObj.zet + el.zet,
				}),
				{ hours: 0, zet: 0 }
			)
		},
	},
}
</script>
