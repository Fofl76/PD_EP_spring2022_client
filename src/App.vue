<template>
	<v-app>
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: 'App',

	data: () => ({
		//
	}),
}
</script>

<style lang="sass">
html
    overflow-y: auto
</style>
