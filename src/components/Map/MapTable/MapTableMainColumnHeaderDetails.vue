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

		<v-divider class="MapTableMainColumnHeaderDetails__divider" dark />

		<div>
			<span> {{ independentWorkStats.name }}: </span>
			<span> {{ independentWorkStats.hours }}ч, </span>
			<span> {{ independentWorkStats.zet?.toFixed(2) }}зет </span>
		</div>

		<div>
			<span> {{ classroomsStats.name }}: </span>
			<span> {{ classroomsStats.hours }}ч, </span>
			<span> {{ classroomsStats.zet?.toFixed(2) }}зет </span>
		</div>

		<v-divider class="MapTableMainColumnHeaderDetails__divider" dark />

		<div>
			<span> {{ allSum.name }}: </span>
			<span> {{ allSum.hours }}ч, </span>
			<span> {{ allSum.zet?.toFixed(2) }}зет </span>
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
			const typeValueByStats = MapsService.controlTypes.value
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

		/* Сумма СРС */
		independentWorkStats() {
			/* СРС */
			const ids = ['4']

			return {
				name: 'СРС',
				...this.getSumByValueIds(ids),
			}
		},

		/* Сумма аудиторных */
		classroomsStats() {
			/* ID control_types аудиторных часов */
			const ids = ['2', '3', '6', '8']

			return {
				name: 'Сумма аудиторных',
				...this.getSumByValueIds(ids),
			}
		},

		/* Общая сумма */
		allSum() {
			return {
				name: 'Общая сумма',
				...this.getSumByValueIds(),
			}
		},
	},

	methods: {
		/* Функция расчета суммы по определенным айдишникам нагрузок */
		getSumByValueIds(ids) {
			const sum = {
				hours: 0,
				zet: 0,
			}

			for (const id in this.stats.value) {
				if (ids?.includes(id) || ids?.length === 0 || !ids) {
					sum.hours += this.stats.value[id]
					sum.zet += this.stats.value[id] / this.zetQuealsHours
				}
			}

			return sum
		},
	},
}
</script>

<style lang="sass">
.MapTableMainColumnHeaderDetails
    &__divider
        margin: 6px 0
</style>
