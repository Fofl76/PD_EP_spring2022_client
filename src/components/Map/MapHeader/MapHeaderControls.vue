<template>
	<div class="MapHeaderControls">
		<MapHeaderButton label="Группировки" @click="openGroupSettingsPopupModel" />

		<!-- Работа с файлами -->
		<MapHeaderDropdown icon="mdi-file">
			<MapHeaderButton
				label="Загрузить план"
				icon="mdi-upload"
				@click="openUploadPopup"
			/>

			<MapHeaderButton
				label="Скачать"
				icon="mdi-download"
				@click="downloadMap"
			/>
		</MapHeaderDropdown>
		<!--  -->

		<MapUploadFilePopup
			v-model="uploadPopupModel"
			@success="$emit('successUploadFile', $event)"
			@error="$emit('errorUploadFile', $event)"
		/>

		<MapGroupsPopup v-model="groupSettingsPopupModel" />

		<v-divider vertical></v-divider>

		<div v-if="!isAuth" class="header-buttons">
			<MapHeaderButton label="Войти" @click="openAuthPopup" />
		</div>

		<MapHeaderAuthDropdown v-else @onLogout="logout" />

		<MapAuthPopup v-model="authPopupModel" @login="onLogin" />
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'
import MapHeaderButton from '@components/Map/MapHeader/MapHeaderButton.vue'
import MapHeaderDropdown from '@components/Map/MapHeader/MapHeaderDropdown.vue'
import MapHeaderAuthDropdown from '@components/Map/MapHeader/MapHeaderAuthDropdown.vue'
import MapGroupsPopup from '@components/Map/MapGroupsPopup/MapGroupsPopup.vue'
import MapUploadFilePopup from '@components/Map/MapUploadFilePopup/MapUploadFilePopup.vue'
import MapAuthPopup from '@components/Map/MapAuthPopup/MapAuthPopup.vue'

import { mapGetters, mapMutations } from 'vuex'
import axios from '@services/api/axios'
import authService from '@services/auth/AuthService'

export default {
	name: 'MapHeaderControls',
	components: {
		MapHeaderButton,
		MapHeaderDropdown,
		MapHeaderAuthDropdown,
		MapGroupsPopup,
		MapUploadFilePopup,
		MapAuthPopup,
	},

	data() {
		return {
			uploadPopupModel: false,
			groupSettingsPopupModel: false,
			authPopupModel: false,
		}
	},

	methods: {
		...mapMutations(['setAuthStatus']),
		openGroupSettingsPopupModel() {
			this.groupSettingsPopupModel = true
		},

		openUploadPopup() {
			this.uploadPopupModel = true
		},

		openAuthPopup() {
			this.authPopupModel = true
		},

		onLogin() {
			this.authPopupModel = false
		},

		logout() {
			authService.logout()
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
		...mapGetters('Map', ['isAuth']),
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
  gap: 8px
  align-items: center

.header-buttons
  display: flex
  align-items: center
  margin-right: 20px  // Расстояние между кнопками

.AuthUser
  display: flex
  align-items: center

.avatar-icon
  margin-right: 7px  // Расстояние между аватаркой и текстом
</style>
