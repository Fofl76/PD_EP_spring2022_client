<template>
	<v-dialog
		:value="value"
		@input="onInputPopup"
		max-width="1000"
		class="PopupGroupsSettings"
	>
		<v-card class="PopupGroupsSettings__card">
			<v-card-title class="text-h5"> Работа с группировками </v-card-title>
			<v-card-subtitle> *Нажмите на дисциплину и перетащите её</v-card-subtitle>

			<v-card-text class="PopupGroupsSettings__text">
				<div class="PopupGroupsSettings__main">
					<div class="PopupGroupsSettings__group">
						<v-text-field
							v-model="searchModel"
							class="PopupGroupsSettings__search"
							label="Поиск группировок"
							outlined
							dense
							hide-details="auto"
						></v-text-field>

						<v-divider class="PopupGroupsSettings__hor-divider"></v-divider>

						<PopupGroupsListDisciplines
							v-model="selectedItemId"
							:disciplines="filteredItems"
						/>

						<v-divider class="PopupGroupsSettings__hor-divider"></v-divider>
						<v-list style="padding: 0px" dense>
							<v-list-item-group v-model="createItem" color="primary">
								<v-list-item :value="true">
									<v-list-item-icon>
										<v-icon color="grey">mdi-plus</v-icon>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title>Добавить группу</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list-item-group>
						</v-list>
					</div>

					<v-divider class="PopupGroupsSettings__ver-divider" vertical />

					<div
						v-if="selectedItemId"
						class="PopupGroupsSettings__group-settings"
					>
						<div class="PopupGroupsSettings__group-settings-form">
							<v-text-field
								v-model="nameModel"
								class="PopupGroupsSettings__name-group"
								label="Наименование группировки"
								outlined
								dense
								hide-details="auto"
							></v-text-field>

							<v-menu offset-y :close-on-content-click="false">
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										:color="colorModel"
										class="PopupGroupsSettings__color-picker"
										v-bind="attrs"
										v-on="on"
										>
										Цвет
									</v-btn>
								</template>

								<v-color-picker
									v-model="colorModel"
									dot-size="25"
									mode="hexa"
									swatches-max-height="200"
								/>
									<!-- dot-size="25"
									mode="hexa"
									swatches-max-height="200" -->
									<!-- hide-inputs -->
									<!-- hide-mode-switch -->
							</v-menu>
							<v-btn
							  color="success"
								:disabled="isDirtyGroup"
								:loading="isLoadingUpdateGroup"
								@click="updateGroupHandler"
							>
								Применить
							</v-btn>
						</div>

						<div class="PopupGroupsSettings__group-settings-dnd">
							<div class="PopupGroupsSettings__disciplines-block">
								<div class="PopupGroupsSettings__disciplines-title">
									Доступные дисциплины
								</div>

								<!-- Все дисциплины -->
								<draggable
									v-bind="dragOptions"
									:value="availableDisciplines"
									:setData="setData"
									style="height: 340px; overflow-y: scroll"
								>
									<v-list-item
										v-for="element in availableDisciplines"
										:key="element.id"
										class="PopupGroupsSettings__discipline-item"
									>
										<v-list-item-icon class="mr-1">
											<v-icon
												size="medium"
												:color="allGroupsMapId[element.id_group].color"
												>mdi-circle</v-icon
											>
										</v-list-item-icon>
										<v-list-item-content>
											{{ element.discipline }}
										</v-list-item-content>
									</v-list-item>
								</draggable>
							</div>

							<v-divider class="PopupGroupsSettings__ver-divider" vertical />

							<div>
								<div class="PopupGroupsSettings__disciplines-title">
									Назначенные дисциплины
								</div>

								<!-- Назначенные дисциплины -->
								<draggable
									v-bind="dragOptions"
									:value="appointedDisciplines"
									:setData="setData"
									@change="onChangeAppointedGroup"
									style="height: 340px; overflow-y: scroll"
								>
									<v-list-item
										v-for="element in appointedDisciplines"
										:key="element.id"
										class="PopupGroupsSettings__discipline-item"
									>
										<v-list-item-icon class="mr-1">
											<v-icon
												size="medium"
												:color="allGroupsMapId[element.id_group].color"
												>mdi-circle</v-icon
											>
										</v-list-item-icon>
										<v-list-item-content>
											{{ element.discipline }}
										</v-list-item-content>
									</v-list-item>
								</draggable>
							</div>
						</div>
					</div>

					<div v-else-if="createItem">
						<PopupGroupsAddGrops
							:groups="availableAppointedGroups"
							@addGroup="onAddGroup"
						/>
					</div>

					<div v-else>
						<div class="PopupGroupsSettings__empty">
							<div class="PopupGroupsSettings__empty-inner">
								<v-icon color="rgba(0, 0, 0, 0.3)" :size="120">
									mdi-information-outline
								</v-icon>
								<p class="PopupGroupsSettings__empty-title text-h5">
									Нет данных
								</p>
								<span class="PopupGroupsSettings__empty-subtitle subtitle-1">
									Выберите группировку для редактирования
								</span>
							</div>
						</div>
					</div>
				</div>
			</v-card-text>

			<v-card-actions>
				<v-spacer />
				<v-btn color="success" :loading="isLoadingSaveTable" @click="onSaveMap"
					>Сохранить</v-btn
				>
				<v-btn color="error" @click="value_ = false">Отмена</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import _ from 'lodash'
