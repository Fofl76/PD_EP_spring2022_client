<template>
	<v-card class="MapModulesPopupList">
		<v-list class="MapModulesPopupList__list">
			<template v-if="modules.length > 0">
				<v-list-item v-for="m in modules" :key="m.id">
					{{ m.title }}
				</v-list-item>
			</template>
			<div class="MapModulesPopupList__empty" v-else>
				<MDataPreloader light />
			</div>
		</v-list>
	</v-card>
</template>

<script>
import MDataPreloader from '@components/common/MDataPreloader.vue'

export default {
	name: 'MapModulesPopupList',
	components: {
		MDataPreloader,
	},
	props: {
		modules: {
			type: Array,
			default: null,
		},
	},
}
</script>

<style lang="scss">
.MapModulesPopupList {
	&__list {
		height: 400px;
		overflow-y: scroll;
	}

	&__empty {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
