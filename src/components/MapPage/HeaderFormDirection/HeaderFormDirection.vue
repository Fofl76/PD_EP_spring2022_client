<template>
  <div class="HeaderFormDirection__wrap">
    <faculty-select
      v-model="facultyModel"
      :items="facultyItems"
    />
		<direction-autocomlete
			v-model="directionModel"
			:items="directionItems"
			@input="onSelectDirection"
		/>
  </div>
</template>

<script>
import Vue from "vue"
import withEventEmmiter from "@mixins/withEventEmmiter"
import MapsService from '@services/Maps/MapsService'
import { IDirection, IMaps } from '@models/Maps'
import FacultySelect from "../FacultySelect/FacultySelect.vue"
import DirectionAutocomlete from "../DirectionAutocomlete/DirectionAutocomlete.vue"

export default {
  components: {FacultySelect, DirectionAutocomlete},
	name: 'HeaderFormDirection',
	mixins: [
		withEventEmmiter('mapsService', 'mapsServiceHandlers')
	],
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
.HeaderFormDirection
    &__wrap
        display: flex
        align-items: center
        gap: 8px
</style>
