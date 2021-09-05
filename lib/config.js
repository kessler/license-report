const rc = require('rc')
const path = require('path')

module.exports = rc('license-report', {

	/*
		possible outputs:

		json || table || csv || html
	*/
	output: 'json',

	/*
		if output is html
	*/
	html: {
		cssFile: path.resolve(__dirname, '..', 'defaultHtmlStyle.css'),

		// passed directly to tableify (see: https://github.com/kessler/node-tableify)
		tableify: {}
	},

	/*
		if output is csv
	*/
	delimiter: ',',

	/*
		escape fields containing delimiter character if output is csv
	*/
	escapeCsvFields: false,

	/*
		export deps or dev deps. falsy -> output everything
		possible values (as csv without whitespace):
		prod || dev || opt || peer
	*/
	only: null,

	/*
		npm registry url
	*/
	registry: 'https://registry.npmjs.org/',

	/*
		an array of package names that will be excluded from the report
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
		'remoteVersion',
		'installedVersion',
		'definedVersion',
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
	remoteVersion: {
		value: '',
		label: 'remote version'
	},
	installedVersion: {
		value: 'n/a',
		label: 'installed version'
	},
	definedVersion: {
		value: 'n/a',
		label: 'defined version'
	},
	author: {
		value: 'n/a',
		label: 'author'
	},
	comment: {
		value: '',
		label: 'comment'
	},
	httpRetryOptions: {
		maxAttempts: 5
	}
})