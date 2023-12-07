<template>
	<v-expansion-panel class="MapRightMenuExpansion">
		<v-expansion-panel-header class="MapRightMenuExpansion__header">
			<slot name="header" />
		</v-expansion-panel-header>

		<v-expansion-panel-content class="MapRightMenuExpansion__content">
			<slot />
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
export default {
	name: 'MapRightMenuExpansion',
}
</script>

<style lang="sass" scoped>
.MapRightMenuExpansion
    .v-expansion-panel-header
        min-height: 64px
        border-bottom: 1px solid #333

    &__content
        padding-top: 16px
</style>
