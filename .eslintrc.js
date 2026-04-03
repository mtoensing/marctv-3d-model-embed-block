module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	rules: {
		'import/no-unresolved': [
			'error',
			{
				ignore: [ '^@wordpress/' ],
			},
		],
		'import/no-extraneous-dependencies': [
			'error',
			{
				optionalDependencies: [ '@wordpress/*' ],
			},
		],
	},
};
