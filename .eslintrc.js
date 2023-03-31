module.exports = {
	root: true,

	env: {
		node: true,
	},


	parserOptions: {
		parser: '@typescript-eslint/parser',
	},

	rules: {
	'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
	'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
	strict: 'off',
	'no-unused-vars': 'off',
	'vue/no-unused-components': 'off',
	'no-mixed-spaces-and-tabs': 'off',
},

	'extends': [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript'
	]
}
