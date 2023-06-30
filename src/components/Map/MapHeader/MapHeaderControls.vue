<template>
	<div class="MapHeaderControls">
		<MapHeaderButton label="Группировки" @click="openGroupSettingsPopupModel" />

		<MapHeaderButton label="Модули" @click="openModulesPopup" />

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
		<MapPopupModules v-model="popupModulesModel" v-if="popupModulesModel" />
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import MapHeaderButton from '@components/Map/MapHeader/MapHeaderButton.vue'
import MapGroupsPopup from '@components/Map/MapGroupsPopup/MapGroupsPopup.vue'
import MapUploadFilePopup from '@components/Map/MapUploadFilePopup/MapUploadFilePopup.vue'
import MapPopupModules from '@components/Map/MapModules/MapPopupModules.vue'

import axios from '@services/api/axios'

export default {
	name: 'MapHeaderControls',
	components: {
		MapHeaderButton,
		MapGroupsPopup,
		MapUploadFilePopup,
		MapPopupModules,
	},

	data() {
		return {
			uploadPopupModel: false,
			groupSettingsPopupModel: false,
			popupModulesModel: false,
		}
	},

	methods: {
		openGroupSettingsPopupModel() {
			this.groupSettingsPopupModel = true
		},

		openModulesPopup() {
			this.popupModulesModel = true
		},

		openUploadPopup() {
			this.uploadPopupModel = true
		},

		async downloadMap() {
			try {
				const resp = await axios.get(this.downloadURL, {
					responseType: 'blob',
				})

				const file = new Blob([resp.data])

				const link = document.createElement('a')
				link.download = `${this.aupCode}.xlsx`
				link.href = URL.createObjectURL(file)

				link.click()
				URL.revokeObjectURL(link.href)
			} catch (err) {
				console.log(err)
			}
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
