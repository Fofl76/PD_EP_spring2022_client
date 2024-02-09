<template>
	<v-dialog
		contentClass="MapRightMenuConfirmPopup"
		:value="value"
		@input="$emit('input', $event)"
		width="550"
	>
		<v-card>
			<v-card-title class="text-h5">{{ title }}</v-card-title>
			<v-card-text> {{ content }}</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="red darken-1" text @click="$emit('close')">
					Закрыть без сохранения
				</v-btn>

				<v-btn
					v-if="!isError"
					color="green darken-1"
					text
					@click="$emit('save')"
				>
					Сохранить
				</v-btn>

				<v-btn v-else color="green darken-1" text @click="$emit('back')">
					Вернуться
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'MapRightMenuConfirmPopup',

	props: {
		value: {
			type: Boolean,
			default: false,
		},

		isError: {
			type: Boolean,
			default: false,
		},
	},

	data: () => ({
		dialog: false,
	}),

	computed: {
		title() {
			return this.isError
				? 'Закрыть редактирование дисциплины?'
				: 'Сохранить изменения перед закрытием?'
		},

		content() {
			return this.isError
				? 'В текущей дисциплине обнаружены ошибки. Если вы закроете дисциплину, то все внесенные изменения будут удалены.'
				: 'Если вы не сохраните дисциплину, то все внесенные изменения будут удалены.'
		},
	},
}
</script>

<style lang="sass"></style>