import draggable from 'vuedraggable'
import GroupsService from '@services/Groups/GroupsService'
import MapsService from '@services/Maps/MapsService'
import unbuildMapList from '@services/Maps/unbuildMapsList'
import Api from '@services/api/Api'
import PopupGroupsListDisciplines from './PopupGroupsListDisciplines.vue'
import PopupGroupsAddGrops from './PopupGroupsAddGrops.vue'

export default {
	name: 'PopupGroupsSettings',
	components: { draggable, PopupGroupsListDisciplines, PopupGroupsAddGrops },

	props: {
		value: {
			type: Boolean,
			default: false,
		},
	},

	data: () => ({
		newAllDisciplines: [],
		selectedItemId: null,
		
		// доступные группы
		items: [],

		createItem: false,

		groupsService: GroupsService,

		isLoadingAddGroups: false,

		searchModel: '',

		nameModel: '',
		colorModel: '',
		isLoadingUpdateGroup: false,
	}),

	computed: {
		availableAppointedGroups() {
			const allGroups = this.groupsService.groupsList.value
			const appointedGroups = this.items
			
			const appointedGroupsIds = appointedGroups?.map(el => el.id)
			const setAppointedGroupsIds = new Set(appointedGroupsIds)

			return allGroups.filter(group => !setAppointedGroupsIds.has(group.id))		
		},

		isLoadingSaveTable() {
			return MapsService.isLoadingSaveMapList
		},

		activeMapTable() {
			return unbuildMapList(MapsService.mapList.value)
		},

		allGroups() {
			return this.groupsService.groupsList
		},

		allGroupsMapId() {
			return this.groupsService.allGroupsMapId
		},

		value_: {
			get() {
				return this.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},

		isDirtyGroup() {
			return this.selectedItem.name === this.nameModel && this.selectedItem.color === this.colorModel
		},

		availableDisciplines() {
			return _.orderBy(
				this.newAllDisciplines?.filter(
					el => el.id_group !== this.selectedItem?.id
				),
				'discipline'
			)
		},

		appointedDisciplines() {
			return _.orderBy(
				this.newAllDisciplines?.filter(
					el => el.id_group === this.selectedItem?.id
				),
				'discipline'
			)
		},

		filteredItems() {
			return _.orderBy(
				this.items?.filter(item => {
					return item.name
						.toLowerCase()
						.includes(this.searchModel.toLowerCase())
				}),
				'name'
			)
		},

		dragOptions() {
			return {
				animation: 250,
				group: 'disciplines',
			}
		},

		selectedItem() {
			return this.filteredItems.find(item => item.id === this.selectedItemId)
		}
	},

	watch: {
		searchModel() {
			this.clearSelectedItem()
		},

		createItem(value) {
			if (value) {
				this.selectedItemId = null
			}
		},

		selectedItemId(id) {
			if (!id && id !== 0) return

			if (this.createItem) {
				this.createItem = null
			}

			this.nameModel = this.selectedItem.name
			this.colorModel = this.selectedItem.color
		},

		async value(value) {
			if (!value) {
				setTimeout(() => {
					this.initAllDisciplines()
				}, 300);
			}
			else {
				this.getAllDisciplines()
			}
		},
	},

	methods: {
		onInputPopup(event) {
			this.$emit('input', event)
		},

		onAddGroup(group) {
			this.items.push(group)

			this.selectedItemId = group.id
			this.createItem = false
		},

		async initAllDisciplines() {
			this.items = await Api.fetchGroupsByAup(this.$route.query.aup)

			this.getAllDisciplines()

			this.selectedItemId = null
		},

		getAllDisciplines () {
			this.newAllDisciplines = _.cloneDeep(
				_.uniqBy(this.activeMapTable, el => el.discipline)
			)
		},

		clearSelectedItem() {
			this.selectedItemId = null
		},

		async onSaveMap() {
			const groupByDisciplines = _.groupBy(this.newAllDisciplines, 'discipline')

			const newTable = this.activeMapTable.map(el => ({
				...el,
				id_group: groupByDisciplines[el.discipline][0].id_group,
			}))

			await MapsService.saveAllMap(this.$route.query.aup, newTable)


			this.value_ = false
		},

		async deleteGroupHandler(group) {
			await this.groupsService.deleteGroup(group.id)
			this.initAllDisciplines()
			this.selectedItemId = null
		},

		async updateGroupHandler() {
			const updatedGroup = {
				id: this.selectedItem.id,
				name: this.nameModel,
				color: this.colorModel,
			}

			this.isLoadingUpdateGroup = true
		
			await this.groupsService.updateGroup(updatedGroup)
			
			this.isLoadingUpdateGroup = false

			this.initAllDisciplines()
		},

		onChangeAppointedGroup(e) {
			if (e.added) {
				e.added.element.id_group = this.selectedItem.id
			}

			if (e.removed) {
				e.removed.element.id_group = 1
			}
		},

		setData(dataTransfer) {
			dataTransfer.setDragImage(document.createElement('div'), 0, 0)
		},
	},
	async created() {
		await this.initAllDisciplines()
	}
}
</script>

<style lang="sass">
.PopupGroupsSettings
    &__text
        padding-bottom: 8px !important

    &__main
        display: grid
        grid-template-columns: 300px min-content 1fr

    &__group
        width: 300px

    &__group-settings
        width: 100%

    &__group-settings-form
        display: flex
        align-items: center
        margin-bottom: 12px

    &__group-settings-dnd
        display: grid
        grid-template-columns: 1fr min-content 1fr

    &__disciplines-title
        text-align: center
        margin-bottom: 4px

    &__discipline-item
        position: relative
        display: flex
        width: 100%
        cursor: grab
        background-color: rgba(0, 0, 0, 0.04)
        margin: 4px 0

    &__discipline-title
        max-width: 200px
        overflow: hidden
        line-height: 2rem
        max-height: 8rem
        -webkit-box-orient: vertical
        display: block
        display: -webkit-box
        overflow: hidden !important
        text-overflow: ellipsis
        -webkit-line-clamp: 4

    &__color-picker
        margin-left: 8px
        margin-right: 8px

    &__hor-divider
        margin: 8px 0px

    &__ver-divider
        margin: 0 8px

    &__create
        width: 100%
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        font-size: 1.5em

    &__create-form
        margin: -6px !important
        width: 400px
        display: flex
        flex-direction: column
        > *
            margin: 6px !important
    &__create-row
        display: flex
        > *:first-chield
            margin-right: 6px !important

    &__create-header
        font-weight: bold !important

    &__empty
        width: 100%
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        font-size: 1.5em

    &__empty-inner
        color: #333
        display: flex
        flex-direction: column
        align-items: center

    &__empty-icon
        margin-bottom: 12px

    &__empty-title
        margin-bottom: 4px !important

.v-btn::before
    opacity: 0 !important
</style>
