import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import path from 'path'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
	base: './',

	plugins: [
		createVuePlugin(),
		Components({
			resolvers: [
				// Vuetify
				VuetifyResolver(),
			],
		}),
	],
	server: {
		port: 8080,
	},
	resolve: {
		alias: [
			{
				find: '@components',
				replacement: path.resolve(__dirname, 'src/components'),
			},
			{
				find: '@services',
				replacement: path.resolve(__dirname, 'src/services'),
			},
			{
				find: '@utils',
				replacement: path.resolve(__dirname, 'src/services/utils'),
			},
			{
				find: '@api',
				replacement: path.resolve(__dirname, 'src/services/api'),
			},
			{
				find: '@models',
				replacement: path.resolve(__dirname, 'src/models'),
			},
			{
				find: '@mixins',
				replacement: path.resolve(__dirname, 'src/mixins'),
			},
			{
				find: '@assets',
				replacement: path.resolve(__dirname, 'src/assets'),
			},
			{
				find: '@styles',
				replacement: path.resolve(__dirname, 'src/styles'),
			},
		],
	},
	build: {
		chunkSizeWarningLimit: 600,
		cssCodeSplit: false,
	},
})
