<template>
	<div class="MapHeaderSelectBlock">
		<MapHeaderFacultySelect
			v-model="facultyModel"
			:loading="isLoadingFacultyInput"
			:items="facultyItems"
		/>

		<MapHeaderDirectionAutocomplete
			v-model="directionModel"
			:items="directionItems"
			:loading="isLoadingDirectionInput"
			@input="onSelectDirection"
		/>

		<MapHeaderYearSelect
			style="max-width: 100px"
			v-model="year"
			:items="itemsYears"
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
				fetchAup: this.updateFormFields,
			},

			isLoadingFacultyInput: false,
			isLoadingDirectionInput: false,
		}
	},

	computed: {
		facultyItems() {
			return mapsService.facultiesList.value
		},

		itemsYears() {
			const years = {}

			this.facultyModel?.directions.forEach(item => {
				years[item.year] = true
			})

			const yearKey = Object.keys(years).map(key => +key)

			return yearKey.sort((a, b) => b - a)
		},

		directionItems() {
			return (
				this.facultyModel?.directions
					?.filter(el => el.year === this.year)
					.map(el => ({
						...el,
						canEdit: permissionService.availableAupSet.has(el.code),
					})) || []
			)
		},
	},

	watch: {
		facultyModel() {
			this.year = this.itemsYears[0]
		},
	},

	methods: {
		onSelectDirection() {
			this.setUrlAup(this.directionModel?.code)
		},

		setUrlAup(aupCode) {
			this.$router.push({ query: { aup: aupCode } }).catch(() => {})
		},

		findFacultyModelByAup(aup) {
			return this.facultyItems.find(mapList => {
				return mapList.directions.some(direction => direction.code === aup)
			})
		},

		findDirectionInFacultyByAup(aup) {
			return this.directionItems.find(direction => direction.code === aup)
		},

		async updateFormFields() {
			const aupCode = mapsService.aupCode

			if (!aupCode) return

			this.facultyModel = this.findFacultyModelByAup(aupCode) || null

			if (this.facultyModel) {
				await this.$nextTick()
				this.directionModel = this.findDirectionInFacultyByAup(aupCode) || null
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
