<template>
	<v-app class="Map">
		<MapHeader @successUploadFile="onSuccessUploadFile" />

		<v-main dark app class="Map__main">
			<v-container class="Map__main-inner" fluid>
				<MapTable
					:loading="isLoadingMaps"
					:table="tableData"
					@editClick="onEditClick"
				/>
			</v-container>
		</v-main>

		<MapRightMenu
			:value="rightMenuEditModel"
			:itemId="lastSelectedId"
			@input="onInputRightMenuEditModel"
		/>
	</v-app>
</template>

<script>
import MapsService from '@services/Maps/MapsService'
import mapSelectionService from '@services/Maps/mapSelectionService'
import GroupsService from '@services/Groups/GroupsService'

import MapHeader from '@components/Map/MapHeader/MapHeader.vue'
import MapTable from '@components/Map/MapTable/MapTable.vue'
import MapRightMenu from '@components/Map/MapRightMenu/MapRightMenu.vue'

import { mapGetters, mapMutations } from 'vuex'

import withEventEmitter from '@mixins/withEventEmitter'

export default {
	name: 'Map',

	components: {
		MapHeader,
		MapTable,
		MapRightMenu,
	},

	mixins: [
		withEventEmitter('mapSelectionService', 'mapSelectionServiceHandlers'),
	],

	data() {
		return {
			isLoading: true,

			mapsService: MapsService,
			groupsService: GroupsService,

			mapSelectionService,
			lastSelectedId: null,

			mapSelectionServiceHandlers: {
				select: this.onSelect,
				unselect: this.clearLastSelectedId,
				clear: this.clearLastSelectedId,
			},
		}
	},

	computed: {
		...mapGetters('Map', ['rightMenuEditModel']),

		allGroupsMapId() {
			return this.groupsService.allGroupsMapId
		},

		isLoadingMaps() {
			return this.mapsService.isLoadingMapList
		},

		tableData() {
			return this.mapsService.mapList?.value
		},

		selectedItemsCount() {
			return Object.keys(this.mapSelectionService.selectedItems).length
		},
	},

	watch: {
		'$route.query.aup': {
			async handler(aupCode) {
				if (!aupCode) return

				this.mapsService.fetchMapList(aupCode)
			},
			deep: true,
			immediate: true,
		},

		selectedItemsCount(value) {
			this.setRightMenuEditModel(value === 1)
		},
	},

	methods: {
		...mapMutations('Map', ['setRightMenuEditModel']),

		onSuccessUploadFile(aup) {
			if (aup) {
				this.$router.push({ query: { aup } }).catch(() => {})
			}
		},

		onSelect(ids) {
			this.lastSelectedId = ids[0]
		},

		clearLastSelectedId() {
			this.lastSelectedId = null
			this.setRightMenuEditModel(false)
		},

		onEditClick(id) {
			/* this.setRightMenuEditModel(true) */
		},

		onInputRightMenuEditModel(value) {
			this.setRightMenuEditModel(value)
		},
	},

	async created() {
		await this.groupsService.fetchAllGroups()
		await this.mapsService.fetchFacultiesList()
		await this.mapsService.fetchUnitsOfMeasurement()
	},
}
</script>

<style lang="sass">
.Map
    height: 100%

    &__main
        height: 100%
        background-color: #444

    &__main-inner
        box-shadow: 0px 0px 100px 5px rgba(0, 0, 0, 0.3) inset
        padding: 16px
        height: 100%
</style>
