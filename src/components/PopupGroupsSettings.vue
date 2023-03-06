<template>
	<v-dialog v-model="value_" max-width="1000" class="PopupGroupsSettings">
		<v-card class="PopupGroupsSettings__card">
			<v-card-title class="text-h5"> Работа с группировками </v-card-title>

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

						<v-list style="height: 370px; overflow-y: scroll" dense>
							<v-list-item-group v-model="selectedItemId" color="primary">
								<v-tooltip
									max-width="200"
									open-delay="700"
									left
									v-for="(item, i) in filteredItems"
									:key="i"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-list-item v-bind="attrs" v-on="on">
											<v-list-item-icon>
												<v-icon :color="item.color">mdi-circle</v-icon>
											</v-list-item-icon>

											<v-list-item-content>
												<v-list-item-title>{{ item.name }}</v-list-item-title>
											</v-list-item-content>
										</v-list-item>
									</template>
									<span>{{ item.name }}</span>
								</v-tooltip>
							</v-list-item-group>
						</v-list>
					</div>

					<v-divider class="PopupGroupsSettings__ver-divider" vertical />

					<div
						v-if="selectedItemId || selectedItemId === 0"
						class="PopupGroupsSettings__group-settings"
					>
						<div class="PopupGroupsSettings__group-settings-form">
							<v-text-field
								v-model="nameModel"
								class="PopupGroupsSettings__name-group"
								label="Наименование группировки"
								outlined
								dense
								readonly
								hide-details="auto"
							></v-text-field>

							<v-menu offset-y :close-on-content-click="false">
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										:color="selectedItem.color"
										class="PopupGroupsSettings__color-picker"
										v-bind="attrs"
										v-on="on"
										disabled
									>
										Цвет
									</v-btn>
								</template>

								<v-color-picker
									v-model="selectedItem.color"
									dot-size="25"
									hide-inputs
									hide-mode-switch
									swatches-max-height="200"
								/>
							</v-menu>
						</div>

						<div class="PopupGroupsSettings__group-settings-dnd">
							<div class="PopupGroupsSettings__disciplines-block">
								<div class="PopupGroupsSettings__disciplines-title">
									Доступные дисциплины
								</div>

								<!-- Все дисциплины -->
								<draggable
									v-bind="dragOptions"
									v-model="allDisciplines"
									:setData="setData"
									style="height: 340px; overflow-y: scroll"
								>
									<v-list-item
										v-for="element in allDisciplines"
										:key="element.id"
										class="PopupGroupsSettings__discipline-item"
									>
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
									v-model="appointedDisciplines"
									:setData="setData"
									style="height: 340px; overflow-y: scroll"
								>
									<v-list-item
										v-for="element in appointedDisciplines"
										:key="element.id"
										class="PopupGroupsSettings__discipline-item"
									>
										<v-list-item-content>
											{{ element.discipline }}
										</v-list-item-content>
									</v-list-item>
								</draggable>
							</div>
						</div>
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
				<v-btn color="error" @click="value_ = false">Отмена</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import _ from 'lodash'
import draggable from 'vuedraggable'

import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'PopupGroupsSettings',
	components: { draggable },

	props: {
		value: {
			type: Boolean,
			default: false,
		},
	},

	data: () => ({
		selectedItem: null,
		selectedItemId: null,
		allDisciplines: null,
		appointedDisciplines: null,

		searchModel: '',

		nameModel: '',
		colorModel: '',
	}),

	computed: {
		...mapGetters('Maps', ['allGroups', 'allGroupsMapId', 'activeMapTable']),

		value_: {
			get() {
				return this.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},

		items() {
			return this.allGroups
		},

		filteredItems() {
			return _.orderBy(
				this.items.filter(item => {
					return item.name
						.toLowerCase()
						.includes(this.searchModel.toLowerCase())
				}),
				'headline'
			)
		},

		dragOptions() {
			return {
				animation: 250,
				group: 'disciplines',
			}
		},
	},

	watch: {
		searchModel() {
			this.clearSelectedItem()
		},

		selectedItemId(id) {
			if (!id && id !== 0) return

			this.selectedItem = this.filteredItems[this.selectedItemId]
			this.allDisciplines = _.uniqBy(
				this.activeMapTable,
				el => el.discipline
			).filter(el => el.id_group !== this.selectedItem.id)

			this.setAppointedDisciplines()

			this.nameModel = this.selectedItem.name
			this.colorModel = this.selectedItem.color
		},
	},

	methods: {
		...mapActions('Maps', ['fetchAllGroups']),

		clearSelectedItem() {
			this.selectedItemId = null
		},

		setData(dataTransfer) {
			dataTransfer.setDragImage(document.createElement('div'), 0, 0)
		},

		setAppointedDisciplines() {
			this.appointedDisciplines = _.uniqBy(
				this.activeMapTable,
				el => el.discipline
			).filter(discipline => discipline.id_group == this.selectedItem.id)
		},
	},

	mounted() {
		this.fetchAllGroups()
	},
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

    &__hor-divider
        margin: 8px 0px

    &__ver-divider
        margin: 0 8px

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
</style>
