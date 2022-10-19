import assert from 'node:assert';
import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import util from 'node:util';
import eol from 'eol';
import expectedOutput from './fixture/expectedOutput.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const scriptPath = path
	.resolve(__dirname, '..', 'index.js')
	.replace(/(\s+)/g, '\\$1')

// test data for e2e test using the default fields
const defaultFieldsPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'default-fields', 'package.json')
	.replace(/(\s+)/g, '\\$1')

// test data for e2e test using the default fields in monorepo
const defaultFieldsMonorepoPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'monorepo', 'sub-project', 'sub-sub-project', 'package.json')
	.replace(/(\s+)/g, '\\$1')

// test data for e2e test using all fields
const allFieldsPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'all-fields', 'package.json')
	.replace(/(\s+)/g, '\\$1')
const allFieldsConfigPath = path
	.resolve(__dirname, 'fixture', 'all-fields', 'license-report-config.json')
	.replace(/(\s+)/g, '\\$1')

// test data for e2e test using the default fields and local packages
const localPackagesPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'local-packages', 'package.json')
	.replace(/(\s+)/g, '\\$1')
const localPackagesConfigPath = path
	.resolve(__dirname, 'fixture', 'local-packages', 'license-report-config.json')
	.replace(/(\s+)/g, '\\$1')

const execAsPromise = util.promisify(cp.exec)

let expectedData

describe('end to end test for default fields', function() {
	this.timeout(50000)
	this.slow(4000)

	beforeEach(async  () => {
		expectedData = EXPECTED_DEFAULT_FIELDS_RAW_DATA.slice(0)
		await expectedOutput.addRemoteVersionsToExpectedData(expectedData)
  })

	it('produce a json report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath}`)
		const result = JSON.parse(stdout)
		const expectedJsonResult = expectedOutput.rawDataToJson(expectedData)

		assert.deepStrictEqual(result, expectedJsonResult)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a table report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --output=table`)
		const expectedTableResult = expectedOutput.rawDataToTable(expectedData, EXPECTED_TABLE_TEMPLATE)

		assert.strictEqual(stdout, expectedTableResult)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a csv report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --output=csv --csvHeaders`)
		const expectedCsvResult = expectedOutput.rawDataToCsv(expectedData, EXPECTED_CSV_TEMPLATE)

		assert.strictEqual(stdout, expectedCsvResult)
		assert.strictEqual(stderr, 'Warning: field contains delimiter; value: \"Dan VerWeire, Yaniv Kessler\"\n')
	})

	it('produce an html report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --output=html`)
		const actualResult = eol.auto(stdout)
		const expectedHtmlTemplate = eol.auto(fs.readFileSync(path.join(__dirname, 'fixture', 'expectedOutput.e2e.html'), 'utf8'))
		const expectedHtmlResult = expectedOutput.rawDataToHtml(expectedData, expectedHtmlTemplate)

		assert.strictEqual(actualResult, expectedHtmlResult)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a markdown table report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsPackageJsonPath} --output=markdown`)
		const expectedMarkdownTableResult = expectedOutput.rawDataToMarkdown(expectedData, EXPECTED_MARKDOWN_TABLE_TEMPLATE)

		assert.strictEqual(stdout, expectedMarkdownTableResult)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})
})

describe('end to end test for default fields in monorepo', function() {
	this.timeout(50000)
	this.slow(4000)

	beforeEach(async  () => {
		expectedData = EXPECTED_DEFAULT_FIELDS_RAW_DATA.slice(0)
		await expectedOutput.addRemoteVersionsToExpectedData(expectedData)
  })

	it('produce a json report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsMonorepoPackageJsonPath}`)
		const result = JSON.parse(stdout)
		const expectedJsonResult = expectedOutput.rawDataToJson(expectedData)

		assert.deepStrictEqual(result, expectedJsonResult)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a table report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsMonorepoPackageJsonPath} --output=table`)
		const expectedTableResult = expectedOutput.rawDataToTable(expectedData, EXPECTED_TABLE_TEMPLATE)

		assert.strictEqual(stdout, expectedTableResult)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a csv report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsMonorepoPackageJsonPath} --output=csv --csvHeaders`)
		const expectedCsvResult = expectedOutput.rawDataToCsv(expectedData, EXPECTED_CSV_TEMPLATE)

		assert.strictEqual(stdout, expectedCsvResult)
		assert.strictEqual(stderr, 'Warning: field contains delimiter; value: \"Dan VerWeire, Yaniv Kessler\"\n')
	})

	it('produce an html report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsMonorepoPackageJsonPath} --output=html`)
		const actualResult = eol.auto(stdout)
		const expectedHtmlTemplate = eol.auto(fs.readFileSync(path.join(__dirname, 'fixture', 'expectedOutput.e2e.html'), 'utf8'))
		const expectedHtmlResult = expectedOutput.rawDataToHtml(expectedData, expectedHtmlTemplate)

		assert.strictEqual(actualResult, expectedHtmlResult)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})

	it('produce a markdown table report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${defaultFieldsMonorepoPackageJsonPath} --output=markdown`)
		const expectedMarkdownTableResult = expectedOutput.rawDataToMarkdown(expectedData, EXPECTED_MARKDOWN_TABLE_TEMPLATE)

		assert.strictEqual(stdout, expectedMarkdownTableResult)
		assert.strictEqual(stderr, '', 'expected no warnings')
	})
})

