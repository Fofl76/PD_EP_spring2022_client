<template>
	<div class="TableMaps">
		<div class="TableMaps-content" v-if="!isEmpty">
			<UiTable
				:table="table"
				:loading="loading && !isLoadingSaveMapList"
				:activeEditingItemId="activeEditingItemId"
				:max-zet="maxZet"
				:is-full-screen="isFullScreen"
				@edit="onEdit"
				@drag="onDrag"
			/>

			<!-- Эти tools'ы таблицы вынести в отдельный компонент -->
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

			<v-btn
				class="Home__save-table-mode"
				color="success"
				dark
				@click="isFullScreen = !isFullScreen"
			>
				<span>Изменить вид таблицы</span>
			</v-btn>
		</div>

		<div v-else class="TableMaps-empty">
			<DataPreloader />
		</div>
	</div>
</template>

<script>
import UiTable from '@components/common/MTable.vue'
import MapsService from '@services/Maps/MapsService'

import DataPreloader from '@components/MapPage/DataPreloader.vue'

export default {
	components: { UiTable, DataPreloader },
	props: {
		table: {
			type: Array,
			default: () => [],
		},

		activeEditingItemId: {
			type: [String, Number],
			default: null,
		},

		loading: Boolean,
	},
	data() {
		return {
			isFullScreen: true,
			isAvailableSave: false,
		}
	},

	computed: {
		maxZet() {
			return MapsService.maxZet
		},

		isLoadingSaveMapList() {
			return MapsService.isLoadingSaveMapList
		},

		isEmpty() {
			return !this.table.length && !this.isLoadingSaveMapList
		},
	},
	methods: {
		onEdit(item) {
			this.$emit('edit-click', item.id)
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
				MapsService.moveMapItemInColLocal(
					moved.element,
					moved.oldIndex,
					moved.newIndex
				)
			}

			this.isAvailableSave = true
		},
	},
}
</script>

<style lang="sass">
.TableMaps
    height: 100%

    &-empty
        height: 100%
        display: flex
        align-items: center
        justify-content: center
</style>
