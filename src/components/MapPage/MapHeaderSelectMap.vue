<template>
	<div class="MapHeaderSelectMap__wrap">
		<FacultySelect v-model="facultyModel" :items="facultyItems" />
		<DirectionAutocomplete
			v-model="directionModel"
			:items="directionItems"
			@input="onSelectDirection"
		/>
		<SelectYear style="max-width: 100px" v-model="year" :items="itemsYears" />
	</div>
</template>

<script>
import withEventEmitter from '@mixins/withEventEmitter'

import MapsService from '@services/Maps/MapsService'

import DirectionAutocomplete from '@components/MapPage/DirectionAutocomplete.vue'
import FacultySelect from '@components/MapPage/FacultySelect.vue'
import SelectYear from './SelectYear.vue'

export default {
	components: { FacultySelect, DirectionAutocomplete, SelectYear },
	name: 'MapHeaderSelectMap',
	mixins: [withEventEmitter('mapsService', 'mapsServiceHandlers')],
	data() {
		return {
			mapsService: MapsService,
			facultyModel: null,
			directionModel: null,
			year: new Date(Date.now()).getFullYear(),
			mapsServiceHandlers: {
				fetchMapList: this.updateFormFields,
			},
		}
	},
	computed: {
		facultyItems() {
			return this.mapsService.facultiesList.value
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
				this.facultyModel?.directions?.filter(el => el.year === this.year) || []
			)
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
			return this.facultyModel?.directions?.find(
				direction => direction.code === aup
			)
		},

		updateFormFields() {
			const aupCode = this.$route.query.aup

			if (!aupCode) return

			this.facultyModel = this.findFacultyModelByAup(aupCode) || null

			if (this.facultyModel) {
				this.directionModel = this.findDirectionInFacultyByAup(aupCode) || null
			}
		},
	},
}
</script>

<style lang="sass">
.MapHeaderSelectMap
    &__wrap
        display: flex
        align-items: center
        gap: 8px
</style>
