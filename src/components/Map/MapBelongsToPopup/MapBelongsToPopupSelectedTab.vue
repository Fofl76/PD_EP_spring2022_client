<template>
	<div>
		<div class="MapBelongsToPopupSelectedTab__selected-settings-form">
			<v-text-field
				v-model="nameModel"
				class="MapBelongsToPopupSelectedTab__name-group"
				label="Наименование"
				outlined
				dense
				hide-details="auto"
			></v-text-field>

			<v-menu offset-y :close-on-content-click="false">
				<template #activator="{ on, attrs }">
					<v-btn
						:color="colorModel"
						class="MapBelongsToPopupSelectedTab__color-picker"
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
			</v-menu>
			<v-btn
				color="success"
				:disabled="isNotDirty"
				:loading="isLoadingUpdate"
				@click="updateHandler"
			>
				Применить
			</v-btn>
		</div>

		<div class="MapBelongsToPopupSelectedTab__selected-settings-dnd">
			<div class="MapBelongsToPopupSelectedTab__disciplines-block">
				<div class="MapBelongsToPopupSelectedTab__disciplines-title">
					Доступные дисциплины
					<v-text-field
						v-model="searchAllDisciplinesModel"
						class="MapBelongsToPopupSelectedTab__search"
						label="Поиск дисциплины"
						outlined
						dense
						hide-details="auto"
					/>
				</div>

				<!-- Все дисциплины -->
				<draggable
					v-bind="dragOptions"
					:value="filteredAvailableDisciplines"
					:set-data="setData"
					style="height: 340px; overflow-y: scroll"
				>
					<v-list-item
						v-for="element in filteredAvailableDisciplines"
						:key="element.id"
						class="MapBelongsToPopupSelectedTab__discipline-item"
					>
						<v-list-item-icon class="mr-1">
							<v-icon size="medium" :color="map[element[idKey]]?.color">
								mdi-circle
							</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							{{ element.discipline }}
						</v-list-item-content>
					</v-list-item>
				</draggable>
			</div>

			<v-divider class="MapBelongsToPopupSelectedTab__ver-divider" vertical />

			<div>
				<div class="MapBelongsToPopupSelectedTab__disciplines-title">
					Назначенные дисциплины
					<v-text-field
						v-model="searchAppointDisciplinesModel"
						class="MapBelongsToPopupSelectedTab__search"
						label="Поиск дисциплины"
						outlined
						dense
						hide-details="auto"
					/>
				</div>

				<!-- Назначенные дисциплины -->
				<draggable
					v-bind="dragOptions"
					:value="filteredAppointedDisciplines"
					:set-data="setData"
					style="height: 340px; overflow-y: scroll"
					@change="onChangeAppointedGroup"
				>
					<v-list-item
						v-for="element in filteredAppointedDisciplines"
						:key="element.id"
						class="MapBelongsToPopupSelectedTab__discipline-item"
					>
						<v-list-item-icon class="mr-1">
							<v-icon size="medium" :color="map[element[idKey]]?.color">
								mdi-circle
							</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							{{ element.discipline }}
						</v-list-item-content>
					</v-list-item>
				</draggable>
			</div>
		</div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
	components: {
		draggable,
	},

	props: {
		availableDisciplines: {
			type: Array,
			required: true,
		},

		appointedDisciplines: {
			type: Array,
			required: true,
		},

		map: {
			type: Object,
			required: true,
		},

		current: {
			type: Number,
			required: true,
		},

		mode: {
			type: String,
			default: 'group',
		},

		isLoadingUpdate: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			colorModel: this.map[this.current].color,
			nameModel: this.map[this.current].name,

			searchAllDisciplinesModel: '',
			searchAppointDisciplinesModel: '',
		}
	},

	watch: {
		current() {
			this.colorModel = this.map[this.current].color
			this.nameModel = this.map[this.current].name
		},
	},

	computed: {
		selectedItem() {
			return this.map[this.current]
		},

		idKey() {
			switch (this.mode) {
				case 'module': {
					return 'id_module'
				}
				case 'group': {
					return 'id_group'
				}

				default: {
					return 'id_group'
				}
			}
		},

		isNotDirty() {
			return (
				this.selectedItem.name === this.nameModel &&
				this.selectedItem.color === this.colorModel
			)
		},

		filteredAvailableDisciplines() {
			return this.availableDisciplines.filter(e => {
				return e.discipline
					.toLowerCase()
					.includes(this.searchAllDisciplinesModel.toLowerCase())
			})
		},

		filteredAppointedDisciplines() {
			return this.appointedDisciplines.filter(e => {
				return e.discipline
					.toLowerCase()
					.includes(this.searchAppointDisciplinesModel.toLowerCase())
			})
		},

		dragOptions() {
			return {
				animation: 250,
				group: 'disciplines',
			}
		},
	},

	methods: {
		updateHandler() {
			this.$emit('update', {
				id: this.current,
				name: this.nameModel,
				color: this.colorModel,
			})
		},

		setData(dataTransfer) {
			dataTransfer.setDragImage(document.createElement('div'), 0, 0)
		},

		onChangeAppointedGroup(e) {
			if (e.added) {
				this.$emit('move', e.added.element.id, this.selectedItem.id)
			}

			if (e.removed) {
				this.$emit(
					'move',
					e.removed.element.id,
					this.mode === 'module' ? 19 : 1,
				)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.MapBelongsToPopupSelectedTab {
	&__selected {
		width: 300px;
	}

	&__selected-settings {
		width: 100%;
	}

	&__selected-settings-form {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
	}

	&__selected-settings-dnd {
		display: grid;
		grid-template-columns: 1fr min-content 1fr;
	}

	&__disciplines-title {
		text-align: center;
		margin-bottom: 10px;
		margin-top: 5px;
	}

	&__discipline-item {
		position: relative;
		display: flex;
		width: 100%;
		cursor: grab;
		background-color: rgba(0, 0, 0, 0.04);
		margin: 4px 0;
	}

	&__color-picker {
		margin-left: 8px;
		margin-right: 8px;
	}

	.v-btn::before {
		opacity: 0 !important;
	}
}
</style>
