<template>
	<MapHeaderDropdown class="MapHeaderAuthDropdown" v-model="isOpen">
		<template #activator>
			<v-btn
				class="MapHeaderAuthDropdownActivator"
				:class="{ isOpen }"
				block
				text
				dark
				height="100%"
				@click="isOpen = !isOpen"
			>
				<div class="MapHeaderAuthDropdownActivator__inner">
					<v-avatar
						class="MapHeaderAuthDropdownActivator__avatar"
						size="48"
						:color="colorAvatar"
					>
						<span>{{ shortLogin }}</span>
					</v-avatar>
					<div class="MapHeaderAuthDropdownActivator__name-block">
						<span class="MapHeaderAuthDropdownActivator__name">
							{{ loginLoggedUser }}
						</span>

						<span class="MapHeaderAuthDropdownActivator__role">
							Администратор
						</span>
					</div>

					<MChevron :isOpen="isOpen" />
				</div>
			</v-btn>
		</template>

		<template>
			<v-list-item class="MapHeaderDropdownListItem" @click="$emit('onLogout')">
				<v-list-item-icon>
					<v-icon>mdi-logout</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>Выйти</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</template>
	</MapHeaderDropdown>
</template>

<script>
import MapHeaderDropdown from '@components/Map/MapHeader/MapHeaderDropdown.vue'
import MChevron from '@components/common/MChevron.vue'
import authService from '@services/auth/AuthService'
import stringToColor from '@utils/stringToColor'

export default {
	name: 'MapHeaderAuthDropdown',

	components: {
		MapHeaderDropdown,
		MChevron,
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

		shortLogin() {
			return this.loginLoggedUser.slice(0, 3)
		},

		colorAvatar() {
			return stringToColor(this.shortLogin)
		},
	},
}
</script>

<style lang="sass">
.MapHeaderAuthDropdown
    height: 100%

.MapHeaderAuthDropdownActivator
    padding-left: 0 !important
    border-radius: 38px 4px 4px 38px

    /* Перезапись vuetify стилей */
    &.isOpen:before
        opacity: 0.08

    &__avatar
        position: relative
        z-index: 2

    &__inner
        display: flex
        align-items: center

    &__name-block
        margin: 0 12px
        display: flex
        flex-direction: column
        text-align: left

    &__role
        font-size: .8em
        text-transform: none
</style>
