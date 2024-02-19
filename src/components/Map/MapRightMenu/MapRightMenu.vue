<template>
	<v-navigation-drawer
		class="MapRightMenu"
		v-model="value_"
		:width="rightMenuEditWidth"
		right
		dark
		disable-resize-watcher
		fixed
		hide-overlay
		app
		clipped
		@transitionend="onTransitionendMenu"
	>
		<div class="MapRightMenu__inner">
			<div class="MapRightMenu__header">
				<div class="MapRightMenu__panel-title">Редактирование дисциплины</div>
				<v-btn
					class="MapRightMenu__close"
					dark
					icon
					color="#c1c1c1"
					@click="onCloseButtonClick"
				>
					<v-icon dark size="26"> mdi-window-close </v-icon>
				</v-btn>
			</div>

			<div class="MapRightMenu__name">
				<v-text-field
					v-model="formService.model.discipline"
					label="Название дисциплины"
					hide-details="auto"
					:rules="disciplineRules"
					ref="discipline"
					dense
					filled
					dark
				/>
			</div>

			<v-expansion-panels
				v-model="expansionsModel"
				class="MapRightMenu__expansion-wrapper"
				flat
				multiple
				hover
			>
				<MapRightMenuCipherExpansion
					:cipher="formService.model.shifr"
					@inputCipher="onInputCipher"
					@inputError="onInputError('cipher', $event)"
				/>

				<MapRightMenuValueExpansion
					:item="formModel"
					:values="values"
					@updateValue="onUpdateValue"
					@selectControlTypes="changeValues"
					@inputError="onInputError('values', $event)"
				/>

				<MapRightMenuControlExpansion :currentControlTypeId="null" />
			</v-expansion-panels>

			<div class="MapRightMenu__actions">
				<v-btn
					color="success"
					fab
					dark
					:disabled="!isAvailable"
					:loading="isLoading"
					@click="onSave"
				>
					<v-icon size="26">mdi-content-save</v-icon>
				</v-btn>
			</div>

			<MapRightMenuConfirmPopup
				v-model="confirmPopupModel"
				:isError="!isValid"
				@close="onClosePopup"
				@save="onSavePopup"
				@back="onBackPopup"
			/>
		</div>
	</v-navigation-drawer>
</template>

<script>
import _ from 'lodash'

import { mapGetters } from 'vuex'

import MHint from '@components/common/MHint.vue'
import MapRightMenuCipherExpansion from './MapRightMenuCipherExpansion/MapRightMenuCipherExpansion.vue'
import MapRightMenuValueExpansion from './MapRightMenuValueExpansion/MapRightMenuValueExpansion.vue'
import MapRightMenuControlExpansion from './MapRightMenuControlExpansion/MapRightMenuControlExpansion.vue'
import MapRightMenuConfirmPopup from './MapRightMenuConfirmPopup.vue'

import withEventEmitter from '@mixins/withEventEmitter'
import mapsService from '@services/Maps/MapsService'
import ToastService from '@services/ToastService'
import FormService from '@services/Form/FormService'

const valueInitialModel = {
	discipline: '',
	shifr: '',
	shifr_new: {
		block: '',
		discipline: '',
		module: '',
		part: '',
		shifr: '',
	},
	type: {
		session: [],
		value: [],
	},
}

