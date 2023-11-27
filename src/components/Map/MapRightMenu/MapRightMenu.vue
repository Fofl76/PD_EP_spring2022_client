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
	>
		<div class="MapRightMenu__inner">
			<div class="MapRightMenu__panel-title">Редактирование дисциплины</div>

			<div class="MapRightMenu__section">
				<!-- Название -->
				<v-text-field
					v-model="copyItem.discipline"
					label="Введите название"
					hide-details="auto"
					:rules="disciplineRules"
					ref="discipline"
					dense
					filled
					dark
				/>
			</div>

			<v-expansion-panels class="MapRightMenu__expansion-wrapper" flat hover>
				<MapRightMenuCipherExpansion
					:cipher="copyItem.shifr"
					@inputCipher="onInputCipher"
				/>

				<MapRightMenuValueExpansion
					:values="copyItem.type.value"
					@updateValue="onUpdateValue"
					@updateUnitOfMeasurement="onUpdateUnitOfMeasurement"
					@selectControlTypes="changeValues"
				/>

				<MapRightMenuControlExpansion
					:currentControlTypeId="null"
					:allControlTypes="allControlTypes"
				/>
			</v-expansion-panels>

			<div class="MapRightMenu__actions">
				<v-btn class="MapRightMenu__cancel-btn" color="error" @click="onCancel">
					<span>Отменить</span>
					<v-icon right dark> mdi-close</v-icon>
				</v-btn>

				<v-btn
					class="MapRightMenu__save-btn"
					color="success"
					:loading="isLoading"
					@click="onSave"
				>
					<span>Сохранить</span>
					<v-icon right dark> mdi-content-save</v-icon>
				</v-btn>
			</div>
		</div>
	</v-navigation-drawer>
</template>

<script>
import _ from 'lodash'

import { mapGetters } from 'vuex'

import MHint from '@components/common/MHint.vue'
import MapRightMenuCipherExpansion from './MapRightMenuCipherExpansion.vue'
import MapRightMenuValueExpansion from './MapRightMenuValueExpansion/MapRightMenuValueExpansion.vue'
import MapRightMenuControlExpansion from './MapRightMenuControlExpansion.vue'

import withEventEmitter from '@mixins/withEventEmitter'
import MapsService from '@services/Maps/MapsService'
import ToastService from '@services/ToastService'

