<template>
	<div class="MapPageHeaderSelectMap__wrap">
		<FacultySelect v-model="facultyModel" :items="facultyItems" />

		<DirectionAutocomplete
			v-model="directionModel"
			:items="directionItems"
			@input="onSelectDirection"
		/>
	</div>
</template>

<script>
import { IDirection, IMaps } from '@models/Maps'

import withEventEmitter from '@mixins/withEventEmitter'

import MapsService from '@services/Maps/MapsService'

import FacultySelect from '@components/MapPage/FacultySelect.vue'
import DirectionAutocomplete from '@components/MapPage/DirectionAutocomplete.vue'

export default {
	components: { FacultySelect, DirectionAutocomplete },
	name: 'MapPageHeaderSelectMap',
	mixins: [withEventEmitter('mapsService', 'mapsServiceHandlers')],
	data() {
		return {
			mapsService: MapsService,
			facultyModel: null,
			directionModel: null,
			mapsServiceHandlers: {
				fetchMapList: this.updateFormFields,
			},
		}
	},
	computed: {
		facultyItems() {
			return this.mapsService.facultiesList.value
		},
		directionItems() {
			return this.facultyModel?.directions || []
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
.MapPageHeaderSelectMap
    &__wrap
        display: flex
        align-items: center
        gap: 8px
</style>
