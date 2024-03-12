<template>
	<div class="MapHeaderSelectBlock">
		<MapHeaderFacultySelect
			:value="facultyModel"
			:loading="isLoadingFacultyInput"
			:items="facultyItems"
			@input="setFaculty"
		/>

		<MapHeaderDirectionAutocomplete
			v-model="directionModel"
			:items="directionItemsByYear"
			:loading="isLoadingDirectionInput"
			@input="onSelectDirection"
		/>

		<MapHeaderYearSelect
			style="max-width: 100px"
			v-model="year"
			:items="yearItems"
		/>
	</div>
</template>

<script>
import withEventEmitter from '@mixins/withEventEmitter'

import mapsService from '@services/Maps/MapsService'
import permissionService from '@services/auth/PermissionService'

import MapHeaderDirectionAutocomplete from '@components/Map/MapHeader/MapHeaderDirectionAutocomplete.vue'
import MapHeaderFacultySelect from '@components/Map/MapHeader/MapHeaderFacultySelect.vue'
import MapHeaderYearSelect from '@components/Map/MapHeader/MapHeaderYearSelect.vue'
import getCurrentYear from '@services/utils/getCurrentYear'

export default {
	name: 'MapHeaderSelectBlock',
	components: {
		MapHeaderFacultySelect,
		MapHeaderDirectionAutocomplete,
		MapHeaderYearSelect,
	},

	mixins: [withEventEmitter('mapsService', 'mapsServiceHandlers')],

	data() {
		return {
			facultyModel: null,
			directionModel: null,
			year: new Date(Date.now()).getFullYear(),

			mapsService,
			mapsServiceHandlers: {
				fetchFaculties: this.updateFormFields,
			},

			yearItems: [],
			directionItems: [],

			isLoadingFacultyInput: false,
			isLoadingDirectionInput: false,
		}
	},

	computed: {
		facultyItems() {
			return mapsService.facultiesList.value
		},

		directionItemsByYear() {
			return this.directionItems.filter(
				direction => direction.year === this.year
			)
		},
	},

	/* 	watch: {
		facultyModel() {
			if (!mapsService.aupCode) this.year = this.itemsYears[0]
		},
	}, */

	methods: {
		findFacultyModelByAup(aup) {
			return this.facultyItems.find(mapList => {
				return mapList.directions.some(direction => direction.code === aup)
			})
		},

		findDirectionInFacultyByAup(aup) {
			return this.directionItems.find(direction => direction.code === aup)
		},

		setFaculty(faculty) {
			this.facultyModel = faculty

			/* Собираем все года всех карт на факультете */
			this.yearItems = [
				...new Set(
					faculty.directions
						.map(direction => direction.year)
						.sort((a, b) => b - a)
				),
			]

			/* Если там есть текущий год, то ставим его, иначе берем первый */
			if (this.yearItems.includes(getCurrentYear())) {
				this.year = getCurrentYear()
			} else {
				this.year = this.yearItems[0]
			}

			this.directionItems = faculty.directions.map(el => ({
				...el,
				canEdit: permissionService.canEditAup(el.code),
			}))
		},

		/* Перебрасываем на страницу при выборе нового направления */
		onSelectDirection() {
			this.$router
				.push({ query: { aup: this.directionModel?.code } })
				.catch(() => {})
		},

		/* Вызывается когда обновляется список факультетов*/
		async updateFormFields() {
			const aupCode = mapsService.aupCode

			if (!aupCode) return

			this.setFaculty(this.findFacultyModelByAup(aupCode) || null)

			if (this.facultyModel) {
				await this.$nextTick()
				const direction = this.findDirectionInFacultyByAup(aupCode) || null

				this.year = direction?.year
				this.directionModel = direction
			}

			this.isLoadingFacultyInput = false
			this.isLoadingDirectionInput = false
		},
	},

	created() {
		/* переделать на норм */
		if (this.$route.query.aup) {
			this.isLoadingFacultyInput = true
			this.isLoadingDirectionInput = true
		}
	},
}
</script>

<style lang="sass">
.MapHeaderSelectBlock
    display: flex
    align-items: center
    gap: 8px
</style>
