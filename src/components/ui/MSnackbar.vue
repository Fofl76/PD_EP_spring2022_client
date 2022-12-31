<template>
	<v-snackbar
		:value="value"
		@input="onInput"
		auto-height
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
				return {
					error: {
						text: 'Ошибка',
					},

					success: {
						text: 'Успешно',
					},
				}
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
						title: 'Ошибка',
						text: this.settings.error.text,
						visible: true,
					}
				case 'success':
					return {
						color: 'success',
						icon: 'mdi-check',
						mode: 'multi-line',
						position: 'bottom',
						title: 'Успешно',
						text: this.settings.success.text,
						visible: true,
					}
			}

			return {}
		},
	},
}
</script>

<style></style>
