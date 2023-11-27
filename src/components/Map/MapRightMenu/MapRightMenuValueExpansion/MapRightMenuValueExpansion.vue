<template>
	<MapRightMenuExpansion class="MapRightMenuValueExpansion">
		<template #header>
			<div class="MapRightMenuValueExpansion__header">Настройка объема</div>
		</template>

		<template>
			<div class="MapRightMenuValueExpansion__content">
				<div class="MapRightMenuValueExpansion__values-wrapper">
					<MapRightMenuValueMainForm :values="values" />

					<v-divider dark class="MapRightMenu__divider" />

					1

					<v-divider dark class="MapRightMenu__divider" />

					2
				</div>
			</div>
		</template>
	</MapRightMenuExpansion>
</template>

<script>
import MapRightMenuExpansion from '../MapRightMenuExpansion.vue'
import MapRightMenuValueMainForm from './MapRightMenuValueMainForm.vue'

export default {
	name: 'MapRightMenuValueExpansion',
	components: { MapRightMenuExpansion, MapRightMenuValueMainForm },

	props: {
		values: {
			type: Array,
			default: () => [],
		},
	},
}
</script>

<style lang="sass"></style>
