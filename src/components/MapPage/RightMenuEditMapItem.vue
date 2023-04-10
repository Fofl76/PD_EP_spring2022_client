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
			<div class="RightMenuEditMapItem__panel-title">
				Редактирование дисциплины
			</div>

			<div class="RightMenuEditMapItem__section">
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

			<v-expansion-panels
				class="RightMenuEditMapItem__expansion-wrapper"
				flat
				hover
			>
				<v-expansion-panel class="RightMenuEditMapItem__expansion">
					<v-expansion-panel-header>
						<div class="RightMenuEditMapItem__expansion-header">
							<div class="RightMenuEditMapItem__expansion-header-title">
								Настройки объема
							</div>

							<MHint
								contentClass="RightMenuEditMapItem__hint"
								tooltipText="СРС настраивается автоматически исходя из суммы"
							/>
						</div>
					</v-expansion-panel-header>

					<v-expansion-panel-content>
						<div class="RightMenuEditMapItem__type-wrapper">
							<div class="RightMenuEditMapItem__type-row">
								<div>Часы</div>
								<div>Зет</div>
							</div>

							<div
								class="RightMenuEditMapItem__type-row"
								v-for="(type, i) in copyItem.type"
								:key="i"
							>
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
									:value="sumHours"
									label="Сумма часов"
									type="number"
									hide-details
									dense
									filled
									dark
									@input="onInputSumHours"
								/>

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
							</div>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>

			<div class="RightMenuEditMapItem__actions">
				<v-btn
					class="RightMenuEditMapItem__cancel-btn"
					color="error"
					@click="onCancel"
				>
					<span>Отменить</span>
					<v-icon right dark> mdi-close</v-icon>
				</v-btn>

				<v-btn
					class="RightMenuEditMapItem__save-btn"
					color="success"
					:loading="loading"
					:disabled="isDirty"
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
import MapsService from '@services/Maps/MapsService'
import MHint from '@components/common/MHint.vue'

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

		item: {
			discipline: '',
			type: [],
		},

		sumZet: 0,
		sumHours: 0,

		allControlTypes: [],
		selectedControlTypes: [],

		zetRules: [
			v => !!String(v).length || 'Это поле является обязательным',
			v => (+v >= 0) || 'Значение должно быть больше, либо равно 0',
			v => (+v <= 10) || 'Значение должно быть меньше, либо равно 10',
		],

		hoursRules: [
			v => !!String(v).length || 'Это поле является обязательным',
			v => (+v >= 0) || 'Значение должно быть больше 0, либо равно 0',
			v => (+v <= 320) || 'Значение должно быть меньше, либо равно 320',
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

		isDirty() {
			return _.isEqual(this.item, this.copyItem)
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
				this.$emit('input', value)
			},
		},
	},

	watch: {
		itemId() {
			this.setNewEditingItem()
		}
	},

	methods: {
		setNewEditingItem() {
			this.item = _.cloneDeep(this.MapsService.getMapItemById(this.itemId))

			const copyItem = _.cloneDeep(this.item)

			copyItem.type = this.buildControlTypes(copyItem.type)
			// copyItem.type = this.sortControlTypes(copyItem.type)

			this.item.type = this.buildControlTypes(this.item.type)

			this.initSelectedControlTypes(this.item)

			this.copyItem = copyItem

			this.allControlTypes = this.MapsService.controlTypes.value.map(
				controlType => ({
					control: controlType.name,
					controlTypeId: controlType.id,
					zet: 0,
					disabled: this.item.type.find(e => e.controlTypeId == controlType.id),
				})
			)

			this.allControlTypes.sort(a => (a.disabled ? -1 : 1))

			this.sumZet = this.getSum('zet')
			this.sumHours = this.getSum('hours')
		},

		buildControlTypes(controlTypes) {
			const buildControlTypes = controlTypes.map(type => {
				return {
					...type,
					hours: type.zet * this.zetEqualsHours,
				}
			})

			return this.sortControlTypes(buildControlTypes)
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
    &__panel-title
        color: #fff

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
        color: #fff

    &__actions
        display: grid
        grid-template-columns: 1fr 1fr
        gap: 8px

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

    &__hint
        margin-left: 8px

    &__expansion-wrapper
        border-radius: 4px 4px 0 0 !important

    &__expansion
        background-color: rgba(255, 255, 255, 0.08) !important

        .v-expansion-panel-header
            min-height: 52px !important
            padding: 16px !important
            border-bottom: 1px solid rgba(255, 255, 255, 0.7) !important
            position: relative

            &:after
                content: ''
                position: absolute
                width: 100%
                height: 1px
                bottom: 0
                left: 0
                background-color: #fff
                transform: rotateY(90deg)
                transition: transform .25s ease


        .v-expansion-panel-content__wrap
            padding: 0 16px 16px 16px !important

        &.v-expansion-panel--active

            .v-expansion-panel-header
                &:after
                    transform: rotateY(0deg)

    &__expansion-header
        display: flex
        align-items: center
        color: #fff

    &__expansion-header-title
        font-size: 16px
</style>