export default {
	name: 'MapRightMenu',

	components: {
		MHint,
		MapRightMenuCipherExpansion,
		MapRightMenuValueExpansion,
		MapRightMenuControlExpansion,
	},
	props: {
		value: {
			type: Boolean,
			required: false,
			default: false,
		},
		itemId: {
			type: String,
			required: false,
			default: null,
		},
		loading: {
			type: Boolean,
			required: false,
			default: false,
		},
	},

	mixins: [withEventEmitter('MapsService', 'mapsServiceHandlers')],

	data() {
		return {
			MapsService,

			copyItem: {
				discipline: '',
				shifr: '',
				type: {
					session: [],
					value: [],
				},
			},

			cipher: {
				block: null,
				part: null,
				module: null,
				discipline: null,
			},
			cipherStr: null,

			zetRules: [
				v => !!String(v).length || 'Это поле является обязательным',
				v => +v >= 0 || 'Значение должно быть больше, либо равно 0',
				v => +v <= 10 || 'Значение должно быть меньше, либо равно 10',
			],

			hoursRules: [
				v => !!String(v).length || 'Это поле является обязательным',
				v => +v >= 0 || 'Значение должно быть больше 0, либо равно 0',
				v => +v <= 320 || 'Значение должно быть меньше, либо равно 320',
			],

			disciplineRules: [
				v => !!v || 'Это поле является обязательным',
				v =>
					(v && v.length < 70) ||
					'Название дисциплины не может превышать 70 символов',
			],
		}
	},

	watch: {
		value(v) {
			if (v) {
				this.initRightMenu()
			}
		},
		itemId() {
			this.initRightMenu()
		},
	},

	computed: {
		...mapGetters('Map', ['rightMenuEditWidth']),

		value_: {
			get() {
				return this.value
			},

			set(value) {
				this.$emit('input', value)
			},
		},

		isLoading() {
			return this.MapsService.isLoadingSaveMapList
		},

		item() {
			return _.cloneDeep(this.MapsService.getMapItemById(this.itemId))
		},

		getControlTypesLabel() {
			return control_id => {
				return this.MapsService.controlTypes.value.find(
					item => item.id === control_id
				).name
			}
		},

		calculatedZet() {
			return (amount, id_edizm) => {
				if (id_edizm === 2) {
					return amount * this.MapsService.WEEKQUEALSZET
				}

				return amount / this.MapsService.ZETQUEALSHOURS
			}
		},

		allValueTypes() {
			return this.MapsService.controlTypes.value
				.filter(el => !el.is_control)
				.map(el => {
					return {
						...el,
						control: el.name,
					}
				})
		},

		allControlTypes() {
			return this.MapsService.controlTypes.value.filter(el => el.is_control)
		},
	},

	methods: {
		initRightMenu() {
			this.copyItem = _.cloneDeep(this.item)

			this.copyItem.type.value = this.addZetInTypeValue(
				this.copyItem.type.value
			)
		},

		/* Обновление объема */
		onUpdateValue({ index, hours, zet }) {
			this.copyItem.type.value[index].amount = hours
			this.copyItem.type.value[index].zet = zet
		},

		/* Обновление объема x2 */
		onUpdateUnitOfMeasurement({ index, id_edizm, hours }) {
			this.copyItem.type.value[index].id_edizm = id_edizm
			this.copyItem.type.value[index].amount = hours
		},

		/* Перезапись объемов, используется для выбора нагрузок
           TODO: Сделать нормально
        */
		changeValues(values) {
			this.copyItem.type.value = values
		},

		/* Обновление шифра */
		onInputCipher({ cipherStr, cipher }) {
			this.cipherStr = cipherStr
			this.cipher = cipher
		},

		/* В данные дисциплины добавляет новое поле zet */
		addZetInTypeValue(value) {
			return value.map(el => ({
				...el,
				zet: this.calculatedZet(el.amount, el.id_edizm),
			}))
		},

		onCancel() {
			this.value_ = false
		},

		async onSave() {
			this.copyItem.id_block = this.cipher.block
			this.copyItem.id_parts = this.cipher.part
			this.copyItem.shifr = this.cipherStr

			const res = await this.MapsService.editMapItem(
				this.$route.query.aup,
				this.item,
				this.copyItem
			)

			if (res) {
				ToastService.showSuccess('Карта успешно сохранена.')
			} else {
				ToastService.showError('Произошла ошибка при сохранении карты.')
			}

			this.initRightMenu()
		},

		clear() {
			this.copyItem = {
				discipline: '',
				shifr: '',
				type: {
					session: [],
					value: [],
				},
			}
		},
	},
}
</script>

<style lang="sass">
.MapRightMenu

    &__panel-title
        color: #fff

    .MHintActivator
        margin-left: 4px
        width: 25px
        height: 25px

    &__inner
        padding: 16px
        display: flex
        gap: 8px
        flex-direction: column
        justify-content: flex-start
        height: 100%

    &__section
        margin-bottom: 12px


    &__section-title-block
        display: flex
        align-items: center
        color: #fff

    &__actions
        display: flex
        gap: 8px
        margin-top: auto

        button
          flex: 1


    &__type-wrapper
        display: flex
        flex-direction: column
        color: #fff
        margin-top: 8px

        & > *:not(:last-child)
            margin-bottom: 8px

    &__type-row
        display: grid
        grid-template-columns: 1fr 1fr
        grid-template-rows: 1fr
        gap: 8px
        align-items: center

        &__switch
            grid-column: 1/3
            margin: 0 !important

    &__hint
        margin-left: 8px

    &__expansion-wrapper
        border-radius: 4px 4px 0 0 !important

    &__expansion

    &__expansion-header
        display: flex
        align-items: center
        color: #fff

        &-chip
            margin-left: auto

    &__expansion-header-title
        font-size: 16px
</style>
