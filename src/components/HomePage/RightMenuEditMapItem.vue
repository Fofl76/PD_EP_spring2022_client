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
						v-model="selectedLoadItems"
						:items="loadItems"
						label="Нагрузки"
						filled
						dense
						hide-details
						multiple
					>
						<template v-slot:selection="{ item, index }">
							<v-chip v-if="index === 0">
								<span>{{ item }}</span>
							</v-chip>
							<v-chip v-if="index === 1">
								<span>{{ item }}</span>
							</v-chip>
							<span v-if="index === 1" class="grey--text text-caption">
								(+{{ selectedLoadItems.length - 1 }} нагрузки)
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

	data: () => ({
		MapsService,

		copyItem: {
			discipline: '',
			type: [],
		},

		selectedLoadItems: [],
		loadItems: ['Foo', 'Bar', 'Fizz', 'Buzz'],

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

		zetEqualsHorus() {
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

		// value для поля "Сумма ЗЕТ"
		sumZet() {
			return this.copyItem.type.reduce(
				(accumulator, currentValue) => accumulator + currentValue.zet,
				0
			)
		},

		// value для поля "Сумма часов"
		sumHours() {
			return this.copyItem.type.reduce(
				(accumulator, currentValue) => accumulator + currentValue.hours,
				0
			)
		},
	},

	watch: {
		item: {
			handler(item) {
				if (!item) return

				this.setNewEditingItem(item)
			},
			immediate: true,
			deep: true,
		},
	},

	methods: {
		setNewEditingItem(item) {
			const copyItem = _.cloneDeep(item)

			copyItem.type = copyItem.type.map(type => {
				return {
					...type,
					hours: type.zet * this.zetEqualsHorus,
				}
			})

			// Временный костыль, чтобы СРС был всегда вверху
			copyItem.type = copyItem.type.sort((a, b) => {
				if (a.control === 'СРС') return -1
			})

			this.copyItem = copyItem
		},

		onCancel() {
			this.value_ = false
			this.clear()
			this.$emit('close')
		},
		onSave() {},

		clear() {
			this.copyItem = {
				discipline: '',
				type: [],
			}
		},

		onInputZet(indexType, value) {
			this.copyItem.type[indexType].zet = value
			this.copyItem.type[indexType].hours = value * this.zetEqualsHorus
		},

		onInputHours(indexType, value) {
			this.copyItem.type[indexType].hours = value
			this.copyItem.type[indexType].zet = value / this.zetEqualsHorus
		},

		onInputSumZet(value) {},
		onInputSumHours(value) {},
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