export default {
	name: 'MapRightMenu',

	components: {
		MHint,
		MapRightMenuCipherExpansion,
		MapRightMenuValueExpansion,
		MapRightMenuControlExpansion,
		MapRightMenuConfirmPopup,
	},

	props: {
		/* Флаг открытия панели */
		value: {
			type: Boolean,
			required: false,
			default: false,
		},

		/* ID редактируемого элемента */
		itemId: {
			type: String,
			required: false,
			default: null,
		},
	},

	mixins: [withEventEmitter('mapsService', 'mapsServiceHandlers')],

	data() {
		return {
			formService: null,
			mapsService,

			expansionsModel: [],
			confirmPopupModel: false,

			cipher: {
				block: null,
				part: null,
				module: null,
				discipline: null,
				shifr: null,
			},

			mapsServiceHandlers: {
				fetchAup: this.closeRightMenu,
			},

			/* Объект хранящий состояние ошибок v-form каждой раскрывашки
			 */
			errorExpansions: {
				cipher: {
					value: false,
					label: 'Шифр',
				},
				values: {
					value: false,
					label: 'Настройка объема',
				},
			},

			disciplineRules: [
				v => !!v || 'Это поле является обязательным',
				v =>
					(v && v.length < 120) ||
					'Название дисциплины не может превышать 120 символов',
			],
		}
	},

	watch: {
		itemId() {
			this.initRightMenu()
		},
	},

	computed: {
		...mapGetters('Map', ['rightMenuEditWidth']),

		/* Процесс сохранения карты */
		isLoading() {
			return mapsService.isLoadingSaveMapList
		},

		/* Текущий редактируемый элемент */
		item() {
			return _.cloneDeep(mapsService.getMapItemById(this.itemId))
		},

		formModel() {
			return this.formService.model
		},

		values() {
			return this.formModel?.type?.value
		},

		isEdited() {
			return this.formService.hasDiffs()
		},

		/* Проверяем, что каждый блок с формами валидный */
		isValid() {
			return Object.values(this.errorExpansions).every(
				errorState => !errorState.value
			)
		},

		isAvailable() {
			return this.isValid && this.isEdited
		},

		/* Проброс v-model для открытия/закрытия панели */
		value_: {
			get() {
				return this.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},
	},

	methods: {
		initRightMenu() {
			if (!this.item) return

			/* TODO: Сделать по-человечески. Это нужно чтобы СРС был сверху.
               Аккуратно, редактирование завязано на индексах массива с нагрузками
               при рефакторинге может все сломатся
            */
			const item = _.cloneDeep(this.item)
			item.type.value = this.sortValues(item.type.value)

			this.formService.init(item)
		},

		sortValues(values) {
			return [...values].sort((a, b) => {
				/* control_type_id === 'СРС' */
				if (a.control_type_id === 4) return -1
				return 1
			})
		},

		/* Обновление объема нагрузки */
		onUpdateValue({ index, value }) {
			console.log('[onUpdateValue]', { index, value })
			this.formService.setProperty(`type.value[${index}]`, value)
		},

		/* Изменение списка нагрузок объема */
		changeValues(values) {
			this.formService.setProperty(`type.value`, this.sortValues(values))
		},

		/* Обновление шифра */
		onInputCipher({ cipherStr, cipher }) {
			this.formService.setProperty('shifr', cipherStr)
			this.formService.setProperty('shifr_new', {
				...cipher,
				shifr: cipherStr,
			})
		},

		async onSave() {
			this.formService.setProperty(`id_block`, this.formModel.shifr_new.block)
			this.formService.setProperty(`id_parts`, this.formModel.shifr_new.part)

			const res = await mapsService.editMapItem(
				mapsService.aupCode,
				this.item,
				this.formModel
			)

			if (res) {
				ToastService.showSuccess('Карта успешно сохранена.')
				this.closeRightMenu()
			} else {
				ToastService.showError('Произошла ошибка при сохранении карты.')
			}

			return res
		},

		// Обработчик который вызывается когда в каком-то поле
		// с объемами происходит ошибка ввода
		onInputError(type, value) {
			this.errorExpansions[type].value = value
		},

		// Закрытие
		closeRightMenu() {
			this.value_ = false
		},

		// Очищаем форму и закрываем все раскрывашки
		// после закрытия панели
		onTransitionendMenu() {
			if (!this.value) {
				this.clear()
				this.expansionsModel = []
			}
		},

		onCloseButtonClick() {
			if (this.isEdited || !this.isValid) {
				this.confirmPopupModel = true
			} else {
				this.closeRightMenu()
			}
		},

		// Закрытие попапа без сохранения
		onClosePopup() {
			this.confirmPopupModel = false
			this.closeRightMenu()
		},

		// Сохранение через попап
		async onSavePopup() {
			this.confirmPopupModel = false
			const res = await this.onSave()
			if (res) this.closeRightMenu()
		},

		// Вернуться назад к редактированию
		onBackPopup() {
			this.confirmPopupModel = false
		},
		//

		// Очистка
		clear() {
			this.formService.init()
		},
	},

	created() {
		this.formService = new FormService(valueInitialModel)
	},
}
</script>

<style lang="sass">
.MapRightMenu
    &__header
        display: flex
        justify-content: space-between
        align-items: center

    &__name
        margin-bottom: 8px

    &__panel-title
        color: #fff

    &__inner
        position: relative
        padding: 12px 16px 16px 16px
        display: flex
        gap: 8px
        flex-direction: column
        justify-content: flex-start
        height: 100%

    &__actions
        position: fixed
        right: 16px
        bottom: 16px
        z-index: 2
</style>
