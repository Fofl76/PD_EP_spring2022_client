import Vue from 'vue'
import Vuex from 'vuex'

import Maps from './modules/Maps'
Vue.use(Vuex)

export default function () {
	const Store = new Vuex.Store({
		modules: {
			Maps,
		},
		strict: process.env.DEV,
	})

	if (module.hot) {
		module.hot.accept(['./modules/Maps'], () => {
			const newMaps = require('./modules/Maps').default

			Store.hotUpdate({
				modules: {
					Maps: newMaps,
				},
			})
		})
	}

	return Store
}
