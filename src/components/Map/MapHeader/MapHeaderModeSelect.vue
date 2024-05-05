<template>
	<MSelect
		:value="selectedMode"
		class="MapHeaderModeSelect"
		label="Режим"
		height="52"
		:items="mappedItems"
		item-value="key"
		item-text="value.title"
		:item-disabled="isDisabled"
		:return-object="true"
		@change="onChangeMode"
	/>
</template>

<script>
import { ModesEnum } from '@models/Maps'

import MSelect from '@components/common/MSelect.vue'

import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
import withEventEmitter from '@mixins/withEventEmitter'

import mapsService from '@services/Maps/MapsService'
import permissionService from '@services/auth/PermissionService'

export default {
	name: 'MapHeaderModeSelect',
	components: { MSelect },
	mixins: [withEventEmitter('mapsService', 'mapsServiceHandlers')],

	data() {
		return {
			mapsService,
			mapsServiceHandlers: {
				fetchAup: this.setModeByChangeAup,
			},
		}
	},

	computed: {
		...mapGetters('Map', ['isAuth', 'currentMode', 'modes']),

		mappedItems() {
			return Object.values(
				_.map(this.modes, (mode, key) => ({
					value: mode,
					key,
				})),
			)
		},

		selectedMode() {
			return this.currentMode
		},
	},

	methods: {
		...mapMutations('Map', ['setMode']),

		onChangeMode(item) {
			this.setMode(item.key)
		},

		isDisabled(item) {
			return !permissionService.canSelectMode(item.value, mapsService.aupCode)
		},

		/* Дергаем после того как выбрали другую карту
           Если есть права на редактирование, то по умолчанию режим КД, а
           иначе режим просмотра
        */
		setModeByChangeAup() {
			if (permissionService.canEditAup(this.mapsService.aupCode)) {
				if (this.currentMode !== ModesEnum.View) return

				return this.setMode(ModesEnum.Map)
			}

			this.setMode(ModesEnum.View)
		},
	},
}
</script>

<style lang="sass">
.MapHeaderYearSelect
    // Фикс непонятного бага со стрелочкой у селекта
    .v-input__append-inner
        margin-top: 14px !important
</style>
