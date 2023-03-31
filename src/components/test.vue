<template>
	<div>
		{{ mapList }}
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import MapsService from '@services/Maps/MapsService'

export default Vue.extend({
	name: 'HomeView',
	components: {},
	data() {
		return {
			mapList: MapsService,
		}
	},
})
</script>

<style></style>
