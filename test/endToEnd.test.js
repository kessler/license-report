const cp = require('child_process')
const util = require('util')
const path = require('path')
const assert = require('assert')
const fs = require('fs')
const eol = require('eol')
const expectedOutput = require('./fixture/expectedOutput.js')

const scriptPath = path
	.resolve(__dirname, '..', 'index.js')
	.replace(/(\s+)/g, '\\$1')

// test data for e2e test using the default fields
const defaultFieldsPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'default-fields', 'package.json')
	.replace(/(\s+)/g, '\\$1')
const defaultFieldsPackageLockJsonPath = path
	.resolve(__dirname, 'fixture', 'default-fields', 'package-lock.json')
	.replace(/(\s+)/g, '\\$1')	
const defaultFieldsPackageJson = require(defaultFieldsPackageJsonPath)
const defaultFieldsPackageLockJson = require(defaultFieldsPackageLockJsonPath)

// test data for e2e test using all fields
const allFieldsPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'all-supported-fields', 'package.json')
	.replace(/(\s+)/g, '\\$1')	
const allFieldsPackageLockJsonPath = path
	.resolve(__dirname, 'fixture', 'all-supported-fields', 'package-lock.json')
	.replace(/(\s+)/g, '\\$1')	
const allFieldsPackageJson = require(allFieldsPackageJsonPath)
const allFieldsPackageLockJson = require(allFieldsPackageLockJsonPath)
const allFieldsConfigPath = path
	.resolve(__dirname, 'fixture', 'all-supported-fields', 'license-report-config.json')
	.replace(/(\s+)/g, '\\$1')

// test data for e2e test using the default fields and local packages
const localPackagesPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'local-packages', 'package.json')
	.replace(/(\s+)/g, '\\$1')
const localPackagesPackageLockJsonPath = path
	.resolve(__dirname, 'fixture', 'local-packages', 'package-lock.json')
	.replace(/(\s+)/g, '\\$1')
const localPackagesPackageJson = require(localPackagesPackageJsonPath)
const localPackagesPackageLockJson = require(localPackagesPackageLockJsonPath)
const localPackagesConfigPath = path
	.resolve(__dirname, 'fixture', 'local-packages', 'license-report-config.json')
	.replace(/(\s+)/g, '\\$1')

const execAsPromise = util.promisify(cp.exec)

let expectedData

describe('end to end test', function() {
	this.timeout(50000)

	beforeEach(async  () => {
		expectedData = EXPECTED_DEFAULT_FIELDS_RAW_DATA.slice(0)
		await expectedOutput.addInstalledAndRemoteVersionsToExpectedData(expectedData, defaultFieldsPackageJson, defaultFieldsPackageLockJson)
  })

	it('produce a json report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath}`)
		const result = JSON.parse(stdout)
		const expectedJsonResult = expectedOutput.rawDataToJson(expectedData)

		assert.deepStrictEqual(result, expectedJsonResult)
	})

	it('produce a table report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --output=table`)
		const expectedTableResult = expectedOutput.rawDataToTable(expectedData, EXPECTED_TABLE_TEMPLATE)

		assert.strictEqual(stdout, expectedTableResult)
	})

	it('produce a csv report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --output=csv --csvHeaders`)
		const expectedCsvResult = expectedOutput.rawDataToCsv(expectedData, EXPECTED_CSV_TEMPLATE)

		assert.strictEqual(stdout, expectedCsvResult)
	})

	it('produce an html report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --output=html`)
		const actualResult = eol.auto(stdout)
		const expectedHtmlTemplate = eol.auto(fs.readFileSync(path.join(__dirname, 'fixture', 'expectedOutput.e2e.html'), 'utf8'))
		const expectedHtmlResult = expectedOutput.rawDataToHtml(expectedData, expectedHtmlTemplate)

		assert.strictEqual(actualResult, expectedHtmlResult)
	})
})

describe('end to end test for local packages', function() {
	this.timeout(50000)

	beforeEach(async  () => {
		expectedData = EXPECTED_LOCAL_PACKAGES_RAW_DATA.slice(0)
		await expectedOutput.addInstalledAndRemoteVersionsToExpectedData(expectedData, localPackagesPackageJson, localPackagesPackageLockJson)
  })

	it('produce a json report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${localPackagesPackageJsonPath} --config=${localPackagesConfigPath}`)
		const result = JSON.parse(stdout)
		const expectedJsonResult = expectedOutput.rawDataToJson(expectedData)

		assert.deepStrictEqual(result, expectedJsonResult)
	})
})

describe('end to end test for configuration', function () {
	this.timeout(50000)

	it('produce a json report with the fields specified in config', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${allFieldsPackageJsonPath} --config=${allFieldsConfigPath}`)
		const result = JSON.parse(stdout)
		const expectedResult = [{
			department: "kessler",
			relatedTo: "stuff",
			name: "semver",
			licensePeriod: "perpetual",
			material: "material",
			licenseType: "ISC",
			link: "git+https://github.com/npm/node-semver.git",
			remoteVersion: "5.7.1",
			installedVersion: "6.3.0",
			definedVersion: "^5.0.0",
			author:"GitHub Inc."
		}];
		await expectedOutput.addInstalledAndRemoteVersionsToExpectedData(expectedResult, allFieldsPackageJson, allFieldsPackageLockJson)

		assert.deepStrictEqual(result, expectedResult, `expected the output to contain all the configured fields`)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a json report without option "only"', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath}`)
		const result = JSON.parse(stdout)
		const expectedLengthOfResult = 4

		assert.strictEqual(result.length, expectedLengthOfResult, `expected the list to contain ${expectedLengthOfResult} elements`)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a json report with option "only=prod"', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --only=prod`)
		const result = JSON.parse(stdout)
		const expectedLengthOfResult = 1

		assert.strictEqual(result.length, expectedLengthOfResult, `expected the list to contain ${expectedLengthOfResult} elements`)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a json report with option "only=prod,opt,peer"', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --only=prod,opt,peer`)
		const result = JSON.parse(stdout)
		const expectedLengthOfResult = 3

		assert.strictEqual(result.length, expectedLengthOfResult, `expected the list to contain ${expectedLengthOfResult} elements`)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})
})

