<template>
	<v-app class="Map">
		<MapHeader
			@successUploadFile="onSuccessUploadFile"
			@errorUploadFile="onErrorUploadFile"
		/>

		<v-main dark app class="Map__main">
			<v-container class="Map__main-inner" fluid>
				<TableMaps
					:loading="isLoadingMaps"
					:table="tableData"
					:activeEditingItemId="rightMenuEditItemId"
					@edit-click="onEditClick"
				/>
			</v-container>
		</v-main>

		<ui-snackbar v-bind="snackbarOptions" @input="clearSnackbarOptions" />

		<RightMenuEditMapItem
			v-model="rightMenuEditModel"
			:itemId="rightMenuEditItemId"
			@close="onCloseEditingItemPanel"
		/>
	</v-app>
</template>

<script>
import MapsService from '@services/Maps/MapsService'
import GroupsService from '@services/Groups/GroupsService'

import MapHeader from '@components/MapPage/MapHeader.vue'
import TableMaps from '@components/MapPage/Table/TableMaps.vue'
import UiSnackbar from '@components/common/MSnackbar.vue'
import RightMenuEditMapItem from '@components/MapPage/RightMenuEditMapItem.vue'

export default {
	name: 'HomeView',

	components: {
		MapHeader,
		TableMaps,
		UiSnackbar,
		RightMenuEditMapItem,
	},

	data() {
		return {
			isLoading: true,

			mapsService: MapsService,
			groupsService: GroupsService,

			snackbarOptions: null,

			rightMenuEditModel: false,
			rightMenuEditItemId: null,
		}
	},

	computed: {
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
		clearSnackbarOptions() {
			this.snackbarOptions = null
		},

		onSuccessUploadFile(aup) {
			if (aup) {
				this.$router.push({ query: { aup } }).catch(() => {})
			}

			this.snackbarOptions = {
				value: true,
				type: 'success',
				timeout: 2500,
			}
		},

		onErrorUploadFile(res) {
			this.snackbarOptions = {
				value: true,
				type: 'error',
				settings: {
					error: {
						title: 'Ошибка при загрузке файла',
						text: res?.data || 'Не удалось сохранить карту.',
					},
				},
				timeout: 2500,
			}
		},

		onEditClick(id) {
			this.rightMenuEditModel = true
			this.rightMenuEditItemId = id
		},

		onCloseEditingItemPanel() {
			this.editingMapItemId = null
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

    &__save-table-btn
        position: sticky
        bottom: 60px
        left: calc(100% - 16px)
        transition: right .2s cubic-bezier(0.4, 0, 0.2, 1)
    &__save-table-mode
        position: sticky
        bottom: 16px
        left: calc(100% - 16px)
        transition: right .2s cubic-bezier(0.4, 0, 0.2, 1)

.Map.withRightMenu
    .Map
        &__save-table-btn
            right: calc(var(--drawer-width) + 30px)
        &__save-table-mode
            right: calc(var(--drawer-width) + 30px)
</style>
