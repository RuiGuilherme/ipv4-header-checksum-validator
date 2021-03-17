module.exports = {
	extends: ["airbnb", "prettier"],
	env: {
		browser: true,
		node: true,
		es2021: true,
	},
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
		__DEV__: "readonly",
	},
	parser: "@babel/eslint-parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: false,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["prettier"],
	rules: {
		"prettier/prettier": "error",
		"import/prefer-default-export": "off",
		"no-param-reassign": "off",
		"no-console": "off",
		"no-plusplus": "off",
		"import/no-unresolved": "off",
	},
};
