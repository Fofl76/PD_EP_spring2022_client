<template>
	<v-app>
		<div class="Home">
			<home-header
				:aupCode="'aupCode'"
				@successUploadFile="onSuccessUploadFile"
				@errorUploadFile="onErrorUploadFile"
			/>

			<v-main dark app class="Home__main">
				<v-container class="Home__main-inner" fluid>
					<table-maps
						:loading="isLoadingMaps"
						:table="mapsService.mapList?.value"
					/>
				</v-container>
			</v-main>

			<ui-snackbar
				v-bind="snackbarOptions"
				@input="clearSnackbarOptions"
			/>
		</div>
	</v-app>
</template>

<script>
import Vue from 'vue'
import MapsService from '@services/Maps/MapsService'
import GroupsService from '@services/Groups/GroupsService'
import HomeHeader from '@components/HomePage/HomeHeader/HomeHeader.vue'
import TableMaps from '@components/HomePage/Table/TableMaps.vue'
import UiSnackbar from '@components/ui/UiSnackbar/UiSnackbar.vue'

export default {
	name: 'HomeView',
	components: {
		HomeHeader,
		TableMaps,
		UiSnackbar,
	},
	data() {
		return {
			isLoading: true,
			mapsService: MapsService,
			groupsService: GroupsService,

			snackbarOptions: null
		}
	},
	computed: {
		allGroupsMapId() {
			return this.groupsService.allGroupsMapId
		},
		isLoadingMaps() {
			return this.mapsService.isLoadingMapList
		}
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
				timeout: 2500
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
					}
				},
				timeout: 2500
			}
		},
	},
	async created() {
		await this.groupsService.fetchAllGroups()

		await this.mapsService.fetchFacultiesList()
	},
}
</script>

<style lang="sass">
.Home
    height: 100%

    &__main
        height: 100%
        background-color: #444

    &__main-inner
        box-shadow: 0px 0px 100px 5px rgba(0, 0, 0, 0.3) inset
        padding: 16px
        height: 100%

    &__main-empty
        width: 100%
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        font-size: 1.5em

    &__main-empty-inner
        color: #fff
        display: flex
        flex-direction: column
        align-items: center

    &__main-empty-icon
        margin-bottom: 12px

    &__main-empty-title
        margin-bottom: 4px !important

    &__nodata-block
        color: #fff

    &__save-table-btn
        position: fixed
        bottom: 90px
        right: 30px
        transition: right .2s cubic-bezier(0.4, 0, 0.2, 1)
    &__save-table-mode
        position: fixed
        bottom: 30px
        right: 30px
        transition: right .2s cubic-bezier(0.4, 0, 0.2, 1)

.Home.withRightMenu
    .Home
        &__save-table-btn
            right: calc(var(--drawer-width) + 30px)
        &__save-table-mode
            right: calc(var(--drawer-width) + 30px)
</style>

