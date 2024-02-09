<template>
	<v-app class="Map">
		<MapHeader @successUploadFile="onSuccessUploadFile" />

		<v-main dark app class="Map__main">
			<v-container class="Map__main-inner" fluid>
				<MapTable
					:loading="isLoadingMaps"
					:table="tableData"
					:activeEditingItemId="rightMenuEditItemId"
					@editClick="onEditClick"
				/>
			</v-container>
		</v-main>

		<MapRightMenu
			:value="rightMenuEditModel"
			:itemId="rightMenuEditItemId"
			@input="onInputRightMenuEditModel"
		/>
	</v-app>
</template>

<script>
import MapsService from '@services/Maps/MapsService'
import GroupsService from '@services/Groups/GroupsService'

import MapHeader from '@components/Map/MapHeader/MapHeader.vue'
import MapTable from '@components/Map/MapTable/MapTable.vue'
import MapRightMenu from '@components/Map/MapRightMenu/MapRightMenu.vue'

import { mapGetters, mapMutations } from 'vuex'

export default {
	name: 'Map',

	components: {
		MapHeader,
		MapTable,
		MapRightMenu,
	},

	data() {
		return {
			isLoading: true,

			mapsService: MapsService,
			groupsService: GroupsService,

			snackbarOptions: null,
		}
	},

	computed: {
		...mapGetters('Map', ['rightMenuEditModel', 'rightMenuEditItemId']),

		allGroupsMapId() {
			return this.groupsService.allGroupsMapId
		},

		isLoadingMaps() {
			return this.mapsService.isLoadingMapList
		},

		tableData() {
			return this.mapsService.mapList?.value
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
	},

	methods: {
		...mapMutations('Map', ['setRightMenuEditModel', 'setRightMenuEditItemId']),

		onSuccessUploadFile(aup) {
			if (aup) {
				this.$router.push({ query: { aup } }).catch(() => {})
			}
		},

		onEditClick(id) {
			this.setRightMenuEditModel(true)
			this.setRightMenuEditItemId(id)
		},

		onInputRightMenuEditModel(value) {
			this.setRightMenuEditModel(value)

			if (!value) this.setRightMenuEditItemId(null)
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
