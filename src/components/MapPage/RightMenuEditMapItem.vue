<template>
	<v-navigation-drawer
		class="RightMenuEditMapItem"
		v-model="value_"
		:width="width"
		right
		dark
		disable-resize-watcher
		fixed
		hide-overlay
		app
		clipped
	>
		<div class="RightMenuEditMapItem__inner">
			<div class="RightMenuEditMapItem__section">
				<div class="RightMenuEditMapItem__section-title">
					Основные настройки
				</div>

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

			<div class="RightMenuEditMapItem__section">
				<div class="RightMenuEditMapItem__section-title-block">
					<div class="RightMenuEditMapItem__section-title">
						Настройки объема
					</div>

					<MHint
						class="RightMenuEditMapItem__hint"
						tooltipText="СРС настраивается автоматически исходя из суммы"
					/>
				</div>

				<!-- Настройки объемов -->
				<div class="RightMenuEditMapItem__type-wrapper">
					<div class="RightMenuEditMapItem__type-row">
						<div>Зет</div>
						<div>Часы</div>
					</div>

					<div
						class="RightMenuEditMapItem__type-row"
						v-for="(type, i) in copyItem.type"
						:key="i"
					>
						<v-text-field
							:value="copyItem.type[i].zet"
							:label="copyItem.type[i].control"
							:disabled="copyItem.type[i].control === 'СРС'"
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

						<v-text-field
							:value="copyItem.type[i].hours"
							:label="copyItem.type[i].control"
							:disabled="copyItem.type[i].control === 'СРС'"
							type="number"
							ref="zet"
							:rules="hoursRules"
							hide-details
							dense
							filled
							dark
							@input="onInputHours(i, $event)"
						/>
					</div>

					<v-select
						:value="selectedControlTypes"
						:items="allControlTypes"
						label="Нагрузки"
						item-text="control"
						item-disabled="disabled"
						return-object
						filled
						dense
						hide-details
						multiple
						no-data-text="Доступные нагрузки отсутствуют"
						@input="onSelectControlTypes"
					>
						<template v-slot:selection="{ item, index }">
							<v-chip small v-if="index === 0">
								<span>{{ item.control }}</span>
							</v-chip>
							<span v-if="index === 1" class="grey--text text-caption">
								(+{{ selectedControlTypes.length - 1 }} нагрузки)
							</span>
						</template>
					</v-select>

					<v-divider dark class="RightMenuEditMapItem__divider" />

					<div class="RightMenuEditMapItem__type-row">
						<v-text-field
							:value="sumZet"
							label="Сумма ЗЕТ"
							type="number"
							hide-details
							dense
							filled
							dark
							@input="onInputSumZet"
						/>

						<v-text-field
							:value="sumHours"
							label="Сумма часов"
							type="number"
							hide-details
							dense
							filled
							dark
							@input="onInputSumHours"
						/>
					</div>
				</div>
			</div>

			<div class="RightMenuEditMapItem__actions">
				<v-btn
					class="RightMenuEditMapItem__cancel-btn"
					color="error"
					@click="onCancel"
				>
					<span>Отменить</span>
				</v-btn>

				<v-btn
					class="RightMenuEditMapItem__save-btn"
					color="success"
					:loading="loading"
					@click="onSave"
				>
					<span>Сохранить</span>
				</v-btn>
			</div>
		</div>
	</v-navigation-drawer>
</template>

<script>
import _ from 'lodash'
import MapsService from '@services/Maps/MapsService'
import MHint from '@components/ui/MHint.vue'

import withEventEmitter from '@mixins/withEventEmitter'

