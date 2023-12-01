<template>
	<div
		class="MUploadFileDragArea"
		@drop.prevent="onDrop($event)"
		@dragover.prevent="dragover = true"
		@dragenter.prevent="dragover = true"
		@dragleave.prevent="dragover = false"
	>
		<v-badge
			v-if="badgeLabel"
			class="MUploadFileDragArea__badge"
			color="green"
			:content="badgeLabel"
			inline
		/>

		<div class="MUploadFileDragArea__wrapper">
			<v-row
				class="MUploadFileDragArea__row d-flex flex-column"
				dense
				align="center"
				justify="center"
			>
				<v-icon
					class="MUploadFileDragArea__upload-icon"
					:class="{ dragover }"
					size="60"
				>
					{{ icon }}
				</v-icon>
				<div class="MUploadFileDragArea__text-block text-center">
					Для загрузки файлов перетащите их сюда или
					<span class="MUploadFileDragArea__link-file" @click="onSelectFile">
						выберите с устройства
					</span>
				</div>

				<input
					class="MUploadFileDragArea__file-input"
					type="file"
					ref="fileInput"
					:accept="accessTypes.join(', ')"
					@input="onInputFileInput"
				/>
			</v-row>
		</div>

		<div v-if="uploadedFiles.length > 0">
			<div
				class="MUploadFileDragArea__files-list"
				v-for="item in uploadedFiles"
				:key="item.name"
			>
				<v-list-item
					dense
					class="MUploadFileDragArea__list-item"
					:class="{
						isErrorFile: isErrorFile(item.name),
						isUploadedFile: isUploadedFile(item.name),
					}"
				>
					<v-tooltip top>
						<template v-slot:activator="{ on }">
							<v-list-item-content v-on="on">
								<v-list-item-title>
									{{ item.name }}
								</v-list-item-title>
							</v-list-item-content>
						</template>
						<span>{{ item.name }}</span>
					</v-tooltip>

					<v-list-item-action>
						<v-btn @click="removeFile(item.name)" icon :loading="loading">
							<v-icon> mdi-close-circle </v-icon>
						</v-btn>
					</v-list-item-action>
				</v-list-item>

				<div class="MUploadFileDragArea__errors-wrap">
					<MapUploadFileError
						class="MUploadFileDragArea__errors"
						:data="getInfoUploadedFileByFilename(item.name)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MapUploadFileError from '@components/Map/MapUploadFilePopup/MapUploadFileError.vue'
import _ from 'lodash'

export default {
	name: 'MUploadFileDragArea',
	components: { MapUploadFileError },

	props: {
		value: {
			type: Array,
			default: () => [],
		},

		accessTypes: {
			type: Array,
			default: () => ['*'],
		},

		icon: {
			type: String,
			default: 'mdi-cloud-upload',
		},

		badgeLabel: {
			type: String,
			default: '',
		},

		multiple: {
			type: Boolean,
			default: false,
		},

		loading: {
			type: Boolean,
			default: false,
		},

		info: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({
		dragover: false,
	}),

	computed: {
		uploadedFiles: {
			get() {
				return this.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},

		infoUploadedFilesByFilename() {
			return _.groupBy(this.info, 'filename')
		},
	},

	methods: {
		removeFile(fileName) {
			this.$emit('removeFile', fileName)
		},

		getInfoUploadedFileByFilename(filename) {
			return this.infoUploadedFilesByFilename[filename]?.[0]
		},

		isErrorFile(filename) {
			return !!this.getInfoUploadedFileByFilename(filename)?.errors.length
		},

		isUploadedFile(filename) {
			return !!this.infoUploadedFilesByFilename[filename]?.[0]
		},

		onDrop(e) {
			this.dragover = false

			if (!this.multiple && e.dataTransfer.files?.length > 1) {
				console.log('file upload error')
			} else {
				const files = Array.from(e.dataTransfer.files)

				const filteredFiles = files.filter(file =>
					this.accessTypes.includes(file.type)
				)
				if (filteredFiles.length === 0) return
				this.uploadedFiles = files
			}

			this.$emit('drop')
		},

		getItemSizeLabel(size) {
			return `${Math.floor(size / 8 / 1024)} Кбайт`
		},

		// Выбор файла через ссылку "выберите файл"
		onSelectFile() {
			this.$refs.fileInput.click()
		},

		onInputFileInput(e) {
			this.uploadedFiles = [e.target.files]
			this.$emit('selectFile')
		},
	},
}
</script>

<style lang="sass">
.MUploadFileDragArea
    border: 1px dashed rgba(0, 0, 0, 0.6)
    border-radius: 6px
    padding: 10px
    position: relative

    &__wrapper
        position: relative
        padding: 10px 0

    &__badge
        position: absolute
        right: -15px
        top: -5px
        content: ''

    &__file-input
        display: none

    &__upload-icon
        transition: scale .25s ease

        &.dragover
            transform: scale(1.1) translateY(-2px)

    &__link-file
        cursor: pointer
        text-decoration: underline

    &__files-list
        display: flex
        flex-direction: column
        gap: 8px

    &__list-item
        background-color: rgba(0, 0, 0, 0.1)
        border-radius: 0px 6px 6px 0px
        position: relative

        &.isUploadedFile
            border-left: 3px solid #4CAF50
        &.isErrorFile
            border-left: 3px solid #F44336


    &__list-item-title
        display: flex
        align-items: center
        justify-content: space-between

    &__list-item-size-chip
        position: absolute
        top: 0
        left: 0
        transform: translateY(-30%)

    &__errors
        margin-bottom: 8px
</style>
