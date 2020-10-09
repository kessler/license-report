var rc = require('rc')

var config = module.exports = rc('license-report', {

	/*
		possible outputs:

		json || table || csv
	*/
	output: 'json',

	/*
		if output is csv
	*/
	delimiter: ',',

	/*
		export deps or dev deps. falsey -> output everything
	*/
	only: null,

	/*
		npm registry url
	*/
	registry: 'https://registry.npmjs.org/',

	/*
		an array of package names that will be excluded from the  report
	*/
	exclude: [],

	/*
		fields participating in the report and their order
	*/
	fields: [
		'department',
		'relatedTo',
		'name',
		'licensePeriod',
		'material',
		'licenseType',
		'link',
		'comment',
		'installedVersion',
		'author'
	],

	department: {
		value: 'kessler',
		label: 'department'
	},
	relatedTo: {
		value: 'stuff',
		label: 'related to'
	},
	licensePeriod: {
		value: 'perpetual',
		label: 'license period'
	},
	material: {
		value: 'material',
		label: 'material / not material'
	},
	name: {
		value: '',
		label: 'name'
	},
	licenseType: {
		value: 'n/a',
		label: 'license type'
	},
	link: {
		value: 'n/a',
		label: 'link'
	},
	comment: {
		value: '',
		label: 'comment'
	},
	installedVersion: {
		value: 'n/a',
		label: 'installed version'
	},
	author: {
		value: 'n/a',
		label: 'author'
	},
	httpRetryOptions: {
		maxAttempts: 5,
		delay: 1000
	}
})