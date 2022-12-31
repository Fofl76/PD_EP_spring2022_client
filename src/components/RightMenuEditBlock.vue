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
			<v-text-field
				v-model="copyItem.name"
				@input="onInput"
				label="Введите название"
				hide-details="auto"
				:rules="disciplineRules"
				ref="discipline"
				dense
				filled
				dark
			/>

			<v-text-field
				v-model="copyItem.zet"
				@input="onInput"
				:min="1"
				:max="10"
				label="Укажите объем"
				hide-details="auto"
				type="number"
				:rules="zetRules"
				ref="zet"
				dense
				filled
				dark
			/>

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
			name: '',
			zet: null,
		},

		zetRules: [
			v => !!v || 'Это поле является обязательным',
			v => (v && +v > 0) || 'Значение должно быть больше 0',
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
				newItem: this.item,
			})

			this.$emit('input', false)
		},

		onSave() {
			this.$emit('save')
		},

		clear() {
			this.copyItem = {
				name: '',
				zet: null,
			}
		},

		async onInput() {
			const newItem = this.copyItem

			if (!newItem.name) return

			let zet = +newItem.zet
			let discipline = newItem.name

			if (!this.isValidZet) zet = this.item.zet
			if (!this.isValidName) discipline = this.item.discipline

			await this.$nextTick()

			const data = {
				oldRow: this.item.num_row,
				oldCol: this.item.num_col,
				newItem: {
					...this.item,
					discipline,
					zet,
				},
			}

			this.$emit('edit', data)
		},
	},

	watch: {
		value(val) {
			if (val) {
				if (!this.item) return

				const { discipline, zet } = this.item

				this.copyItem = {
					name: discipline,
					zet,
				}
			} else {
				this.clear()
			}
		},

		item(item) {
			const { discipline, zet } = item

			this.copyItem = {
				name: discipline,
				zet,
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

    &__actions
        display: flex
        justify-content: flex-end

    &__cancel-btn
        margin-right: 8px
</style>
