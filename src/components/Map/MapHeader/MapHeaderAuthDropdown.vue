<template>
	<MapHeaderDropdown class="MapHeaderAuthDropdown" :value="isOpen">
		<template #activator>
			<v-btn text dark icon @click="isOpen = !isOpen">
				<v-icon dark>mdi-account</v-icon>
			</v-btn>
		</template>

		<template>
			<v-list-item>
				<v-list-item-title> {{ loginLoggedUser }} </v-list-item-title>
			</v-list-item>
			<v-list-item>
				<v-list-item-title>
					<v-btn text color="error" @click="$emit('onLogout')"> Выйти </v-btn>
				</v-list-item-title>
			</v-list-item></template
		>
	</MapHeaderDropdown>
</template>

<script>
import MapHeaderDropdown from '@components/Map/MapHeader/MapHeaderDropdown.vue'
import authService from '@services/auth/AuthService'

export default {
	name: 'MapHeaderAuthDropdown',

	components: {
		MapHeaderDropdown,
	},

	data: () => ({
		isOpen: false,
	}),

	computed: {
		loggedUser() {
			return authService.loggedUser
		},

		loginLoggedUser() {
			return this.loggedUser?.login
		},
	},
}
</script>

<style lang="sass" scoped></style>
