<template>
	<MapBelongsToPopup v-model="_value">
		<template #title>Работа с модулями</template>
		<template #subtitle>*Нажмите на дисциплину и перетащите её </template>

		<template #left>
			<MapBelongsToPopupSearchTab
				:all-items="aupModules"
				@select="
					module => {
						selectedModuleId = module
					}
				"
				@delete="deleteModule"
				@create-new-press="v => (isCreateNewPressed = v)"
			/>
		</template>

		<template #right>
			<MapBelongsToPopupCreateTab
				v-if="isCreateNewPressed"
				:available="sortedModules"
				@add-new="addNewHandle"
			/>

			<MapBelongsToPopupSelectedTab
				v-else-if="selectedModuleId"
				mode="module"
				:current="selectedModuleId"
				:map="allModulesMap"
				:available-disciplines="availableDisciplines"
				:appointed-disciplines="appointedDisciplines"
				@update="updateModuleHandler"
				@move="moveDisciplineHandler"
			/>
		</template>

		<template #actions>
			<v-btn color="success" :loading="isLoadingSaveTable" @click="saveMap">
				Сохранить
			</v-btn>

			<v-btn color="error" @click="_value = false">Отмена</v-btn>
		</template>
	</MapBelongsToPopup>
</template>

<script>
import _ from 'lodash'

import unbuildMapList from '@services/Maps/unbuildMapsList'

import MapBelongsToPopup from '@components/Map/MapBelongsToPopup/MapBelongsToPopup.vue'
import MapBelongsToPopupSearchTab from '@components/Map/MapBelongsToPopup/MapBelongsToPopupSearchTab.vue'
import MapBelongsToPopupCreateTab from '@components/Map/MapBelongsToPopup/MapBelongsToPopupCreateTab.vue'
import MapBelongsToPopupSelectedTab from '@components/Map/MapBelongsToPopup/MapBelongsToPopupSelectedTab.vue'
import modulesService from '@services/Modules/ModulesService'
import mapsService from '@services/Maps/MapsService'

export default {
	name: 'MapModulesPopup',
	components: {
		MapBelongsToPopup,
		MapBelongsToPopupSearchTab,
		MapBelongsToPopupCreateTab,
		MapBelongsToPopupSelectedTab,
	},

	props: {
		value: {
			type: Boolean,
		},
	},

	data() {
		return {
			newAllDisciplines: [],
			newAllDisciplinesMap: {},

			aupModules: [],
			selectedModuleId: null,
			isCreateNewPressed: false,

			isLoadingUpdateModule: false,
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

		isLoadingSaveTable() {
			return mapsService.isLoadingSaveMapList
		},

		activeMapTable() {
			return unbuildMapList(mapsService.mapList.value)
		},

		allModules() {
			return modulesService.modulesList.value
		},

		allModulesMap() {
			return modulesService.allModulesMapId
		},

		sortedModules() {
			return _.orderBy(
				_.differenceWith(this.allModules, this.aupModules, _.isEqual),
				'name',
			).sort((a, b) => {
				if (a.name < b.name) {
					return -1
				}

				return 1
			})
		},

		availableDisciplines() {
			return _.orderBy(
				this.newAllDisciplines?.filter(
					el => el.id_module !== this.selectedModuleId,
				),
				'discipline',
			)
		},

		appointedDisciplines() {
			return _.orderBy(
				this.newAllDisciplines?.filter(
					el => el.id_module === this.selectedModuleId,
				),
				'discipline',
			)
		},
	},

	methods: {
		async initAllDisciplines() {
			if (!mapsService.aupCode) return

			await this.fetchModulesAup()
			this.getAllDisciplines()

			this.selectedModuleId = null
		},

		getAllDisciplines() {
			this.newAllDisciplines = _.cloneDeep(
				_.uniqBy(this.activeMapTable, el => el.discipline),
			)
			this.newAllDisciplinesMap = _.keyBy(this.newAllDisciplines, el => el.id)
		},

		async fetchModulesAup() {
			const modules = await modulesService.fetchModulesByAup(
				mapsService.aupCode,
			)

			if (modules) {
				this.aupModules = modules
			}
		},

		async deleteModule(module) {
			if (this.selectedModuleId === module.id) {
				this.selectedModuleId = null
			}

			await modulesService.deleteModule(module.id)
			this.initAllDisciplines()
		},

		async saveMap() {
			const groupByDisciplines = _.groupBy(this.newAllDisciplines, 'discipline')

			const newTable = this.activeMapTable.map(el => ({
				...el,
				id_module: groupByDisciplines[el.discipline][0].id_module,
			}))

			await mapsService.saveAllMap(mapsService.aupCode, newTable)

			this._value = false
		},

		async updateModuleHandler(item) {
			this.isLoadingUpdateModule = true

			await modulesService.updateModule(item)

			this.isLoadingUpdateModule = false

			this.initAllDisciplines()
		},

		moveDisciplineHandler(id, moduleId) {
			this.newAllDisciplinesMap[id].id_module = moduleId
		},

		async addNewHandle(e) {
			let newModule = e.item

			if (e.create) {
				const resp = await modulesService.addModule(newModule)

				if (!resp) {
					return
				}

				newModule = resp
			}

			this.aupModules.push({
				...newModule,
			})

			this.selectedModuleId = newModule.id
		},
	},

	created() {
		this.initAllDisciplines()
	},
}
</script>
