<template>
	<div class="MapHeaderControls">
		<!-- Группировки -->
		<MapHeaderButton label="Группировки" @click="openGroupSettingsPopupModel" />
		<!--  -->

		<v-divider class="MapHeader__divider" vertical></v-divider>

		<!-- Работа с файлами -->
		<MapHeaderDropdown icon="mdi-file-download" :disabled="!isAuth && !aupCode">
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
		</MapHeaderDropdown>

		<MapUploadFilePopup
			v-model="uploadPopupModel"
			@success="$emit('successUploadFile', $event)"
			@error="$emit('errorUploadFile', $event)"
		/>

		<MapGroupsPopup v-model="groupSettingsPopupModel" />
		<!--  -->

		<v-divider class="MapHeader__divider" vertical></v-divider>

		<!-- Авторизация -->
		<MapHeaderButton v-if="!isAuth" label="Войти" @click="openAuthPopup" />
		<MapHeaderAuthDropdown v-else @onLogout="logout" />

		<MapAuthPopup v-model="authPopupModel" @login="onLogin" />
		<!--  -->
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
