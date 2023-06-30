<template>
	<v-card class="PopupModulesList">
		<v-list class="PopupModulesList__list">
			<v-list-item v-for="m in modules" :key="m.id">
				{{ m.title }}
			</v-list-item>
		</v-list>
	</v-card>
</template>

<script>
export default {
	props: {
		modules: {
			type: Array,
			default: null,
		},
	},
}
</script>

<style lang="scss">
.PopupModulesList {
	&__list {
		height: 400px;
		overflow-y: scroll;
	}
}
</style>
