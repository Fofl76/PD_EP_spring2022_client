const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
	transpileDependencies: ['vuetify'],

	configureWebpack: {
		resolve: {
			alias: {
				'@components': path.resolve(__dirname, 'src/components'),
				'@services': path.resolve(__dirname, 'src/services'),
				'@utils': path.resolve(__dirname, 'src/services/utils'),
				'@api': path.resolve(__dirname, 'src/services/api'),
				'@models': path.resolve(__dirname, 'src/models'),
				'@mixins': path.resolve(__dirname, 'src/mixins'),
			},
		},
	},
})
