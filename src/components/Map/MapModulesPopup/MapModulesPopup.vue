<template>
	<v-dialog v-model="_value" max-width="1000" class="PopupModules">
		<v-card class="PopupModules__card">
			<v-card-title class="text-h5">Модули</v-card-title>

			<v-card-text class="PopupModules__content">
				<v-text-field
					v-model="searchModel"
					label="Поиск Модулей"
					outlined
					dense
					hide-details="auto"
				></v-text-field>

				<MapModulesPopupList :modules="filteredModules" />
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import MapModulesPopupList from './MapModulesPopupList.vue'
import Api from '@services/api/Api'

import mapsService from '@services/Maps/MapsService'

export default {
	name: 'MapModulesPopup',
	components: {
		MapModulesPopupList,
	},

	props: {
		value: {
			type: Boolean,
		},
	},
	data() {
		return {
			modules: [],
			searchModel: '',
		}
	},
	computed: {
		filteredModules() {
			return this.modules.filter(module =>
				module.title.toLowerCase().includes(this.searchModel.toLowerCase()),
			)
		},
		_value: {
			get() {
				return this.value
			},
			set(v) {
				this.$emit('input', v)
			},
		},
	},
	mounted() {
		Api.fetchModuleByAup(mapsService.aupCode).then(res => {
			if (!res.success) return

			this.modules = res.data
		})
	},
}
</script>

<style lang="scss">
.PopupModules {
	&__content {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}
</style>
