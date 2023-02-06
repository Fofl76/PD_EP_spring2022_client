<template>
	<v-snackbar
		class="MSnackbar"
		:value="value"
		@input="onInput"
		:color="snackbar.color"
		:multi-line="snackbar.mode === 'multi-line'"
		:timeout="timeout"
		:top="snackbar.position === 'top'"
	>
		<v-layout align-center pr-4>
			<v-icon class="pr-3" dark large>{{ snackbar.icon }}</v-icon>
			<v-layout column>
				<div>
					<strong>{{ snackbar.title }}</strong>
				</div>
				<div>{{ snackbar.text }}</div>
			</v-layout>
		</v-layout>
		<v-btn v-if="snackbar.timeout === 0" icon @click="snackbar.visible = false">
			<v-icon>clear</v-icon>
		</v-btn>
	</v-snackbar>
</template>

<script>
const defaultSettings = {
	error: {
		title: 'Ошибка',
		text: 'Произошла неизвестная ошибка',
	},

	success: {
		title: 'Успешно',
		text: 'Действие выполнено успешно',
	},
}

export default {
	name: 'MSnackbar',

	props: {
		value: {
			type: Boolean,
			required: false,
			default: false,
		},

		type: {
			type: String,
			required: false,
			default: 'error',
		},

		settings: {
			type: Object,
			required: false,
			default: () => {
				return defaultSettings
			},
		},

		timeout: {
			type: Number,
			required: false,
			default: 1500,
		},
	},

	methods: {
		onInput(val) {
			this.$emit('input', val)
		},
	},

	computed: {
		snackbar() {
			switch (this.type) {
				case 'error':
					return {
						color: 'error',
						icon: 'mdi-alert-circle-outline',
						mode: 'multi-line',
						position: 'bottom',
						title: this.settings.error.title || defaultSettings.error.title,
						text: this.settings.error.text,
						visible: true,
					}
				case 'success':
					return {
						color: 'success',
						icon: 'mdi-check',
						mode: 'multi-line',
						position: 'bottom',
						title: this.settings.success.title || defaultSettings.success.title,
						text: this.settings.success.text,
						visible: true,
					}
			}

			return {}
		},
	},
}
</script>

<style lang="sass">
.MSnackbar
    z-index: 10000 !important
</style>
