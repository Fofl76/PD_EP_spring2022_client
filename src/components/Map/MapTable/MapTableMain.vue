<template>
	<div>
		<div class="MapTableMain" :style="styleVars">
			<template v-if="!loading">
				<!-- Левая колонка с линейкой ЗЕТ -->
				<MapTableMainRulerColumn :maxZet="maxZet" :heightZet="heightZet" />

				<!-- Вынести в отдельный компонент -->
				<div
					class="MapTableMain__column"
					v-for="(column, key) in table"
					:key="key"
				>
					<!-- Шапка колонки с блоками -->
					<MapTableMainColumnHeader :ordinalNumber="key" :columnData="column" />

					<!-- Вынести в отдельный компонент -->
					<draggable
						class="MapTableMain__draggable"
						v-bind="dragOptions"
						:value="table[key]"
						:setData="setData"
						@change="onDragElementTable($event, key)"
					>
						<div v-for="element in column" :key="element.id">
							<div>
								<MapTableMainBlock
									:data="dataValue(element)"
									:isEditing="activeEditingItemId === element.id"
									:class="{ isEditing: activeEditingItemId === element.id }"
									:height="heightTableBlock(element)"
									:fitMode="fitMode"
									:total-zet="totalZet(element)"
									@edit="$emit('edit', $event)"
									@click.native="onClickBlock(element)"
								/>
							</div>
						</div>
					</draggable>
				</div>
			</template>

			<!-- Вынести в отдельный компонент -->
			<template v-else>
				<div
					class="MapTableMain__column"
					v-for="(column, key) in fakeElementsCount"
					:key="key"
				>
					<div class="MapTableMain__column-header">
						{{ orderWords[key] }}
					</div>

					<div v-for="item in 10" :key="item.id">
						<MapTableMainSkeletonBlock />
					</div>
				</div>
			</template>

			<v-overlay
				v-if="activeEditingItemId"
				:z-index="1"
				absolute
				color="#272727"
			/>
		</div>
	</div>
</template>

<script>
import _ from 'lodash'
import draggable from 'vuedraggable'

import orderWords from '@utils/orderWords'
import GroupsService from '@services/Groups/GroupsService'
import MapsService from '@services/Maps/MapsService'

import MapTableMainRulerColumn from '@components/Map/MapTable/MapTableMainRulerColumn.vue'
import MapTableMainColumnHeader from '@components/Map/MapTable/MapTableMainColumnHeader.vue'
import MapTableMainBlock from '@components/Map/MapTable/MapTableMainBlock.vue'
import MapTableMainSkeletonBlock from '@components/Map/MapTable/MapTableMainSkeletonBlock.vue'

export default {
	name: 'MapTableMain',
	components: {
		draggable,
		MapTableMainRulerColumn,
		MapTableMainColumnHeader,
		MapTableMainBlock,
		MapTableMainSkeletonBlock,
	},

	props: {
		table: {
			type: Array,
			default: () => [],
		},

		maxZet: {
			type: Number,
			default: 30,
		},

		activeEditingItemId: {
			type: [String, Number],
			default: null,
		},

		loading: {
			type: Boolean,
			default: false,
		},

		fitMode: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			orderWords,
			fakeElementsCount: 8,
			fakeMaxZet: 30,
			zetQuealsHours: MapsService.ZETQUEALSHOURS,
			WEEKQUEALSHOURS: MapsService.WEEKQUEALSHOURS,
		}
	},

	computed: {
		heightZet() {
			return (countZet = 1) => {
				if (this.fitMode) {
					return `calc(((100vh - 80px - 32px - 30px) / ${this.maxZet || 1}) * ${
						countZet || 1
					})`
				}

				return `calc(90px * ${countZet})`
			}
		},

		dataValue() {
			return element => ({
				element,
				group: this.getGroupById(element.id_group),
			})
		},

		dragOptions() {
			return {
				animation: 250,
				group: 'map',
			}
		},

		allGroupsMapId() {
			return GroupsService.allGroupsMapId
		},

		heightTableBlock() {
			return data => this.heightZet(this.totalZet(data))
		},

		styleVars() {
			return {
				'--count-column': this.countOfColumns,
				'--max-height': this.heightZet(this.maxZet),
			}
		},

		countOfColumns() {
			if (this.loading) return this.fakeElementsCount

			return Object.keys(this.table).length
		},
	},

	methods: {
		onDragElementTable(data, columnIndex) {
			this.$emit('drag', { data, columnIndex })
		},

		getGroupById(idGroup) {
			return this.allGroupsMapId[idGroup]
		},

		totalZet(data) {
			const hours = data.type.value?.reduce((sum, zetBlock) => {
				if (zetBlock.id_edizm === 2) {
					return sum + zetBlock.amount * this.WEEKQUEALSHOURS
				}

				return sum + zetBlock?.amount
			}, 0)

			const zet = Math.max(hours / this.zetQuealsHours, 1)
			return zet
		},

		setData(dataTransfer) {
			dataTransfer.setDragImage(document.createElement('div'), 0, 0)
		},

		onClickBlock(item) {
			console.log(_.cloneDeep(item))
		},
	},
}
</script>

<style lang="sass">
.MapTableMain
    display: grid
    grid-template-columns: 30px repeat(var(--count-column), minmax(100px, 1fr))
    gap: 8px
    color: #fff
    max-height: calc(var(--max-height) + 30px)
    overflow: hidden

    &__draggable
        flex: 1 1 100%

    &__column
        display: flex
        flex-direction: column

    .MapTableMainBlock__wrapper.isEditing
        position: relative
        z-index: 1000

        .MapTableMainBlock
            cursor: default
</style>
