<template>
	<div class="PopupGroupsAddGroups">
		<div class="PopupGroupsAddGroups-form">
			<div class="PopupGroupsAddGroups-header text-h5">
				Cоздание группы
			</div>
			<div class="PopupGroupsAddGroups-row">
				<v-text-field
					v-model="newItemForm.nameModel"
					class="PopupGroupsSettings__name-group"
					label="Наименование группировки"
					outlined
					dense
					hide-details="auto"
					:rules="nameRules"
					ref="createNameGroupInput"
				></v-text-field>

				<v-menu offset-y :close-on-content-click="false">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							:color="newItemForm.color"
							v-bind="attrs"
							v-on="on"
							class="ml-2"
							min-height="40px"
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
			</div>
			<div class="PopupGroupsAddGroups-footer">
				<v-btn
					color="success"
					min-height="40px"
					block
					@click="addModel"
					:disabled="isDisableAddGroups"
					:loading="isLoadingAddGroups"
				>
					Создать
				</v-btn>
			</div>
		</div>
    <div class="PopupGroupsAddGroups-form mt-3">
			<div class="PopupGroupsAddGroups-header text-h5">
				Добавление группы
			</div>
			<div class="PopupGroupsAddGroups-row">
				<v-select
					v-model="newGroup"
          :items="sortedGroupsStreetDisciplinesBangFacultyBlats"
          itemText="name"
          outlined
          return-object
          dense
				/>
        <v-btn
          @click="$emit('addGroup', newGroup)"
          :disabled="!newGroup"
          color="success"
          height="40"
          class="ml-2"
        >
          Добавить
        </v-btn>
			</div>

		</div>
	</div>
</template>

<script>
import MSelect from '@components/common/MSelect.vue'
import GroupsService from '@services/Groups/GroupsService'

import _ from 'lodash'

export default {
  components: {
    MSelect,
  },
  props: {
    groups: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      newGroup: null,

      groupsService: GroupsService,

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
				const res = await this.groupsService.addGroup(newGroup)

        if (res) {
          this.$emit('addGroup', res)
        }

			} catch (e) {
				console.log(e)
			} finally {
				this.isLoadingAddGroups = false
			}
		},
  }
}
</script>

<style lang="sass">
.PopupGroupsAddGroups
    width: 100%
    height: 100%
    display: flex
    align-items: center
    flex-direction: column
    justify-content: center
    font-size: 1.5em

    &-form
        margin: -6px !important
        width: 400px
        display: flex
        flex-direction: column
        > *
            margin: 6px !important
    &-row
        display: flex
        > *:first-chield
            margin-right: 6px !important

    &-header
        font-weight: bold !important
</style>
