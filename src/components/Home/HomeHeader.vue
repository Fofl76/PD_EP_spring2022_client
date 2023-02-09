<template>
	<v-app-bar app class="HomeHeader full-width" height="80" dark clipped-right>
		<div class="HomeHeader__inner">
			<v-select
				class="HomeHeader__input HomeHeader__input-faculty"
				:menu-props="{ offsetY: false }"
				:items="facultyItems"
				v-model="facultyModel"
				item-text="faculty_name"
				@input="onSelectFaculty"
				return-object
				label="Выберите факультет"
				hide-details="auto"
				dark
				filled
				dense
			></v-select>

			<v-autocomplete
				label="Введите направление"
				class="HomeHeader__input HomeHeader__input-direction"
				v-model="directionModel"
				:items="availableDirections"
				@input="onSelectDirection"
				no-data-text="Направления не найдены"
				item-text="map_name"
				return-object
				hide-details="auto"
				dark
				filled
				dense
			></v-autocomplete>
		</div>

		<v-spacer></v-spacer>

		<v-btn @click="popupUploadModel = true" text dark>
			<span>Загрузить план</span>
			<v-icon right dark>mdi-upload</v-icon>
		</v-btn>

		<v-btn
			v-if="tableReady"
			:href="`http://127.0.0.1:5000/save/${aupCode}`"
			target="_blank"
			text
			dark
		>
			<span>Скачать</span>
			<v-icon right dark>mdi-download</v-icon>
		</v-btn>

		<PopupUploadDocument
			v-model="popupUploadModel"
			@success="onSuccessUploadFile"
			@error="onErrorUploadFile"
		/>
	</v-app-bar>
</template>

<script>
import MSnackbar from '@components/ui/MSnackbar.vue'
import PopupUploadDocument from '@components/PopupUploadDocument.vue'

import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
	name: 'HomeHeader',
	components: { PopupUploadDocument, MSnackbar },

	props: {
		tableReady: {
			type: Boolean,
			default: false,
		},

		aupCode: {
			type: String,
			default: '',
		},
	},

	data: () => ({
		facultyModel: '',
		directionModel: '',
		availableDirections: [],

		popupUploadModel: false,
	}),

	computed: {
		...mapGetters('Maps', ['mapsList']),

		facultyItems() {
			return this.mapsList
		},
	},

	methods: {
		...mapActions('Maps', ['fetchAllMapsList']),

		getFacultyAndDirectionByAup(aup) {
			return this.mapsList.find(mapList => {
				return mapList.data.some(direction => direction.map_id === aup)
			})
		},

		findDirectionInFaculty(aup) {
			return this.facultyModel.data.find(direction => direction.map_id === aup)
		},

		onSelectFaculty() {
			this.availableDirections = this.facultyModel.data
		},

		onSelectDirection() {
			this.setUrlAup(this.directionModel.map_id)
		},

		setUrlAup(aupCode) {
			this.$router.push({ path: `/?aup=${aupCode}` })
			this.updateFormFields()
		},

		onSuccessUploadFile(data) {
			this.$emit('successUpload')
			// this.setUrlAup()
		},

		onErrorUploadFile(res) {
			this.$emit('errorUpload', res)
		},

		updateFormFields() {
			const aupCode = this.$route.query.aup

			if (!aupCode) return

			this.facultyModel = this.getFacultyAndDirectionByAup(aupCode) || ''
			this.availableDirections = this.facultyModel.data

			if (this.facultyModel) {
				this.directionModel = this.findDirectionInFaculty(aupCode) || ''
			}
		},
	},

	async created() {
		await this.fetchAllMapsList()
		this.updateFormFields()
	},
}
</script>

<style lang="sass">
.HomeHeader
    background-color: #333
    display: flex
    justify-content: space-between
    align-items: center

    .v-toolbar__content
        width: 100%

    &__inner
        display: flex
        align-items: center
        gap: 8px

    &__input-faculty
        width: 300px

    &__input-direction
        width: 500px
</style>
