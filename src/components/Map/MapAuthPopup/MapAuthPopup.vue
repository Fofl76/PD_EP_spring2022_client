<template>
	<v-dialog v-model="_value" width="350">
		<div class="MapAuthPopup">
			<v-btn class="MapAuthPopup__close-btn" icon @click="closePopup">
				<v-icon>mdi-close</v-icon>
			</v-btn>

			<!-- <div class="MapAuthPopup__side MapAuthPopup__side--left">
				<div class="text-h6">Недавно входили с этих аккаунтов</div>
				<div class="subtitle-1">Нажмите на фотографию или имя, чтобы войти</div>
			</div> -->

			<div class="MapAuthPopup__side MapAuthPopup__side--right">
				<div class="MapAuthPopup__title text-h6 grey--text text--darken-3">
					Авторизация
				</div>

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

				<div class="MapAuthPopup__footer">
					<v-checkbox
						class="MapAuthPopup__checkbox"
						label="Сохранить вход"
						dense
						hide-details
					>
						<template #label>
							<div class="MapAuthPopup__checkbox-label">Запомнить меня</div>
						</template>
					</v-checkbox>

					<div class="MapAuthPopup__forgot text--darken-3">
						<a href="#" target="_blank">Забыли пароль?</a>
					</div>
				</div>

				<v-btn color="success" :loading="isLoading" block @click="onLogin">
					Войти
				</v-btn>
			</div>
		</div>
	</v-dialog>
</template>

<script>
import authService from '@services/auth/AuthService'
import ToastService from '@services/ToastService'

export default {
	name: 'MapAuthPopup',
	props: { value: Boolean },

	data() {
		return {
			form: {
				username: '',
				password: '',
			},

			isLoading: false,
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
			this.isLoading = true

			const res = await authService.login(this.form)

			console.log(res)

			if (!res.success) {
				ToastService.showError('Неверный логин или пароль. Попробуйте еще раз')
			} else {
				ToastService.showSuccess('Вы успешно авторизовались')
				this.$emit('login')
				this._value = false
				this.clearForm()
			}

			this.isLoading = false
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
    position: relative

    &__close-btn
        position: absolute
        right: 12px
        top: 12px

    &__side
        padding: 16px 32px 24px 32px

    &__title
        margin-bottom: 8px

    &__forgot
        font-size: 14px


    &__input-block
        margin-bottom: 12px

    &__footer
        margin-bottom: 16px
        display: flex
        align-items: center
        justify-content: space-between

    &__checkbox
        margin-top: 0 !important
        padding-top: 0 !important

    &__checkbox-label
        font-size: 14px
</style>
