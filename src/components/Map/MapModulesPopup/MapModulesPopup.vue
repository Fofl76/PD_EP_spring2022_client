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

export default {
	name: 'MapModulesPopup',

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
	mounted() {
		Api.fetchModuleByAup(this.$route.query.aup).then(res => {
			if (!res.success) return

			this.modules = res.data
		})
	},
	computed: {
		filteredModules() {
			return this.modules.filter(module =>
				module.title.toLowerCase().includes(this.searchModel.toLowerCase())
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
	components: {
		MapModulesPopupList,
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
