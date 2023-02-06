<template>
	<v-dialog v-model="value_" max-width="400" class="PopupUploadDocument">
		<v-card
			class="PopupUploadDocument__card"
			:class="{ 'grey lighten-2': dragover }"
		>
			<v-card-title class="text-h5"> Сформировать КД </v-card-title>
			<v-card-text class="PopupUploadDocument__text">
				<UploadFileDragArea
					v-model="uploadedFiles"
					:accessTypes="accessTypes"
					icon="mdi-file-excel"
					badgeLabel=".xlsx, .xls"
				/>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn color="error" @click="value_ = false">Отмена</v-btn>
				<v-btn
					color="success"
					:disabled="!isValidForm"
					:loading="isLoadingUploadFile"
					@click="onUploadBtnClick"
				>
					Отправить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import UploadFileDragArea from '@components/ui/UploadFileDragArea'
import requestUploadFile from '@utils/requestUploadFile'

export default {
	name: 'PopupUploadDocument',
	components: { UploadFileDragArea },

	props: {
		value: {
			type: Boolean,
			default: false,
		},

		dialog: {
			type: Boolean,
			required: false,
			default: false,
		},
		multiple: {
			type: Boolean,
			default: false,
		},
	},

	data: () => ({
		fileModel: null,
		dragover: false,
		uploadedFiles: [],

		isLoadingUploadFile: false,

		// Файлы которые можно загружать через форму загрузки (только excel)
		accessTypes: [
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel',
		],
	}),

	computed: {
		value_: {
			get() {
				return this.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},

		isValidForm() {
			return !!this.uploadedFiles.length
		},
	},

	methods: {
		async onUploadBtnClick() {
			try {
				this.isLoadingUploadFile = true
				await requestUploadFile(this.uploadedFiles[0])

				this.value_ = false
				this.$emit('success')
			} catch (res) {
				this.$emit('error', res.response)
			} finally {
				this.isLoadingUploadFile = false
				this.uploadedFiles = []
			}
		},
	},
}
</script>

<style lang="sass">
.PopupUploadDocument
    &__text
        padding-bottom: 8px !important
</style>
