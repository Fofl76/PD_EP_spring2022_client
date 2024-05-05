<template>
	<div class="MapGroupsPopupCreateTab">
		<div class="MapGroupsPopupCreateTab__form">
			<div class="MapGroupsPopupCreateTab__header text-h5">Cоздание группы</div>
			<div class="MapGroupsPopupCreateTab__row">
				<v-text-field
					ref="createNameGroupInput"
					v-model="newItemForm.nameModel"
					class="MapGroupsPopup__name-group"
					label="Наименование группировки"
					outlined
					dense
					hide-details="auto"
					:rules="nameRules"
				></v-text-field>

				<v-menu offset-y :close-on-content-click="false">
					<template #activator="{ on, attrs }">
						<v-btn
							:color="newItemForm.color"
							v-bind="attrs"
							class="ml-2"
							min-height="40px"
							v-on="on"
						>
							Цвет
						</v-btn>
					</template>

					<v-color-picker
						v-model="newItemForm.color"
						dot-size="25"
						mode="hexa"
						swatches-max-height="200"
					/>
					<!-- dot-size="25"
						hide-inputs
						hide-mode-switch
						swatches-max-height="200" -->
				</v-menu>
				<div class="MapGroupsPopupCreateTab__footer">
				<v-btn
					color="success"
					min-height="40px"
					block
					:disabled="isDisableAddGroups"
					:loading="isLoadingAddGroups"
					@click="addModel"
				>
					Создать
				</v-btn>
			</div>
		</div>
			
		</div>
		<div class="MapGroupsPopupCreateTab__form mt-3">
			<div class="MapGroupsPopupCreateTab__header text-h5">
				Добавление группы
			</div>
			<div class="MapGroupsPopupCreateTab__row">
				<v-autocomplete
					v-model="newGroup"
					:items="sortedGroupsStreetDisciplinesBangFacultyBlats"
					item-text="name"
					outlined
					return-object
					dense
				/>
				<v-btn
					:disabled="!newGroup"
					color="success"
					height="40"
					class="ml-2"
					@click="$emit('addGroup', newGroup)"
				>
					Добавить
				</v-btn>
			</div>
		</div>
	</div>
</template>

<script>
import MSelect from '@components/common/MSelect.vue'
import groupsService from '@services/Groups/GroupsService'
import mapsService from '@services/Maps/MapsService'

import _ from 'lodash'

export default {
	components: { MSelect },
	props: {
		groups: {
			type: Array,
			default: () => [],
		},
	},

	data() {
		return {
			newGroup: null,

			newItemForm: {
				nameModel: '',
				color: '#FFFFFF',
			},

			isLoadingAddGroups: false,

			nameRules: [
				v => !!v || 'Это поле является обязательным',
				v =>
					(v && v.length < 70) ||
					'Название дисциплины не может превышать 70 символов',
			],
		}
	},

	computed: {
		isDisableAddGroups() {
			return !this.newItemForm.nameModel.length
		},

		sortedGroupsStreetDisciplinesBangFacultyBlats() {
			return _.orderBy(this.groups, 'name').sort((a, b) => {
				if (a.name < b.name) {
					return -1
				}

				return 1
			})
		},
	},

	methods: {
		async addModel() {
			if (this.isDisableAddGroups) return

			this.isLoadingAddGroups = true

			const newGroup = {
				name: this.newItemForm.nameModel,
				color: this.newItemForm.color,
			}

			try {
				const res = await groupsService.addGroup(newGroup, mapsService.aupCode)

				if (res) {
					this.$emit('addGroup', res)
				}
			} catch (e) {
				console.log(e)
			} finally {
				this.isLoadingAddGroups = false
			}
		},
	},
}
</script>

<style lang="sass">
.MapGroupsPopupCreateTab
    width: 100%
    height: 100%
    display: flex
    align-items: center
    flex-direction: column
    justify-content: space-evenly
    

    &__form
        margin: -6px !important
        width: 555px
        display: flex
        flex-direction: column

        & > *
            margin: 6px !important
    &__row
        display: flex
        gap: 10px
        > *:first-chield
			
            margin-right: 6px !important

    &__header
        font-weight: bold !important


</style>
