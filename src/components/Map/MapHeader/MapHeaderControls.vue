<template>
	<div class="MapHeaderControls">
		<!-- Группировки -->
		<MapHeaderButton label="Группировки" @click="openGroupSettingsPopupModel" />
		<!--  -->

		<!-- Модули -->
		<MapHeaderButton label="Модули" @click="openModulesPopup" />
		<!--  -->

		<v-divider class="MapHeader__divider" vertical></v-divider>

		<!-- Работа с файлами -->
		<MapHeaderDropdown
			icon="mdi-file-download"
			:disabled="!isAuth && !aupCode && isLoadingFile"
			:loading="isLoadingFile"
		>
			<v-list-item
				class="MapHeaderDropdownListItem"
				@click="openUploadPopup"
				:disabled="!isAuth"
			>
				<v-list-item-icon>
					<v-icon>mdi-upload</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>Загрузить план</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

			<v-list-item
				class="MapHeaderDropdownListItem"
				@click="downloadMap"
				:disabled="!aupCode"
			>
				<v-list-item-icon>
					<v-icon>mdi-download</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>Скачать</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

			<v-list-item
				class="MapHeaderDropdownListItem"
				@click="downloadMapXML"
				:disabled="!aupCode"
			>
				<v-list-item-icon>
					<v-icon>mdi-download</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>Скачать в XML</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</MapHeaderDropdown>

		<MapUploadFilePopup v-model="uploadPopupModel" />

		<MapGroupsPopup v-model="groupSettingsPopupModel" />
		<!--  -->

		<v-divider class="MapHeader__divider" vertical></v-divider>

		<!-- Авторизация -->
		<MapHeaderButton v-if="!isAuth" label="Войти" @click="openAuthPopup" />
		<MapHeaderAuthDropdown v-else @onLogout="logout" />

		<MapAuthPopup v-model="authPopupModel" @login="onLogin" />
		<!--  -->

		<!-- Модули -->
		<MapModulesPopup v-model="modulesPopupModel" v-if="modulesPopupModel" />
		<!--  -->
	</div>
</template>

<script>
import MapHeaderButton from '@components/Map/MapHeader/MapHeaderButton.vue'
import MapHeaderDropdown from '@components/Map/MapHeader/MapHeaderDropdown.vue'
import MapHeaderAuthDropdown from '@components/Map/MapHeader/MapHeaderAuthDropdown.vue'
import MapGroupsPopup from '@components/Map/MapGroupsPopup/MapGroupsPopup.vue'
import MapUploadFilePopup from '@components/Map/MapUploadFilePopup/MapUploadFilePopup.vue'
import MapAuthPopup from '@components/Map/MapAuthPopup/MapAuthPopup.vue'
import MapModulesPopup from '@components/Map/MapModulesPopup/MapModulesPopup.vue'

import { mapGetters } from 'vuex'

import MapsService from '@services/Maps/MapsService'
import ToastService from '@services/ToastService'
import Api from '@services/api/Api'
import authService from '@services/auth/AuthService'

import downloadAsFile from '@services/utils/downloadAsFile'

export default {
	name: 'MapHeaderControls',
	components: {
		MapHeaderButton,
		MapHeaderDropdown,
		MapHeaderAuthDropdown,
		MapGroupsPopup,
		MapUploadFilePopup,
		MapModulesPopup,
		MapAuthPopup,
	},

	data() {
		return {
			uploadPopupModel: false,
			groupSettingsPopupModel: false,
			authPopupModel: false,
			modulesPopupModel: false,
			isLoadingFile: false,
		}
	},

	methods: {
		openGroupSettingsPopupModel() {
			this.groupSettingsPopupModel = true
		},

		openUploadPopup() {
			this.uploadPopupModel = true
		},

		openAuthPopup() {
			this.authPopupModel = true
		},

		openModulesPopup() {
			this.modulesPopupModel = true
		},

		onLogin() {
			this.authPopupModel = false
		},

		logout() {
			authService.logout()
		},

		async downloadMap() {
			try {
				this.isLoadingFile = true

				const { data, success } = await Api.downloadMap(this.aupCode)

				if (success) {
					downloadAsFile(data, `${this.aupCode}.xlsx`)
					ToastService.showSuccess('Карта успешно загружена')
				}
			} catch (err) {
				console.log(err)
				ToastService.showSuccess('Произошла ошибка при загрузке карты')
			} finally {
				this.isLoadingFile = false
			}
		},

		async downloadMapXML() {
			try {
				this.isLoadingFile = true

				const { data, success } = await Api.downloadMapXML(this.aupCode)

				if (success) {
					downloadAsFile(data, `${this.aupCode}.xml`)
					ToastService.showSuccess('Карта в XML успешно загружена')
				}
			} catch (err) {
				console.log(err)
				ToastService.showSuccess('Произошла ошибка при загрузке карты в XML')
			} finally {
				this.isLoadingFile = false
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
    height: 100%
    max-height: 48px

.header-buttons
    display: flex
    align-items: center
    margin-right: 20px

.AuthUser
    display: flex
    align-items: center

.avatar-icon
    margin-right: 7px
</style>
