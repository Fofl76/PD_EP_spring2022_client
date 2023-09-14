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

		<div v-if="!isAuth" class="header-buttons">
		<MapHeaderButton label="Войти" @click="openAuthPopup" />
		</div>
		<div v-else class="AuthUser">
		<v-menu offset-y>
			<template v-slot:activator="{ on }">
			<v-avatar v-on="on">
				<v-img
				src="http://placekitten.com/250/300"
				alt="User Avatar"
				class="avatar-icon"
				style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #ccc; padding: 2px;"
				></v-img>
			</v-avatar>
			</template>
			<v-list>
			<v-list-item>
				<v-list-item-title>
				<!-- Отображение имени пользователя -->
				Фамилия
				</v-list-item-title>
			</v-list-item>
			<v-list-item>
				<v-list-item-title>
				<!-- Отображение почты пользователя -->
				user@example.com
				</v-list-item-title>
			</v-list-item>
			<v-list-item @click="logout">
				<v-list-item-title>
				<v-btn text color="error">
					Выйти
				</v-btn>
				</v-list-item-title>
			</v-list-item>
			</v-list>
		</v-menu>
		</div>
		<MapAuthPopup v-model="authPopupModel" @login="onLogin" />

	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'
import MapHeaderButton from '@components/Map/MapHeader/MapHeaderButton.vue'
import MapGroupsPopup from '@components/Map/MapGroupsPopup/MapGroupsPopup.vue'
import MapUploadFilePopup from '@components/Map/MapUploadFilePopup/MapUploadFilePopup.vue'
import MapAuthPopup from '@components/Map/MapAuthPopup/MapAuthPopup.vue'

import { mapGetters, mapMutations } from 'vuex';
import axios from '@services/api/axios'

export default {
	name: 'MapHeaderControls',
	components: { MapHeaderButton, MapGroupsPopup, MapUploadFilePopup, MapAuthPopup},

	data() {
		return {
			uploadPopupModel: false,
			groupSettingsPopupModel: false,
			authPopupModel: false,
			isAuth: false,
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
			console.log("Open Auth Popup"); // Добавьте эту строку
			console.log(this.$store.getters['Map/isAuth']);
  			this.authPopupModel = true;
		},

		onLogin() {
			this.authPopupModel = false;
			// Установить состояние авторизации на true
			this.$store.commit('Map/setAuthStatus', true);
			this.isAuth = this.$store.getters['Map/isAuth'];
		},

		logout() {
			// Здесь вы можете добавить логику для выхода из системы, если это необходимо
			// Сбросить состояние авторизации
			this.$store.commit('Map/setAuthStatus', false);
			this.isAuth = this.$store.getters['Map/isAuth'];
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
		...mapGetters(['isAuth']),
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
  align-items: center

.header-buttons
  display: flex
  align-items: center
  margin-right: 20px  // Расстояние между кнопками
  border-right: 2px solid #ccc  // Серый бордер справа

.AuthUser
  display: flex
  align-items: center

.avatar-icon
  margin-right: 7px  // Расстояние между аватаркой и текстом
</style>