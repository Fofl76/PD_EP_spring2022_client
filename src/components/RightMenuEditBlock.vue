<template>
	<v-navigation-drawer
		class="RightMenuEditBlock"
		v-model="value"
		:width="width"
		right
		dark
		disable-resize-watcher
		fixed
		hide-overlay
		app
		clipped
	>
		<div class="RightMenuEditBlock__inner">
			<div class="RightMenuEditBlock__section">
				<div class="RightMenuEditBlock__section-title">Основные настройки</div>

				<v-text-field
					v-model="copyItem.discipline"
					@input="onInput"
					label="Введите название"
					hide-details="auto"
					:rules="disciplineRules"
					ref="discipline"
					dense
					filled
					dark
				/>
			</div>

			<div class="RightMenuEditBlock__section">
				<div class="RightMenuEditBlock__section-title">Настройки объема</div>

				<div
					class="RightMenuEditBlock__zet-input-wrapper"
					v-for="(type, i) in copyItem.type"
					:key="i"
				>
					<v-text-field
						v-model="copyItem.type[i].zet"
						:label="copyItem.type[i].control"
						@input="onInput"
						:min="1"
						:max="10"
						type="number"
						ref="zet"
						:rules="zetRules"
						dense
						filled
						dark
					/>
				</div>
			</div>

			<div class="RightMenuEditBlock__actions">
				<v-btn
					class="RightMenuEditBlock__cancel-btn"
					@click="onCancel"
					color="error"
				>
					<span>Отменить</span>
				</v-btn>

				<v-btn
					class="RightMenuEditBlock__save-btn"
					@click="onSave"
					color="success"
					:loading="loading"
				>
					<span>Сохранить</span>
				</v-btn>
			</div>
		</div>
	</v-navigation-drawer>
</template>

<script>
export default {
	name: 'RightMenuEditBlock',
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
		copyItem: {
			discipline: '',
			type: [],
		},

		zetRules: [
			v => !!v || 'Это поле является обязательным',
			v => (v && +v >= 0) || 'Значение не может быть меньше 0',
			v => (v && +v < 10) || 'Значение должно быть меньше 10',
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
	},

	methods: {
		onCancel() {
			this.$emit('edit', {
				oldRow: this.item.num_row,
				oldCol: this.item.num_col,
				newItem: Object.assign({}, this.item),
			})

			this.$emit('input', false)
		},

		onSave() {
			this.$emit('save')
		},

		clear() {
			this.copyItem = {
				discipline: '',
				type: [],
			}
		},

		async onInput() {
			const newItem = JSON.parse(JSON.stringify(this.copyItem))

			if (!newItem.discipline) return
			if (!newItem.type) return

			let discipline = newItem.discipline
			let type = newItem.type

			type.forEach((_, i) => {
				const isValid = this.$refs.zet[i].validate()

				if (!isValid) type[i] = this.item.type[i]
				type[i].zet = +type[i].zet
			})

			if (!this.isValidName) discipline = this.item.discipline

			await this.$nextTick()

			const data = {
				oldRow: this.item.num_row,
				oldCol: this.item.num_col,
				newItem: {
					...this.item,
					discipline,
					type,
				},
			}

			this.$emit('edit', data)
		},
	},

	watch: {
		value(val) {
			if (val) {
				if (!this.item) return

				const { discipline, type } = Object.assign({}, this.item)

				this.copyItem = {
					discipline,
					type: JSON.parse(JSON.stringify(type)),
				}
			} else {
				this.clear()
			}
		},

		item(item) {
			const { discipline, type } = Object.assign({}, item)

			this.copyItem = {
				discipline,
				type: JSON.parse(JSON.stringify(type)),
			}
		},
	},
}
</script>

<style lang="sass">
.RightMenuEditBlock
    &__inner
        padding: 16px
        display: grid
        gap: 8px

    &__section
        margin-bottom: 12px

    &__section-title
        font-size: 1em
        color: #fff
        margin-bottom: 8px

    &__actions
        display: flex
        justify-content: flex-end

    &__cancel-btn
        margin-right: 8px
</style>
