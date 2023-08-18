<template>
	<div class="MapHeaderControls">
		<MapHeaderButton label="Группировки" @click="openGroupSettingsPopupModel" />

		<MapHeaderButton
			label="Загрузить план"
			icon="mdi-upload"
			@click="openUploadPopup"
		/>

		<MapHeaderButton label="Скачать" icon="mdi-download" @click="openDownloadPopup" />

		<MapUploadFilePopup
			v-model="uploadPopupModel"
			@success="$emit('successUploadFile', $event)"
			@error="$emit('errorUploadFile', $event)"
		/>

		<MapDownloadPopup v-model="downloadPopupModel"/>
		<MapGroupsPopup v-model="groupSettingsPopupModel" />
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import MapHeaderButton from '@components/Map/MapHeader/MapHeaderButton.vue'
import MapGroupsPopup from '@components/Map/MapGroupsPopup/MapGroupsPopup.vue'
import MapUploadFilePopup from '@components/Map/MapUploadFilePopup/MapUploadFilePopup.vue'

import MapDownloadPopup from '../MapDownloadPopup/MapDownloadPopup.vue'

export default {
	name: 'MapHeaderControls',
	components: { MapHeaderButton, MapGroupsPopup, MapUploadFilePopup, MapDownloadPopup },

	data() {
		return {
			uploadPopupModel: false,
			groupSettingsPopupModel: false,
			downloadPopupModel: false,
		}
	},

	methods: {
		openGroupSettingsPopupModel() {
			this.groupSettingsPopupModel = true
		},

		openUploadPopup() {
			this.uploadPopupModel = true
		},

		openDownloadPopup() {
			this.downloadPopupModel = true
		},
	},

	computed: {
		isReady() {
			return !!MapsService.mapList.value.length
		},
	},
}
</script>

<style lang="sass">
.MapHeaderControls
    display: flex
</style>
