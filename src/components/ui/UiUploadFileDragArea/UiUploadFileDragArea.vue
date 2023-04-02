<template>
	<div
		class="UploadFileDragArea"
		@drop.prevent="onDrop($event)"
		@dragover.prevent="dragover = true"
		@dragenter.prevent="dragover = true"
		@dragleave.prevent="dragover = false"
	>
		<v-badge
			v-if="badgeLabel"
			class="UploadFileDragArea__badge"
			color="green"
			:content="badgeLabel"
			inline
		/>

		<div class="UploadFileDragArea__wrapper">
			<v-row
				class="UploadFileDragArea__row d-flex flex-column"
				dense
				align="center"
				justify="center"
			>
				<v-icon
					class="UploadFileDragArea__upload-icon"
					:class="{ dragover }"
					size="60"
				>
					{{ icon }}
				</v-icon>
				<div class="UploadFileDragArea__text-block text-center">
					Для загрузки файлов перетащите их сюда или
					<span class="UploadFileDragArea__link-file" @click="onSelectFile">
						выберите с устройства
					</span>
				</div>

				<input
					class="UploadFileDragArea__file-input"
					type="file"
					ref="fileInput"
					:accept="accessTypes.join(', ')"
					@input="onInputFileInput"
				/>
			</v-row>
		</div>

		<div v-if="uploadedFiles.length > 0">
			<v-list-item
				dense
				class="UploadFileDragArea__list-item"
				v-for="item in uploadedFiles"
				:key="item.name"
			>
				<v-list-item-content>
					<v-list-item-title>
						{{ item.name }}
						<span class="ml-3 text--secondary">
							{{ getItemSizeLabel(item.size) }}
						</span>
					</v-list-item-title>
				</v-list-item-content>

				<v-list-item-action>
					<v-btn @click.stop="removeFile(item.name)" icon>
						<v-icon> mdi-close-circle </v-icon>
					</v-btn>
				</v-list-item-action>
			</v-list-item>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UploadFileDragArea',

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
	},

	methods: {
		removeFile(fileName) {
			const index = this.uploadedFiles.findIndex(file => file.name === fileName)

			if (index > -1) this.uploadedFiles.splice(index, 1)
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
		},

		getItemSizeLabel(size) {
			return `${Math.floor(size / 8 / 1024)} Кбайт`
		},

		// Выбор файла через ссылку "выберите файл"
		onSelectFile() {
			this.$refs.fileInput.click()
		},

		onInputFileInput(e) {
			this.uploadedFiles = [e.target.files[0]]
		},
	},
}
</script>

<style lang="sass">
.UploadFileDragArea
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

    &__list-item
        background-color: rgba(0, 0, 0, 0.1)
        border-radius: 6px
</style>
