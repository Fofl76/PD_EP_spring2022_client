<template>
	<v-dialog class="MapUploadFilePopup" v-model="_value" max-width="500">
		<v-card class="MapUploadFilePopup__card">
			<v-btn class="MapUploadFilePopup__close-btn" icon @click="_value = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>

			<v-card-title class="text-h5">Сформировать КД</v-card-title>

			<v-card-text class="MapUploadFilePopup__text">
				<MUploadFileDragArea
					v-model="form.uploadedFiles"
					:accessTypes="accessTypes"
					icon="mdi-file-excel"
					badgeLabel=".xlsx, .xls"
				/>

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
					color="success"
					:disabled="!isValidForm"
					:loading="isLoadingUploadFile"
					@click="onUploadBtnClick"
					block
				>
					Загрузить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Api from '@services/api/Api'

import MUploadFileDragArea from '@components/common/MUploadFileDragArea.vue'

export default {
	name: 'MapUploadFilePopup',
	components: { MUploadFileDragArea },
	props: { value: Boolean },

	data() {
		return {
			form: {
				checkboxIntegralityModel: true,
				checkboxSumModel: true,
				uploadedFiles: [],
			},

			isLoadingUploadFile: false,
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

		isValidForm() {
			return !!this.form.uploadedFiles?.length
		},

		// Файлы которые можно загружать через форму загрузки (только excel)
		accessTypes() {
			return [
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'application/vnd.ms-excel',
			]
		},
	},

	methods: {
		async onUploadBtnClick() {
			const form = {
				file: this.form.uploadedFiles[0],
				options: {
					checkboxIntegralityModel: this.form.checkboxIntegralityModel,
					checkboxSumModel: this.form.checkboxSumModel,
				},
			}

			this.isLoadingUploadFile = true

			try {
				const res = await Api.uploadFile(form)

				this._value = false
				this.$emit('success', res.data)
			} catch (res) {
				this.$emit('error', res.response)
			} finally {
				this.isLoadingUploadFile = false
				this.clearForm()
			}
		},

		clearForm() {
			this.form = {
				checkboxIntegralityModel: true,
				checkboxSumModel: true,
				uploadedFiles: [],
			}
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
        padding: 0 24px 8px 24px !important
</style>
