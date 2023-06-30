<template>
	<div>
		<div class="MapTableMain" :style="styleVars">
			<template v-if="!loading">
				<!-- Левая колонка с линейкой ЗЕТ -->
				<MapTableMainRulerColumn :maxZet="30" :heightZet="heightZet" />

				<!-- Вынести в отдельный компонент -->
				<div
					class="MapTableMain__column"
					v-for="(column, key) in table"
					:key="key"
				>
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
							<MapTableMainBlock
								:data="dataValue(element)"
								:isEditing="activeEditingItemId === element.id"
								:height="heightTableBlock(element)"
								:fitMode="fitMode"
								:total-zet="totalZet(element)"
								:class="{
									'MapTableMain__block-wrapper-small': fitMode,
								}"
								@edit="$emit('edit', $event)"
								@click.native="onClickBlock(element)"
							/>
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
		loading: Boolean,
		fitMode: Boolean,
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

    &__block-wrapper-small
        .MapTableMain__name
            transform: scale(.75)

    &__draggable
        flex: 1 1 100%

    &__column
        display: flex
        flex-direction: column

    &__block-wrapper
        transition: all 0.3s ease
        padding: 5px 0

    &__edit-btn
        background-color: rgba(255, 255, 255, 0.1)
        position: absolute
        right: 8px
        top: 8px
        opacity: 0
        transition: opacity .25s ease

    .flip-list-move
        transition: transform 0.5s

    .no-move
        transition: transform 0s
</style>
