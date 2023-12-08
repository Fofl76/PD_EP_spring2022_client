<template>
	<div class="MapTable">
		<div class="MapTable__inner" v-if="!isEmpty">
			<MapTableMain
				:table="table"
				:loading="loading && !isLoadingSaveMapList"
				:max-zet="maxZet"
				:fit-mode="isFullScreen"
				@edit="onEdit"
				@drag="onDrag"
			/>

			<MapTableTools
				:availableSave="isAvailableSave"
				:loadingSave="isLoadingSaveMapList"
				@clickSave="onClickSave"
				@clickChangeMode="onClickChangeMode"
			/>
		</div>

		<div v-else class="MapTable__empty">
			<MDataPreloader />
		</div>
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import MapTableMain from '@components/Map/MapTable/MapTableMain.vue'
import MapTableTools from '@components/Map/MapTable/MapTableTools.vue'
import MDataPreloader from '@components/common/MDataPreloader.vue'

export default {
	name: 'MapTable',
	components: { MapTableMain, MapTableTools, MDataPreloader },
	props: {
		table: {
			type: Array,
			default: () => [],
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
			this.$emit('editClick', item.id)
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
					num_col: columnIndex,
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

		onClickSave() {
			this.onSaveMap()
		},

		onClickChangeMode() {
			this.isFullScreen = !this.isFullScreen
		},
	},
}
</script>

<style lang="sass">
.MapTable
    height: 100%

    &__empty
        height: 100%
        display: flex
        align-items: center
        justify-content: center
</style>
