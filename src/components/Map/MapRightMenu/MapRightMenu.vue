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

				<!-- <MapRightMenuValueExpansion :values="copyItem.type.value" /> -->

				<v-expansion-panel class="MapRightMenu__expansion">
					<v-expansion-panel-header>
						<div class="MapRightMenu__expansion-header">
							<div class="MapRightMenu__expansion-header-title">
								Настройки объема
							</div>

							<!-- <MHint contentClass="MapRightMenu__hint"
                tooltipText="СРС настраивается автоматически исходя из суммы" /> -->
						</div>
					</v-expansion-panel-header>

					<v-expansion-panel-content>
						<div class="MapRightMenu__type-wrapper">
							<div class="MapRightMenu__type-row">
								<div>Часы</div>
								<div>Зет</div>
							</div>

							<div
								class="MapRightMenu__type-row"
								v-for="(type, i) in copyItem.type.value"
								:key="i"
							>
								<v-text-field
									:value="type.amount"
									:label="getControlTypesLabel(type.control_type_id)"
									type="number"
									ref="zet"
									:rules="hoursRules"
									hide-details
									dense
									filled
									dark
									@input="onInputHours(i, $event)"
								/>

								<v-text-field
									:value="type.zet"
									:label="getControlTypesLabel(type.control_type_id)"
									:min="1"
									:max="10"
									type="number"
									ref="zet"
									:rules="zetRules"
									hide-details
									dense
									filled
									dark
									@input="onInputZet(i, $event)"
								/>

								<v-switch
									:value="type.id_edizm === 2"
									class="MapRightMenu__type-row__switch"
									label="Измерять в неделях"
									@change="onUpdateUnitsOfMeasurement(i)"
								/>
							</div>

							<v-divider dark class="MapRightMenu__divider" />

							<div class="MapRightMenu__type-row">
								<v-text-field
									:value="sumHours"
									label="Сумма часов"
									type="number"
									hide-details
									readonly
									dense
									filled
									dark
								/>

								<v-text-field
									:value="sumZet"
									label="Сумма ЗЕТ"
									type="number"
									hide-details
									readonly
									dense
									filled
									dark
								/>
							</div>

							<v-divider dark class="MapRightMenu__divider" />

							<v-select
								:value="selectedControlTypes"
								:items="allValueTypes"
								label="Нагрузки"
								item-text="control"
								item-disabled="disabled"
								return-object
								filled
								dense
								hide-details
								multiple
								no-data-text="Доступные нагрузки отсутствуют"
								@change="onSelectControlTypes"
							>
								<!-- @input="onSelectControlTypes" -->
								<template v-slot:selection="{ item, index }">
									<v-chip small v-if="index === 0">
										<span>{{ item.control }}</span>
									</v-chip>
									<span v-if="index === 1" class="grey--text text-caption">
										(+{{ selectedControlTypes.length - 1 }} нагрузки)
									</span>
								</template>
							</v-select>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>

				<MapRightMenuControlExpansion
					:currentControlTypeId="controlTypes"
					:allControlTypes="allControlTypes"
					@changeControlType="onChangeControlType"
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

			selectedControlTypes: [],

			sumHours: 0,
			sumZet: 0,

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
			console.log(v)
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

		controlTypes: {
			get() {
				return this.copyItem.type.session[0]?.control_type_id || null
			},
			set(v) {
				if (this.copyItem.type.session[0]?.control_type_id)
					this.copyItem.type.session[0] = {
						control_type_id: v,
						id: this.copyItem.type.session[0].id,
						type: this.copyItem.type.session[0].type,
						id_edizm: 1,
						amount: 0,
					}
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
				const currentUnitsOfMeasurement =
					this.MapsService.unitsOfMeasurement.value.find(
						measurement => measurement.id_edizm === id_edizm
					)

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

			this.selectedControlTypes = this.allValueTypes.filter(el =>
				this.copyItem.type.value.find(_el => _el.control_type_id === el.id)
			)

			this.sumHours = this.getSum('amount')
			this.sumZet = this.getSum('zet')
		},

		onInputCipher({ cipherStr, cipher }) {
			this.cipherStr = cipherStr
			this.cipher = cipher
		},

		onChangeControlType(value) {
			/* TODO */
		},

		addZetInTypeValue(value) {
			return value.map(el => ({
				...el,
				zet: this.calculatedZet(el.amount, el.id_edizm),
			}))
		},

		onInputHours(index, value) {
			this.copyItem.type.value[index].amount = +value
			this.copyItem.type.value[index].zet = this.calculatedZet(
				+value,
				this.copyItem.type.value[index].id_edizm
			)

			this.sumHours = this.getSum('amount')
			this.sumZet = this.getSum('zet')
		},

		onInputZet(index, value) {
			this.copyItem.type.value[index].zet = +value

			if (this.copyItem.type.value[index].id_edizm === 2) {
				this.copyItem.type.value[index].amount =
					+value / this.MapsService.WEEKQUEALSZET
			} else {
				this.copyItem.type.value[index].amount =
					+value * this.MapsService.ZETQUEALSHOURS
			}

			this.sumHours = this.getSum('amount')
			this.sumZet = this.getSum('zet')
		},

		getSum(field, withoutFirstItem) {
			return this.copyItem.type.value.reduce((accumulator, currentValue) => {
				if (currentValue.id_edizm === 1 || field === 'zet') {
					return accumulator + currentValue[field]
				} else {
					return (
						accumulator + currentValue[field] * this.MapsService.WEEKQUEALSHOURS
					)
				}
			}, 0)
		},

		onSelectControlTypes(e) {
			if (e.length < this.copyItem.type.value.length) {
				this.copyItem.type.value = this.copyItem.type.value.filter(el =>
					e.find(_el => _el.id === el.control_type_id)
				)

				this.sumHours = this.getSum('amount')
				this.sumZet = this.getSum('zet')
			} else {
				const newType = e.at(-1)
				this.copyItem.type.value.push({
					control_type_id: newType.id,
					amount: 0,
					zet: 0,
					id_edizm: 1,
					type: 'load',
				})
			}
		},

		onUpdateUnitsOfMeasurement(index) {
			this.copyItem.type.value[index].id_edizm =
				(this.copyItem.type.value[index].id_edizm % 2) + 1

			this.copyItem.type.value[index].amount =
				this.copyItem.type.value[index].id_edizm === 2
					? this.copyItem.type.value[index].zet / this.MapsService.WEEKQUEALSZET
					: this.copyItem.type.value[index].zet *
					  this.MapsService.ZETQUEALSHOURS
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
				type: [],
			}

			this.sumZet = 0
			this.sumHours = 0
			this.selectedControlTypes = []
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