// raw data we use to generate the expected results for default fields test
const EXPECTED_DEFAULT_FIELDS_RAW_DATA = [
	{
		author: 'Dan VerWeire, Yaniv Kessler',
		department: 'kessler',
		relatedTo: 'stuff',
		name: '@kessler/tableify',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/kessler/node-tableify.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_',
		definedVersion: '^1.0.2'
	},
	{
		author: 'TJ Holowaychuk tj@vision-media.ca',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'mocha',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/mochajs/mocha.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_',
		definedVersion: '^9.1.1'
	},		
	{
		author: "John-David Dalton john.david.dalton@gmail.com",
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'lodash',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/lodash/lodash.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_',
		definedVersion: '^4.17.20'
	},	
	{
		author: 'GitHub Inc.',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'semver',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'ISC',
		link: 'git+https://github.com/npm/node-semver.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_',
		definedVersion: '^7.3.5'
	},	
]

// raw data we use to generate the expected results for default fields test
const EXPECTED_LOCAL_PACKAGES_RAW_DATA = [
	{
		author: 'n/a',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'async',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'n/a',
		link: 'n/a',
    installedFrom: "github:caolan/async",
		remoteVersion: 'n/a',
		installedVersion: 'n/a',
		definedVersion: 'n/a'
	},
	{
		author: 'GitHub Inc.',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'semver',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'ISC',
		link: 'git+https://github.com/npm/node-semver.git',
    installedFrom: "https://registry.npmjs.org/semver/-/semver-7.3.7.tgz",
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_',
		definedVersion: '^7.3.7'
	},
	{
		author: "n/a",
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'debug',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'n/a',
		link: 'n/a',
    installedFrom: "git://github.com/debug-js/debug.git",
		remoteVersion: 'n/a',
		installedVersion: 'n/a',
		definedVersion: 'n/a'
	},	
	{
		author: 'n/a',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'my-local-package',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'n/a',
		link: 'n/a',
    installedFrom: "file:local-libs/my-local-package",
		remoteVersion: 'n/a',
		installedVersion: 'n/a',
		definedVersion: 'n/a'
	},	
]

/*
	template for csv output; usage:
	{{key}} - value to be replaced with value from package information
	[[package-name]] - name of the package
*/
const EXPECTED_CSV_TEMPLATE = `department,related to,name,license period,material / not material,license type,link,remote version,installed version,defined version,author
{{department}},{{relatedTo}},[[@kessler/tableify]],{{licensePeriod}},{{material}},{{licenseType}},{{link}},{{remoteVersion}},{{installedVersion}},{{definedVersion}},{{author}}
{{department}},{{relatedTo}},[[mocha]],{{licensePeriod}},{{material}},{{licenseType}},{{link}},{{remoteVersion}},{{installedVersion}},{{definedVersion}},{{author}}
{{department}},{{relatedTo}},[[lodash]],{{licensePeriod}},{{material}},{{licenseType}},{{link}},{{remoteVersion}},{{installedVersion}},{{definedVersion}},{{author}}
{{department}},{{relatedTo}},[[semver]],{{licensePeriod}},{{material}},{{licenseType}},{{link}},{{remoteVersion}},{{installedVersion}},{{definedVersion}},{{author}}
`

/*
	template for csv output; usage:
	{{key}} - value to be replaced with value from package information
	[[package-name]] - name of the package
*/
const EXPECTED_TABLE_TEMPLATE = `{{department}}  {{relatedTo}}  {{name}}  {{licensePeriod}}  {{material}}  {{licenseType}}  {{link}}  {{remoteVersion}}  {{installedVersion}}  {{definedVersion}}  {{author}}
{{department}}  {{relatedTo}}  {{name}}  {{licensePeriod}}  {{material}}  {{licenseType}}  {{link}}  {{remoteVersion}}  {{installedVersion}}  {{definedVersion}}  {{author}}
{{department}}  {{relatedTo}}  [[@kessler/tableify]]  {{licensePeriod}}  {{material}}  {{licenseType}}  {{link}}  {{remoteVersion}}  {{installedVersion}}  {{definedVersion}}  {{author}}
{{department}}  {{relatedTo}}  [[mocha]]  {{licensePeriod}}  {{material}}  {{licenseType}}  {{link}}  {{remoteVersion}}  {{installedVersion}}  {{definedVersion}}  {{author}}
{{department}}  {{relatedTo}}  [[lodash]]  {{licensePeriod}}  {{material}}  {{licenseType}}  {{link}}  {{remoteVersion}}  {{installedVersion}}  {{definedVersion}}  {{author}}
{{department}}  {{relatedTo}}  [[semver]]  {{licensePeriod}}  {{material}}  {{licenseType}}  {{link}}  {{remoteVersion}}  {{installedVersion}}  {{definedVersion}}  {{author}}
`
