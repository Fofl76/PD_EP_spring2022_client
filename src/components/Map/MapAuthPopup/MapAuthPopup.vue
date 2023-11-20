<template>
	<v-dialog v-model="_value" width="unset">
		<div class="MapAuthPopup">
			<v-btn class="MapAuthPopup__close-btn" icon @click="closePopup">
				<v-icon>mdi-close</v-icon>
			</v-btn>

			<!-- <div class="MapAuthPopup__side MapAuthPopup__side--left">
				<div class="text-h6">Недавно входили с этих аккаунтов</div>
				<div class="subtitle-1">Нажмите на фотографию или имя, чтобы войти</div>
			</div> -->

			<div class="MapAuthPopup__side MapAuthPopup__side--right">
				<div class="MapAuthPopup__title text-h6">Авторизация</div>

				<div class="MapAuthPopup__input-block">
					<v-text-field
						class="MapAuthPopup__input"
						v-model="form.username"
						hide-details="auto"
						label="Логин"
						filled
						dense
						required
					/>
				</div>

				<div class="MapAuthPopup__input-block">
					<v-text-field
						class="MapAuthPopup__input"
						v-model="form.password"
						hide-details="auto"
						label="Пароль"
						type="password"
						filled
						dense
						required
					/>
				</div>

				<!-- <v-checkbox dense label="Сохранить вход"></v-checkbox> -->

				<v-btn color="success" block @click="onLogin">Войти</v-btn>
			</div>
		</div>
	</v-dialog>
</template>

<script>
import authService from '@services/auth/AuthService'

export default {
	name: 'MapAuthPopup',
	props: { value: Boolean },

	data() {
		return {
			form: {
				username: '',
				password: '',
			},
		}
	},

	computed: {
		_value: {
			get() {
				return this.value
			},
			set(v) {
				this.$emit('input', v)
			},
		},
	},

	methods: {
		async onLogin() {
			const res = await authService.login(this.form)

			if (res === 'error') {
				// TODO вывести ошибку
				return
			}

			this.$emit('login')
			this._value = false
			this.clearForm()
		},

		closePopup() {
			this._value = false
		},

		clearForm() {
			this.form.username = ''
			this.form.password = ''
		},
	},
}
</script>

<style lang="sass">
.MapAuthPopup
    background-color: #fff
    display: flex
    position: relative

    &__close-btn
        position: absolute
        right: 12px
        top: 12px

    &__side
        padding: 24px 32px

    &__title
        margin-bottom: 16px

    &__input-block
        margin-bottom: 12px
</style>
