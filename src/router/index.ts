import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Map from '../pages/Map.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Map',
		component: Map,
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
