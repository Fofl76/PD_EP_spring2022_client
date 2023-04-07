<template>
	<v-app-bar app class="HomeHeader full-width" height="80" dark clipped-right>
		<div class="HomeHeader__inner">
			<header-form-direction />
		</div>

		<v-spacer></v-spacer>

		<v-btn @click="popupGroupSettingsModel = true" text dark>
			<span>Группировки</span>
		</v-btn>

		<v-btn text dark @click="popupUploadModel = true">
			<span>Загрузить план</span>
			<v-icon right dark>mdi-upload</v-icon>
		</v-btn>

		<v-btn
			v-if="isReady"
			:href="`${url}/save_excel/${aupCode}`"
			target="_blank"
			text
			dark
		>
			<span>Скачать</span>
			<v-icon right dark>mdi-download</v-icon>
		</v-btn>

		<popup-upload-file
			v-model="popupUploadModel"
			@success="$emit('successUploadFile', $event)"
			@error="$emit('errorUploadFile', $event)"
		/>

		<popup-groups-settings v-model="popupGroupSettingsModel" />
	</v-app-bar>
</template>

<script>
import MapsService from '@services/Maps/MapsService'
import HeaderFormDirection from './HeaderFormDirection/HeaderFormDirection.vue'
import PopupUploadFile from './PopupUploadFile/PopupUploadFile.vue'
import PopupGroupsSettings from '@components/PopupGroupsSetings/PopupGroupsSettings.vue'

export default {
	name: 'MapPageHeader',

	components: { HeaderFormDirection, PopupUploadFile, PopupGroupsSettings },
	data() {
		return {
			popupUploadModel: false,
			popupGroupSettingsModel: false,
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
