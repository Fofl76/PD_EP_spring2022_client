<template>
	<div>
		<div class="aup-table" :style="styleVars">
			<template v-if="!loading">
				<div class="aup-table__left-column">
					<div class="aup-table__column-header aup-table__left-column-header">
						ЗЕТ
					</div>

					<div
						class="aup-table__zet-block"
						v-for="i in !loading ? maxZet : fakeMaxZet"
						:key="i"
						:style="{ height: heightZet() }"
					>
						<span>{{ i }}</span>
					</div>
				</div>

				<div
					class="aup-table__column"
					v-for="(column, key) in table"
					:key="key"
				>
					<div class="aup-table__column-header">
						{{ orderWords[key] }}
						<TableHeaderStats
							:items="column"
						/>
					</div>

					<draggable
						class="aup-table__draggable"
						v-bind="dragOptions"
						:value="table[key]"
						:setData="setData"
						@change="onDragElementTable($event, key)"
					>
						<div v-for="element in column" :key="element.id">
							<UiTableBlock
								:data="dataValue(element)"
								:isEditing="activeEditingItemId === element.id"
								:height="heightTableBlock(element)"
								:fitMode="fitMode"
								:total-zet="totalZet(element)"
								:class="{
									'aup-table__block-wrapper-small': fitMode,
								}"
								@edit="$emit('edit', $event)"
								@click.native="onClickBlock(element)"
							/>
						</div>
					</draggable>
				</div>
			</template>
			<template v-else>
				<div
					class="aup-table__column"
					v-for="(column, key) in fakeElementsCount"
					:key="key"
				>
					<div class="aup-table__column-header">
						{{ orderWords[key] }}
					</div>

					<div v-for="item in 10" :key="item.id">
						<ui-table-skeleton-block />
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import UiTableBlock from './MTableBlock.vue'
import GroupsService from '@services/Groups/GroupsService'
import orderWords from '@utils/orderWords'
import UiTableSkeletonBlock from './MTableSkeletonBlock.vue'
import MapsService from '@services/Maps/MapsService'
import _ from 'lodash'
import MHint from './MHint.vue'
import TableHeaderStats from '@components/MapPage/TableHeaderStats.vue'

const dapsService = MapsService.ZETQUEALSHOURS

export default {
	components: { UiTableBlock, draggable, UiTableSkeletonBlock, MHint, TableHeaderStats },
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
					return `calc(((100vh - 80px - 32px - 30px) / ${this.maxZet || 1}) * ${countZet || 1})`
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
					return sum + (zetBlock.amount * this.WEEKQUEALSHOURS)
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

		isEditingItem(item) {
			console.log(item)
		},
	},
}
</script>

<style lang="sass">
.aup-table
    display: grid
    grid-template-columns: 30px repeat(var(--count-column), minmax(100px, 1fr))
    gap: 8px
    color: #fff

    &__block-wrapper-small
        .aup-table__name
            transform: scale(.75)

    &__draggable
        flex: 1 1 100%

    &__column
        display: flex
        flex-direction: column

    &__block-wrapper
        transition: all 0.3s ease
        padding: 5px 0

    &__column-header
        text-align: center
        margin-bottom: 5px

    &__edit-btn
        background-color: rgba(255, 255, 255, 0.1)
        position: absolute
        right: 8px
        top: 8px
        opacity: 0
        transition: opacity .25s ease

    &__zet-block
        padding: 0
        text-align: center
        transition: all 0.3s ease
        display: flex
        justify-content: center
        align-items: center

				&:not(:last-of-type)
		        border-bottom: 1px solid #fff
.flip-list-move
    transition: transform 0.5s

.no-move
  transition: transform 0s
</style>
