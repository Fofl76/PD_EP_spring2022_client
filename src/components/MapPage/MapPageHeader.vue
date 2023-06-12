<template>
	<v-app-bar app class="HomeHeader full-width" height="80" dark clipped-right>
		<MapPageHeaderSelectMap />

		<v-spacer></v-spacer>

		<v-btn @click="popupGroupSettingsModel = true" text dark>
			<span>Группировки</span>
		</v-btn>

		<v-btn text dark @click="popupUploadModel = true">
			<span>Загрузить план</span>
			<v-icon right dark>mdi-upload</v-icon>
		</v-btn>

		<v-btn v-if="isReady" :href="`${url}/save_excel/${aupCode}`" target="_blank" text dark>
			<span>Скачать</span>
			<v-icon right dark>mdi-download</v-icon>
		</v-btn>

		<v-menu>
			<template v-slot:activator="{ on, attrs }">
				<v-icon v-bind="attrs" v-on="on" right dark @click="isOpenLoginDialog = !isOpenLoginDialog">mdi-account</v-icon>
			</template>
		</v-menu>
		<popup-upload-file v-model="popupUploadModel" @success="$emit('successUploadFile', $event)"
			@error="$emit('errorUploadFile', $event)" />

		<popup-groups-settings v-model="popupGroupSettingsModel" />
		<login-dialog v-model="isOpenLoginDialog" />
	</v-app-bar>
</template>

<script>
import MapPageHeaderSelectMap from '@components/MapPage/MapPageHeaderSelectMap.vue'
import PopupGroupsSettings from '@components/PopupGroupsSetings/PopupGroupsSettings.vue'
import {
	mdiAccount
} from '@mdi/js'
import MapsService from '@services/Maps/MapsService'
import LoginDialog from './LoginDialog.vue'
import PopupUploadFile from './PopupUploadFile/PopupUploadFile.vue'

export default {
	name: 'MapPageHeader',

	components: { MapPageHeaderSelectMap, PopupUploadFile, PopupGroupsSettings, LoginDialog },
	data() {
		return {
			popupUploadModel: false,
			popupGroupSettingsModel: false,
			mdiAccount,
			isOpenLoginDialog: false,
		}
	},
	computed: {
		isReady() {
			return !!MapsService.mapList.value.length
		},

		url() {
			return process.env.VUE_APP_API
		},

		aupCode() {
			return this.$route.query.aup
		},
	},
}
</script>

<style lang="sass">
.MapPageHeader
</style>
