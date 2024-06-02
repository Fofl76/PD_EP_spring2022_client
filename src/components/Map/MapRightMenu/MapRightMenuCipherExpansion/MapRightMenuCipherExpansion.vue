<template>
	<MapRightMenuExpansion class="MapRightMenuCipherExpansion">
		<template #header>
			<div class="MapRightMenuCipherExpansion__header">
				<div class="MapRightMenuCipherExpansion__label">Шифр</div>

				<v-chip
					v-if="cipherLabel && isValid"
					:key="1"
					style="cursor: pointer"
					pill
					label
					:ripple="false"
				>
					{{ cipherLabel }}
				</v-chip>

				<v-chip
					v-if="!isValid"
					:key="2"
					color="red"
					style="cursor: pointer"
					text-color="white"
					pill
					label
				>
					Некорректно
				</v-chip>
			</div>
		</template>

		<div class="MapRightMenuCipherExpansion__content">
			<v-form
				ref="form"
				v-model="isValid"
				class="MapRightMenuCipherExpansion__form"
				@input="onInputError"
			>
				<v-text-field
					ref="block"
					v-model="cipherObj.block"
					:disabled="true"
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
					ref="part"
					v-model="cipherObj.part"
					:disabled="true"
					class="MapRightMenuCipherExpansion__input"
					label="Часть"
					type="number"
					:rules="[rules.required, rules.onlyPositiveInteger]"
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
					ref="module"
					v-model="cipherObj.module"
					:disabled="true"
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
					ref="discipline"
					v-model="cipherObj.discipline"
					:disabled="true"
					class="MapRightMenuCipherExpansion__input"
					label="Дисциплина"
					type="number"
					:rules="[rules.required, rules.onlyPositiveInteger]"
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
	</MapRightMenuExpansion>
</template>

<script>
import MapRightMenuExpansion from '@components/Map/MapRightMenu/common/MapRightMenuExpansion.vue'
import MHint from '@components/common/MHint.vue'

export default {
	name: 'MapRightMenuCipherExpansion',
	components: { MapRightMenuExpansion, MHint },

	props: {
		cipher: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			cipherObj: { ...this.cipher },

			isValid: true,

			rules: {
				required: value => !!value || 'Пожалуйста, заполните это поле.',
				onlyPositiveInteger: value => {
					if (value === null) return true

					if (isNaN(+value) || +value <= 0) {
						return 'Значение должно быть целым и положительным'
					}

					return true
				},
			},
		}
	},

	watch: {
		cipher(value) {
			this.cipherObj = { ...value }
		},
	},

	computed: {
		cipherLabel() {
			const values = Object.values(this.cipherObj)
			const filteredValues = values.filter(item => !!item)

			return filteredValues.length ? 'Б' + filteredValues.join('.') : null
		},
	},

	methods: {
		onInput() {
			/* На бек отправляется строчное значение, поэтому пока так */
			if (this.$refs['form'].validate())
				this.$emit('inputCipher', {
					cipherStr: this.cipherLabel,
					cipher: {
						...this.cipherObj,
						shifr: this.cipherLabel,
					},
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
