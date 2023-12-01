<template>
	<v-dialog :value="value" @input="$emit('input', $event)" width="550">
		<v-card>
			<v-card-title class="text-h5">
				Сохранить изменения перед закрытием?
			</v-card-title>
			<v-card-text>
				Если вы не сохраните дисциплину, то все внесенные изменения будут
				удалены.
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="red darken-1" text @click="$emit('close')">
					Закрыть без сохранения
				</v-btn>
				<v-btn color="green darken-1" text @click="$emit('save')">
					Сохранить
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
	},

	data: () => ({
		dialog: false,
	}),
}
</script>

<style lang="scss" scoped></style>
