<template>
	<v-app-bar app class="HomeHeader full-width" height="80" dark clipped-right>
		<div class="HomeHeader__inner">
			<v-select
				class="HomeHeader__input HomeHeader__input-faculty"
				:menu-props="{ offsetY: false }"
				:items="facultyItems"
				v-model="facultyModel"
				item-text="faculty_name"
				no-data-text="Факультеты не найдены"
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
				item-text="name"
				return-object
				hide-details="auto"
				dark
				filled
				dense
			>
				<template v-slot:append>
					<div class="HomeHeader__year-chip--selected">
						<v-chip
							v-if="directionModel"
							class="HomeHeader__year-chip"
							pill
							label
						>
							{{ directionModel.year }}
						</v-chip>
					</div>
				</template>

				<template v-slot:item="{ item }">
					<v-list-item-title>{{ item.name }}</v-list-item-title>
					<div>
						<v-chip class="HomeHeader__year-chip" pill label>{{
							item.year
						}}</v-chip>
					</div>
				</template>
			</v-autocomplete>
		</div>

		<v-spacer></v-spacer>

		<!-- <v-btn @click="popupGroupSettingsModel = true" text dark>
			<span>Группировки</span>
		</v-btn> -->

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

		<PopupGroupsSettings v-model="popupGroupSettingsModel" />
	</v-app-bar>
</template>

<script>
import MSnackbar from '@components/ui/MSnackbar.vue'
import PopupUploadDocument from '@components/PopupUploadDocument.vue'
import PopupGroupsSettings from '@components/PopupGroupsSettings.vue'

import getFacultyByAup from '@utils/getFacultyByAup'

import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
	name: 'HomeHeader',
	components: { PopupUploadDocument, PopupGroupsSettings, MSnackbar },

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
		popupGroupSettingsModel: false,
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
				return mapList.directions.some(direction => direction.code === aup)
			})
		},

		findDirectionInFaculty(aup) {
			return this.facultyModel.directions.find(
				direction => direction.code === aup
			)
		},

		onSelectFaculty() {
			this.availableDirections = this.facultyModel.directions
		},

		onSelectDirection() {
			this.setUrlAup(this.directionModel.code)
		},

		setUrlAup(aupCode) {
			this.$router.push({ path: `/?aup=${aupCode}` })
			this.updateFormFields()
		},

		onSuccessUploadFile(aup) {
			const { faculty, direction } = getFacultyByAup(aup, this.mapsList)

			this.facultyModel = faculty
			this.directionModel = direction

			this.$emit('successUpload', aup)
			// this.setUrlAup()
		},

		onErrorUploadFile(res) {
			this.$emit('errorUpload', res)
		},

		updateFormFields() {
			const aupCode = this.$route.query.aup

			if (!aupCode) return

			this.facultyModel = this.getFacultyAndDirectionByAup(aupCode) || ''
			this.availableDirections = this.facultyModel.directions

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

    &__year-chip
        justify-content: center

        &--selected
            margin-right: 4px

        .v-chip__content
            padding: 0 4px !important
</style>