describe('end to end test for local packages', function() {
	this.timeout(50000)
	this.slow(4000)

	beforeEach(async  () => {
		expectedData = EXPECTED_LOCAL_PACKAGES_RAW_DATA.slice(0)
		await expectedOutput.addRemoteVersionsToExpectedData(expectedData)
  })

	it('produce a json report', async () => {
		const { stdout, stderr } = await execAsPromise(`node ${scriptPath} --package=${localPackagesPackageJsonPath} --config=${localPackagesConfigPath}`)
		const result = JSON.parse(stdout)
		const expectedJsonResult = expectedOutput.rawDataToJson(expectedData)

		assert.deepStrictEqual(result, expectedJsonResult)
	})
})

describe('end to end test for all fields', function() {
	this.timeout(50000)
	this.slow(4000)

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
			installedFrom: "https://registry.npmjs.org/semver/-/semver-5.4.1.tgz",
			remoteVersion: "5.7.1",
			latestRemoteVersion: '7.3.7',
			latestRemoteModified: '2022-07-25T16:10:58.611Z',
			installedVersion: "5.4.1",
			definedVersion: "^5.0.0",
			author:"GitHub Inc."
		}];
		await expectedOutput.addRemoteVersionsToExpectedData(expectedResult)

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
		installedVersion: '1.0.2',
		definedVersion: '^1.0.2'
	},
	{
		author: 'TJ Holowaychuk <tj@vision-media.ca>',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'mocha',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/mochajs/mocha.git',
		remoteVersion: '_VERSION_',
		installedVersion: '9.1.2',
		definedVersion: '^9.1.1'
	},		
	{
		author: "John-David Dalton <john.david.dalton@gmail.com>",
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'lodash',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/lodash/lodash.git',
		remoteVersion: '_VERSION_',
		installedVersion: '4.17.21',
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
		installedVersion: '7.3.7',
		definedVersion: '^7.3.5'
	},	
]

// raw data we use to generate the expected results for default fields test
const EXPECTED_LOCAL_PACKAGES_RAW_DATA = [
	{
		author: 'Caolan McMahon',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'async',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'n/a',
    installedFrom: "github:caolan/async",
		remoteVersion: '_VERSION_',
		installedVersion: '3.2.4',
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
    installedFrom: "https://registry.npmjs.org/semver/-/semver-7.3.6.tgz",
		remoteVersion: '_VERSION_',
		installedVersion: '7.3.6',
		definedVersion: '^7.3.0'
	},
	{
		author: 'Josh Junon <josh.junon@protonmail.com>',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'debug',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'n/a',
    installedFrom: "git://github.com/debug-js/debug.git",
		remoteVersion: '_VERSION_',
		installedVersion: '4.3.4',
		definedVersion: 'n/a'
	},	
	{
		author: 'John Doe',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'my-local-package',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'n/a',
    installedFrom: "file:local-libs/my-local-package",
		remoteVersion: '_VERSION_',
		installedVersion: '1.1.4',
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
	template for table output; usage:
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

/*
	template for markdown table output; usage:
	{{key}} - value to be replaced with value from package information
	[[package-name]] - name of the package
*/
const EXPECTED_MARKDOWN_TABLE_TEMPLATE = 
`| Department | Related to | Name              | License period | Material not material | License type | Link                                             | Remote version | Installed version | Defined version | Author                                          |
| :--------- | :--------- | :---------------- | :------------- | :-------------------- | :----------- | :----------------------------------------------- | :------------- | :---------------- | :-------------- | :---------------------------------------------- |
| {{department}}    | {{relatedTo}}      | [[@kessler/tableify]] | {{licensePeriod}}      | {{material}}              | {{licenseType}}          | {{link}} | {{remoteVersion}}          | {{installedVersion}}             | {{definedVersion}}          | {{author}}                     |
| {{department}}    | {{relatedTo}}      | [[mocha]]             | {{licensePeriod}}      | {{material}}              | {{licenseType}}          | {{link}}         | {{remoteVersion}}          | {{installedVersion}}             | {{definedVersion}}          | {{author}}             |
| {{department}}    | {{relatedTo}}      | [[lodash]]            | {{licensePeriod}}      | {{material}}              | {{licenseType}}          | {{link}}         | {{remoteVersion}}        | {{installedVersion}}           | {{definedVersion}}        | {{author}} |
| {{department}}    | {{relatedTo}}      | [[semver]]            | {{licensePeriod}}      | {{material}}              | {{licenseType}}          | {{link}}       | {{remoteVersion}}          | {{installedVersion}}             | {{definedVersion}}          | {{author}}                                     |

`
