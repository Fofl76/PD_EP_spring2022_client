<template>
	<v-app-bar app class="MapHeader" height="80" dark clipped-right>
		<MapHeaderSelectBlock />

		<v-spacer></v-spacer>

		<v-btn @click="popupGroupSettingsModel = true" text dark>
			<span>Группировки</span>
		</v-btn>

		<v-btn text dark @click="popupUploadModel = true">
			<span>Загрузить план</span>
			<v-icon right dark>mdi-upload</v-icon>
		</v-btn>

		<v-btn v-if="isReady" @click="downloadMap" text dark>
			<span>Скачать</span>
			<v-icon right dark>mdi-download</v-icon>
		</v-btn>

		<v-menu>
			<template v-slot:activator="{ on, attrs }">
				<v-icon
					v-bind="attrs"
					v-on="on"
					right
					dark
					@click="isOpenLoginDialog = !isOpenLoginDialog"
					>mdi-account</v-icon
				>
			</template>
		</v-menu>

		<PopupUploadFile
			v-model="popupUploadModel"
			@success="$emit('successUploadFile', $event)"
			@error="$emit('errorUploadFile', $event)"
		/>

		<PopupGroupsSettings v-model="popupGroupSettingsModel" />
		<LoginDialog v-model="isOpenLoginDialog" />
	</v-app-bar>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import MapHeaderSelectBlock from '@components/MapPage/MapHeaderSelectBlock.vue'
import PopupGroupsSettings from '@components/PopupGroupsSetings/PopupGroupsSettings.vue'
import LoginDialog from './LoginDialog.vue'
import PopupUploadFile from './PopupUploadFile/PopupUploadFile.vue'
import axios from '@services/api/axios'

export default {
	name: 'MapHeader',

	components: {
		MapHeaderSelectBlock,
		PopupUploadFile,
		PopupGroupsSettings,
		LoginDialog,
	},

	data() {
		return {
			popupUploadModel: false,
			popupGroupSettingsModel: false,
			isOpenLoginDialog: false,
		}
	},

	methods: {
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
				// обработка ошибки в будущем
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
.MapHeader
</style>