export default {
	components: { MHint },
	name: 'RightMenuEditMapItem',
	props: {
		value: {
			type: Boolean,
			required: false,
			default: false,
		},
		item: {
			type: Object,
			required: false,
			default: null,
		},
		loading: {
			type: Boolean,
			required: false,
			default: false,
		},
		width: {
			type: Number,
			required: false,
			default: 400,
		},
	},

	mixins: [withEventEmitter('MapsService', 'mapsServiceHandlers')],

	data: () => ({
		MapsService,

		copyItem: {
			discipline: '',
			type: [],
		},

		sumZet: 0,
		sumHours: 0,

		allControlTypes: [],
		selectedControlTypes: [],

		zetRules: [
			v => (!!v && v !== 0) || 'Это поле является обязательным',
			v => (v && +v >= 0) || 'Значение должно быть больше  0',
			v => (v && +v <= 10) || 'Значение должно быть меньше, либо равно 10',
		],

		hoursRules: [
			v => (!!v && v !== 0) || 'Это поле является обязательным',
			v => (v && +v >= 0) || 'Значение должно быть больше 0',
			v => (v && +v <= 320) || 'Значение должно быть меньше, либо равно 320',
		],

		disciplineRules: [
			v => !!v || 'Это поле является обязательным',
			v =>
				(v && v.length < 70) ||
				'Название дисциплины не может превышать 70 символов',
		],
	}),
	computed: {
		isValidZet() {
			return this.$refs.zet.validate()
		},

		isValidName() {
			return this.$refs.discipline.validate()
		},

		zetEqualsHours() {
			return this.MapsService.ZETQUEALSHOURS
		},

		// Открытие/закрытие панели
		value_: {
			get() {
				return this.value
			},

			set(value) {
				if (value) this.setNewEditingItem(this.item)

				this.$emit('input', value)
			},
		},
	},

	methods: {
		setNewEditingItem(item) {
			const copyItem = _.cloneDeep(item)

			copyItem.type = this.buildControlTypes(copyItem.type)
			copyItem.type = this.sortControlTypes(copyItem.type)

			this.initSelectedControlTypes(item)

			this.copyItem = copyItem

			this.allControlTypes = this.MapsService.controlTypes.value.map(
				controlType => ({
					control: controlType.name,
					controlTypeId: controlType.id,
					zet: 0,
					disabled: item.type.find(e => e.controlTypeId == controlType.id),
				})
			)

			this.allControlTypes.sort(a => (a.disabled ? -1 : 1))

			this.sumZet = this.getSum('zet')
			this.sumHours = this.getSum('hours')
		},

		buildControlTypes(controlTypes) {
			return controlTypes.map(type => {
				return {
					...type,
					hours: type.zet * this.zetEqualsHours,
				}
			})
		},

		// Временный костыль, чтобы СРС был всегда вверху
		sortControlTypes(controlTypes) {
			const sortedControlTypes = _.cloneDeep(controlTypes)

			sortedControlTypes.sort((a, b) => {
				if (a.control === 'СРС') return -1
			})

			return sortedControlTypes
		},

		initSelectedControlTypes(item) {
			this.selectedControlTypes = [...item.type]
		},

		onSelectControlTypes(e) {
			let controlTypes = this.buildControlTypes(e)
			controlTypes = this.sortControlTypes(controlTypes)

			this.copyItem.type = controlTypes
		},

		onCancel() {
			this.value_ = false
			this.clear()
			this.$emit('close')
		},
		onSave() {
			this.MapsService.editMapItem(
				this.$route.query.aup,
				this.item,
				this.copyItem
			)
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

		// field: 'zet' | 'hours'
		getSum(field, withoutFirstItem) {
			return this.copyItem.type.reduce(
				(accumulator, currentValue) =>
					currentValue.control === 'СРС' && withoutFirstItem
						? accumulator
						: accumulator + currentValue[field],
				0
			)
		},

		onInputZet(indexType, value) {
			value = +value

			this.copyItem.type[indexType].zet = value
			this.copyItem.type[indexType].hours = value * this.zetEqualsHours

			this.recalculateSum()
		},

		onInputHours(indexType, value) {
			value = +value

			this.copyItem.type[indexType].hours = value
			this.copyItem.type[indexType].zet = value / this.zetEqualsHours

			this.recalculateSum()
		},

		recalculateSum() {
			this.sumZet = this.getSum('zet')
			this.sumHours = this.getSum('hours')
		},

		onInputSumZet(value) {
			value = +value

			const sumZet = this.getSum('zet', true)

			const newFirstItemZet = value - sumZet

			this.copyItem.type[0].zet = newFirstItemZet
			this.copyItem.type[0].hours = newFirstItemZet * this.zetEqualsHours

			this.sumZet = value
			this.sumHours = value * this.zetEqualsHours
		},
		onInputSumHours(value) {
			value = +value

			const sumHours = this.getSum('hours', true)

			const newFirstItemHours = value - sumHours

			this.copyItem.type[0].hours = newFirstItemHours
			this.copyItem.type[0].zet = newFirstItemHours / this.zetEqualsHours

			this.sumHours = value
			this.sumZet = value / this.zetEqualsHours
		},
	},
}
</script>

<style lang="sass">
.RightMenuEditMapItem
    &__divider
        margin: 8px 0

    .MHintActivator
        margin-left: 4px
        width: 25px
        height: 25px

    &__inner
        padding: 16px
        display: grid
        gap: 8px
    &__section
        margin-bottom: 12px


    &__section-title-block
        display: flex
        align-items: center
        margin-bottom: 8px

    &__section-title
        font-size: 1em
        color: #fff

    &__actions
        display: flex
        justify-content: flex-end
    &__cancel-btn
        margin-right: 8px

    &__type-wrapper
        display: flex
        flex-direction: column
        color: #fff

        & > *:not(:last-child)
            margin-bottom: 8px

    &__type-row
        display: grid
        grid-template-columns: 1fr 1fr
        grid-template-rows: 1fr
        gap: 8px
        align-items: center
</style>
