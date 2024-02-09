import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import '@styles/main.sass'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import Api from '@services/api/Api'
import authService from '@services/auth/AuthService'

Vue.config.productionTip = false

Vue.use(Toast, {
	transition: 'Vue-Toastification__fade',
	maxToasts: 30,
	newestOnTop: true,
})

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
