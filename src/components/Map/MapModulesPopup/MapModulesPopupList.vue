<template>
	<v-card class="MapModulesPopupList">
		<v-list class="MapModulesPopupList__list">
			<v-list-item v-for="m in modules" :key="m.id">
				{{ m.title }}
			</v-list-item>
		</v-list>
	</v-card>
</template>

<script>
export default {
	name: 'MapModulesPopupList',
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
}
</style>
