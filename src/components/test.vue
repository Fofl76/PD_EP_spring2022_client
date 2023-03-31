<template>
	<div>
		{{ mapsService }}
    <v-btn
      @click="deleteOn"
    >
      удалить on
    </v-btn>
    <v-btn
      @click="mapsService.emit('test', 'new test')"
    >
      вызов emit
    </v-btn> 
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import MapsService from '@services/Maps/MapsService'
import withEventEmmiter from '@mixins/withEventEmmiter'

export default Vue.extend({
	name: 'HomeView',
	components: {},
  mixins: [
    withEventEmmiter('mapsService', 'mapsServiceHandlers')
  ],
	data() {
		return {
			mapsService: MapsService,
      mapsServiceHandlers: {
        test: this.onUpdate,
      }
		}
	},
  methods: {
    onUpdate(e) {
      console.log(e);
    },
  },
})
</script>

<style></style>
