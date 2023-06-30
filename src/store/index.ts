import Vue from 'vue'
import Vuex from 'vuex'

import Map from './modules/Map'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		Map,
	},
})
