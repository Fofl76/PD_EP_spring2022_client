import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MapPage from '../pages/MapPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		beforeEnter(to, from, next) {
			next('/map')
		},
	},
	{
		path: '/map',
		name: 'MapPage',
		component: MapPage,
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
