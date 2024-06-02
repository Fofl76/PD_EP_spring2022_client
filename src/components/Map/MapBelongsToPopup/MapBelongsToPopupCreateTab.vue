<template>
	<div class="MapBelongsToPopupCreateTab">
		<div class="MapBelongsToPopupCreateTab__form">
			<div class="MapBelongsToPopupCreateTab__header text-h5">Создать</div>
			<div class="MapBelongsToPopupCreateTab__row">
				<v-text-field
					ref="createNameGroupInput"
					v-model="newItemForm.nameModel"
					label="Наименование"
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
				</v-menu>
				<div class="MapBelongsToPopupCreateTab__footer">
					<v-btn
						color="success"
						min-height="40px"
						block
						:disabled="isDisabledAdding"
						:loading="isLoadingAdding"
						@click="addModel(true)"
					>
						Создать
					</v-btn>
				</div>
			</div>
		</div>
		<div class="MapBelongsToPopupCreateTab__form mt-3">
			<div class="MapBelongsToPopupCreateTab__header text-h5">
				Добавить из имеющихся
			</div>
			<div class="MapBelongsToPopupCreateTab__row">
				<v-autocomplete
					v-model="newModel"
					:items="available"
					item-text="name"
					outlined
					return-object
					dense
				/>
				<v-btn
					:disabled="!newModel"
					color="success"
					height="40"
					class="ml-2"
					@click="addModel(false)"
				>
					Добавить
				</v-btn>
			</div>
		</div>
	</div>
</template>

<script>
import MSelect from '@components/common/MSelect.vue'

export default {
	components: { MSelect },
	props: {
		available: {
			type: Array,
			default: () => [],
		},
	},

	data() {
		return {
			newModel: null,

			newItemForm: {
				nameModel: '',
				color: '#FFFFFF',
			},

			isLoadingAdding: false,

			nameRules: [v => !!v || 'Это поле является обязательным'],
		}
	},

	computed: {
		isDisabledAdding() {
			return !this.newItemForm.nameModel.length
		},
	},

	methods: {
		addModel(create) {
			let item
			if (create) {
				if (this.isDisabledAdding) return

				item = {
					name: this.newItemForm.nameModel,
					color: this.newItemForm.color,
				}
			} else {
				item = this.newModel
			}

			this.newModel = null
			this.newItemForm = {
				nameModel: '',
				color: '#FFFFFF',
			}

			this.$emit('add-new', {
				create,
				item,
			})
		},
	},
}
</script>

<style lang="sass">
.MapBelongsToPopupCreateTab
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
