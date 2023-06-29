<template>
	<div class="MapHeaderControls">
		<MapHeaderButton label="Группировки" @click="openGroupSettingsPopupModel" />

		<MapHeaderButton
			label="Загрузить план"
			icon="mdi-upload"
			@click="openUploadPopup"
		/>

		<MapHeaderButton label="Скачать" icon="mdi-download" @click="downloadMap" />

		<MapUploadFilePopup
			v-model="uploadPopupModel"
			@success="$emit('successUploadFile', $event)"
			@error="$emit('errorUploadFile', $event)"
		/>

		<MapGroupsPopup v-model="groupSettingsPopupModel" />
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import MapHeaderButton from '@components/MapPage/common/MapHeaderButton.vue'
import MapGroupsPopup from '@components/MapGroupsPopup/MapGroupsPopup.vue'
import MapUploadFilePopup from '@components/MapPage/MapUploadFilePopup.vue'

export default {
	name: 'MapHeaderControls',
	components: { MapHeaderButton, MapGroupsPopup, MapUploadFilePopup },

	data() {
		return {
			uploadPopupModel: false,
			groupSettingsPopupModel: false,
		}
	},

	methods: {
		openGroupSettingsPopupModel() {
			this.groupSettingsPopupModel = true
		},

		openUploadPopup() {
			this.uploadPopupModel = true
		},

		// Нужно отрефакторить, сделать по-нормальному, чтобы не открывать вкладку
		downloadMap() {
			window.open(this.downloadURL, '_blank')
		},
	},

	computed: {
		isReady() {
			return !!MapsService.mapList.value.length
		},

		aupCode() {
			return this.$route.query.aup
		},

		downloadURL() {
			return `${process.env.VUE_APP_API}/save_excel/${this.aupCode}`
		},
	},
}
</script>

<style lang="sass">
.MapHeaderControls
    display: flex
</style>
