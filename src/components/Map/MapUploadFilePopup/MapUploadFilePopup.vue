<template>
	<v-dialog
		class="MapUploadFilePopup"
		v-model="_value"
		max-width="500"
		persistent
	>
		<v-card class="MapUploadFilePopup__card">
			<v-btn class="MapUploadFilePopup__close-btn" icon @click="_value = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>

			<v-card-title class="text-h5">Сформировать КД</v-card-title>

			<v-card-text class="MapUploadFilePopup__text">
				<MUploadFileDragArea
					:value="sortedSelectedItems"
					:accessTypes="accessTypes"
					:info="infoUploadedFiles"
					:loading="isLoadingUploadFile"
					icon="mdi-file-excel"
					badgeLabel=".xlsx, .xls"
					multiple
					@input="onInput"
					@drop="clearInfoUploadedFiles"
					@selectFile="clearInfoUploadedFiles"
					@removeFile="onRemoveFile"
				/>

				<!-- <MapUploadFileError :errors="errors" /> -->

				<div class="MapUploadFilePopup__checkbox-block">
					<v-checkbox
						v-model="form.checkboxIntegralityModel"
						:disabled="isLoadingUploadFile"
						class="MapUploadFilePopup__checkbox"
						label="Проверять целочисленность ЗЕТ"
						hide-details="auto"
						dense
					/>

					<v-checkbox
						v-model="form.checkboxSumModel"
						:disabled="isLoadingUploadFile"
						class="MapUploadFilePopup__checkbox"
						label="Проверять объем программы в ЗЕТ"
						hide-details="auto"
						dense
					/>
				</div>
			</v-card-text>

			<v-card-actions class="MapUploadFilePopup__actions">
				<v-btn
					class="MapUploadFilePopup__upload-btn"
					color="success"
					:disabled="!isValidForm"
					:loading="isLoadingUploadFile"
					@click="onUploadBtnClick"
				>
					<v-icon right dark> mdi-cloud-upload </v-icon>
					<div style="margin-top: 2px">Загрузить</div>
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import _ from 'lodash'

import Api from '@services/api/Api'

import MUploadFileDragArea from '@components/common/MUploadFileDragArea.vue'
import MapUploadFileError from '@components/Map/MapUploadFilePopup/MapUploadFileError.vue'
import ToastService from '@services/ToastService'
import mapsService from '@services/Maps/MapsService'

export default {
	name: 'MapUploadFilePopup',
	components: { MUploadFileDragArea, MapUploadFileError },
	props: { value: Boolean },

	data() {
		return {
			form: {
				checkboxIntegralityModel: true,
				checkboxSumModel: true,
				selectedFiles: [],
			},

			infoUploadedFiles: [],

			isLoadingUploadFile: false,
		}
	},

	computed: {
		_value: {
			get() {
				return this.value
			},
			set(v) {
				if (!v) this.clearForm()

				this.$emit('input', v)
			},
		},

		isValidForm() {
			return !!this.form.selectedFiles?.length
		},

		// Файлы которые можно загружать через форму загрузки (только excel)
		accessTypes() {
			return [
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'application/vnd.ms-excel',
			]
		},

		infoUploadedFilesByFilename() {
			return _.keyBy(this.infoUploadedFiles, 'filename')
		},

		sortedSelectedItems() {
			const groupedByFilename = this.infoUploadedFilesByFilename

			return _.sortBy(this.form.selectedFiles, [
				o => groupedByFilename?.[o.name]?.errors?.length,
			])
		},
	},

	methods: {
		onInput(files) {
			this.form.selectedFiles = files
		},

		onRemoveFile(fileName) {
			console.log('remove', fileName)
			const index = this.form.selectedFiles.findIndex(
				file => file.name === fileName
			)

			if (index > -1) this.form.selectedFiles.splice(index, 1)
		},

		async onUploadBtnClick() {
			const formData = new FormData()

			this.form.selectedFiles.forEach(file => {
				formData.append('file', file)
			})

			formData.append(
				'options',
				JSON.stringify({
					checkboxIntegralityModel: this.form.checkboxIntegralityModel,
					checkboxSumModel: this.form.checkboxSumModel,
				})
			),
				(this.isLoadingUploadFile = true)

			const { success, data } = await Api.uploadFile(formData)

			if (success) {
				const { success: resFetchFactulties } =
					await mapsService.fetchFacultiesList()

				if (!resFetchFactulties) {
					ToastService.showError('Не удалось обновить список направлений')
				}

				const hasErrors = data.some(info => {
					return info.errors.length > 0
				})

				data.forEach(info => {
					if (info.errors.length === 0 && hasErrors)
						ToastService.showSuccess(
							'Файл был успешно загружен',
							`АУП: ${info.aup}`
						)

					if (info.errors.length > 0)
						ToastService.showError('В файле нашлась ошибка', `АУП: ${info.aup}`)
				})

				this.infoUploadedFiles = data

				if (!hasErrors) {
					let text = 'Файлы были успешно загружены'
					if (data.length === 1) text = 'Файл был успешно загружен'

					ToastService.showSuccess(text)

					this._value = false
					this.clearForm()
				}
			} else {
				ToastService.showError('Произошла ошибка при загрузке файлов')
			}

			this.isLoadingUploadFile = false
		},

		clearForm() {
			this.form = {
				checkboxIntegralityModel: true,
				checkboxSumModel: true,
				selectedFiles: [],
			}

			this.clearInfoUploadedFiles()
		},

		clearInfoUploadedFiles() {
			this.infoUploadedFiles = []
		},
	},
}
</script>

<style lang="sass">
.MapUploadFilePopup
    &__card
        position: relative

    &__text
        padding-bottom: 8px !important

    &__close-btn
        position: absolute
        right: 12px
        top: 12px

    &__checkbox-block
        display: grid
        gap: 4px
        margin: 4px 0

    &__actions
        display: flex
        justify-content: flex-end
        padding: 0 24px 16px 24px !important

    &__upload-btn
        display: flex
        align-items: center
</style>
