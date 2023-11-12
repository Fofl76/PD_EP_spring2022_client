import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Api from '@services/api/Api'
import authService from '@services/auth/AuthService'

Vue.config.productionTip = false

const setup = async () => {
	await Api.refresh()
	await authService.fetchLoggedUser()

	new Vue({
		router,
		store,
		vuetify,
		render: h => h(App),
	}).$mount('#app')
}

setup()
