<template>
	<MapRightMenuExpansion class="MapRightMenuCipherExpansion">
		<template #header>
			<div class="MapRightMenuCipherExpansion__header">
				<div class="MapRightMenuCipherExpansion__label">Шифр</div>

				<v-chip
					v-if="cipherLabel && isValid"
					style="cursor: pointer"
					pill
					label
					:ripple="false"
					:key="1"
				>
					{{ cipherLabel }}
				</v-chip>

				<v-chip
					v-if="!isValid"
					color="red"
					style="cursor: pointer"
					text-color="white"
					pill
					label
					:key="2"
				>
					Некорректно
				</v-chip>
			</div>
		</template>

		<template>
			<div class="MapRightMenuCipherExpansion__content">
				<v-form
					class="MapRightMenuCipherExpansion__form"
					v-model="isValid"
					ref="form"
					@input="onInputError"
				>
					<v-text-field
						v-model="cipherObj.block"
						ref="block"
						class="MapRightMenuCipherExpansion__input"
						label="Блок"
						type="number"
						:rules="[rules.required, rules.onlyPositiveInteger]"
						hide-details="auto"
						dense
						filled
						dark
						@input="onInput"
					>
						<!-- <template v-slot:append>
							<MHint :top="false" size="20" bottom>Блок</MHint>
						</template> -->
					</v-text-field>

					<v-text-field
						v-model="cipherObj.part"
						ref="part"
						class="MapRightMenuCipherExpansion__input"
						label="Часть"
						type="number"
						:rules="[rules.onlyPositiveInteger]"
						hide-details="auto"
						dense
						filled
						dark
						@input="onInput"
					>
						<!-- <template v-slot:append>
							<MHint :top="false" size="20" bottom>Часть</MHint>
						</template> -->
					</v-text-field>

					<v-text-field
						v-model="cipherObj.module"
						ref="module"
						class="MapRightMenuCipherExpansion__input"
						label="Модуль"
						type="number"
						:rules="[rules.onlyPositiveInteger]"
						hide-details="auto"
						dense
						filled
						dark
						@input="onInput"
					>
						<!-- <template v-slot:append>
							<MHint :top="false" size="20" bottom>Модуль</MHint>
						</template> -->
					</v-text-field>

					<v-text-field
						v-model="cipherObj.discipline"
						ref="discipline"
						class="MapRightMenuCipherExpansion__input"
						label="Дисциплина"
						type="number"
						:rules="[rules.onlyPositiveInteger]"
						hide-details="auto"
						dense
						filled
						dark
						@input="onInput"
					>
						<!-- <template v-slot:append>
							<MHint :top="false" size="20" bottom>Дисциплина</MHint>
						</template> -->
					</v-text-field>
				</v-form>
			</div>
		</template>
	</MapRightMenuExpansion>
</template>

<script>
import MapRightMenuExpansion from './MapRightMenuExpansion.vue'
import MHint from '@components/common/MHint.vue'

export default {
	name: 'MapRightMenuCipherExpansion',
	components: { MapRightMenuExpansion, MHint },

	data: () => ({
		cipherObj: {
			block: '',
			part: '',
			module: '',
			discipline: '',
		},

		isValid: true,

		rules: {
			required: value => !!value || 'Пожалуйста, заполните это поле.',
			onlyPositiveInteger: value => {
				const isPositiveInteger =
					0 === value % (!isNaN(parseFloat(value)) && 0 <= ~~value)

				return (
					isPositiveInteger ||
					value === '' ||
					'Значение должно быть целым и положительным, либо равно нулю'
				)
			},
		},
	}),

	props: {
		cipher: {
			type: String,
			default: '',
		},
	},

	computed: {
		cipherLabel() {
			const values = Object.values(this.cipherObj)
			const filteredValues = values.filter(item => item !== '')

			return filteredValues.length ? 'Б' + filteredValues.join('.') : null
		},
	},

	methods: {
		onInput() {
			/* На бек отправляется строчное значение, поэтому пока так */
			if (this.$refs['form'].validate())
				this.$emit('inputCipher', {
					cipherStr: this.cipherLabel,
					cipher: this.cipherObj,
				})
		},

		clear() {
			this.cipherObj = {
				block: '',
				part: '',
				module: '',
				discipline: '',
			}
		},

		onInputError(value) {
			this.$emit('inputError', !value)
		},
	},

	watch: {
		/**
		 * Строим объект на основе строки cipher
		 * Проверяем также наличия модуля путем вычисления длины строки, если его нету, то его нету
		 */
		cipher(value) {
			try {
				this.clear()

				if (!value) return

				console.log('cipher: ', value)

				const cipherArr = value
					.split('.')
					.map(el => el.match(/[0-9]+/gi).join())

				let cipherObj = {
					block: '',
					part: '',
					module: '',
					discipline: '',
				}

				if (cipherArr.length >= 1) {
					cipherObj.block = cipherArr[0]

					if (cipherArr.length >= 2) {
						cipherObj.part = cipherArr[1]

						if (cipherArr.length >= 4) {
							cipherObj.module = cipherArr[2]
							cipherObj.discipline = cipherArr[3]
						}

						if (cipherArr.length === 3) {
							cipherObj.module = ''
							cipherObj.discipline = cipherArr[2]
						}
					}
				}

				this.cipherObj = cipherObj
				this.isValid = true
			} catch (e) {
				this.isValid = false
				console.log(e)
			}
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuCipherExpansion
    &__header
        display: flex
        align-items: center
        justify-content: space-between
        margin-right: 8px

    &__form
        & > *:not(:last-child)
            margin-bottom: 8px

    &__input
        .v-input__append-inner
            margin-top: 0 !important
            height: 52px
            display: flex
            align-items: center

    .fade-enter-active, .fade-leave-active
        transition: opacity .5s

    .fade-enter, .fade-leave-to
        opacity: 0
</style>
