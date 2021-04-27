const cp = require('child_process')
const path = require('path')
const _ = require('lodash')
const assert = require('assert')
const fs = require('fs')
const eol = require('eol')
const expectedOutput = require('./fixture/expectedOutput.js')

const scriptPath = path
	.resolve(__dirname, '..', 'index.js')
	.replace(/(\s+)/g, '\\$1');

var expectedData

describe('end to end test', function() {
	beforeEach(function(done) {
		expectedData = EXPECTED_RAW_DATA.slice(0)
		expectedOutput.addVersionToExpectedData(expectedData, done)
  });

	it('produce a json report', (done) => {
		this.timeout(50000)

		cp.exec('node ' + scriptPath, function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			const result = JSON.parse(stdout)
			const expectedJsonResult = expectedOutput.rawDataToJson(expectedData)

			assert.deepStrictEqual(result, expectedJsonResult)
			done()
		})
	})

	it('produce a table report', (done) => {
		this.timeout(50000)

		cp.exec('node ' + scriptPath + ' --output=table', function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			const expectedTableResult = expectedOutput.rawDataToTable(expectedData, EXPECTED_TABLE_TEMPLATE)

			assert.strictEqual(stdout, expectedTableResult)
			done()
		})
	})

	it('produce a csv report', (done) => {
		this.timeout(50000)

		cp.exec('node ' + scriptPath + ' --output=csv --csvHeaders', function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			const expectedCsvResult = expectedOutput.rawDataToCsv(expectedData, EXPECTED_CSV_TEMPLATE)

			assert.strictEqual(stdout, expectedCsvResult)
			done()
		})
	})

	it('produce an html report', (done) => {
		this.timeout(50000)

		cp.exec('node ' + scriptPath + ' --output=html', function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			const actualResult = eol.auto(stdout)
			const expectedHtmlTemplate = eol.auto(fs.readFileSync(path.join(__dirname, 'fixture', 'expectedOutput.html'), 'utf8'))
			const expectedHtmlResult = expectedOutput.rawDataToHtml(expectedData, expectedHtmlTemplate)

			assert.strictEqual(actualResult, expectedHtmlResult)
			done()
		})
	})
})

// raw data we use to generate the expected results
const EXPECTED_RAW_DATA = [
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
		installedVersion: '_VERSION_'
	},
	{
		author: 'Caolan McMahon',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'async',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/caolan/async.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
	{
		author: 'TJ Holowaychuk',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'debug',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git://github.com/visionmedia/debug.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
  {
    author: 'Ryan Van Etten',
    department: 'kessler',
    relatedTo: 'stuff',
    name: 'eol',
    licensePeriod: 'perpetual',
    material: 'material',
    licenseType: 'MIT',
    link: 'git+https://github.com/ryanve/eol.git',
    remoteVersion: '_VERSION_',
    installedVersion: '_VERSION_'
  },
	{
		author: 'John-David Dalton',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'lodash',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/lodash/lodash.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
	{
		author: 'Dominic Tarr',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'rc',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: '(BSD-2-Clause OR MIT OR Apache-2.0)',
		link: 'git+https://github.com/dominictarr/rc.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
	{
		author: 'Mikeal Rogers',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'request',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'Apache-2.0',
		link: 'git+https://github.com/request/request.git',
		remoteVersion: '_VERSION_2',
		installedVersion: '_VERSION_'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'semver',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'ISC',
		link: 'git+https://github.com/npm/node-semver.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
	{
		author: 'Roman Grudzinski',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'stubborn',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'ISC',
		link: 'git://github.com/grudzinski/stubborn.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
	{
		author: 'James Halliday',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'text-table',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git://github.com/substack/text-table.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
	{
		author: 'Yaniv Kessler',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'visit-values',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'https://github.com/kessler/node-visit-values',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
	{
		author: 'Yaniv Kessler',
		department: 'kessler',
		relatedTo: 'stuff',
		name: '@kessler/exponential-backoff',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	},
	{
		author: 'TJ Holowaychuk',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'mocha',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/mochajs/mocha.git',
		remoteVersion: '_VERSION_',
		installedVersion: '_VERSION_'
	}
]

/*
	template for csv output; usage:
	{{key}} - value to be replaced with value from package information
	[[package-name]] - name of the package
*/
const EXPECTED_CSV_TEMPLATE = `department,related to,name,license period,material / not material,license type,link,remote version,installed version,author
kessler,stuff,[[@kessler/tableify]],perpetual,material,MIT,git+https://github.com/kessler/node-tableify.git,{{remoteVersion}},{{installedVersion}},Dan VerWeire, Yaniv Kessler
kessler,stuff,[[async]],perpetual,material,MIT,git+https://github.com/caolan/async.git,{{remoteVersion}},{{installedVersion}},Caolan McMahon
kessler,stuff,[[debug]],perpetual,material,MIT,git://github.com/visionmedia/debug.git,{{remoteVersion}},{{installedVersion}},TJ Holowaychuk
kessler,stuff,[[eol]],perpetual,material,MIT,git+https://github.com/ryanve/eol.git,{{remoteVersion}},{{installedVersion}},Ryan Van Etten
kessler,stuff,[[lodash]],perpetual,material,MIT,git+https://github.com/lodash/lodash.git,{{remoteVersion}},{{installedVersion}},John-David Dalton
kessler,stuff,[[rc]],perpetual,material,(BSD-2-Clause OR MIT OR Apache-2.0),git+https://github.com/dominictarr/rc.git,{{remoteVersion}},{{installedVersion}},Dominic Tarr
kessler,stuff,[[request]],perpetual,material,Apache-2.0,git+https://github.com/request/request.git,{{remoteVersion}},{{installedVersion}},Mikeal Rogers
kessler,stuff,[[semver]],perpetual,material,ISC,git+https://github.com/npm/node-semver.git,{{remoteVersion}},{{installedVersion}},n/a
kessler,stuff,[[stubborn]],perpetual,material,ISC,git://github.com/grudzinski/stubborn.git,{{remoteVersion}},{{installedVersion}},Roman Grudzinski
kessler,stuff,[[text-table]],perpetual,material,MIT,git://github.com/substack/text-table.git,{{remoteVersion}},{{installedVersion}},James Halliday
kessler,stuff,[[visit-values]],perpetual,material,MIT,https://github.com/kessler/node-visit-values,{{remoteVersion}},{{installedVersion}},Yaniv Kessler
kessler,stuff,[[@kessler/exponential-backoff]],perpetual,material,MIT,https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz,{{remoteVersion}},{{installedVersion}},Yaniv Kessler
kessler,stuff,[[mocha]],perpetual,material,MIT,git+https://github.com/mochajs/mocha.git,{{remoteVersion}},{{installedVersion}},TJ Holowaychuk
`;

/*
	template for csv output; usage:
	{{key}} - value to be replaced with value from package information
	[[package-name]] - name of the package
*/
const EXPECTED_TABLE_TEMPLATE = `department  related to  name                          license period  material / not material  license type                         link                                                                                     remote version  installed version  author
----------  ----------  ----                          --------------  -----------------------  ------------                         ----                                                                                     --------------  -----------------  ------
kessler     stuff       [[@kessler/tableify]]             perpetual       material                 MIT                                  git+https://github.com/kessler/node-tableify.git                                         {{remoteVersion}}  {{installedVersion}}  Dan VerWeire, Yaniv Kessler
kessler     stuff       [[async]]                         perpetual       material                 MIT                                  git+https://github.com/caolan/async.git                                                  {{remoteVersion}}  {{installedVersion}}  Caolan McMahon
kessler     stuff       [[debug]]                         perpetual       material                 MIT                                  git://github.com/visionmedia/debug.git                                                   {{remoteVersion}}  {{installedVersion}}  TJ Holowaychuk
kessler     stuff       [[eol]]                           perpetual       material                 MIT                                  git+https://github.com/ryanve/eol.git                                                    {{remoteVersion}}  {{installedVersion}}  Ryan Van Etten
kessler     stuff       [[lodash]]                        perpetual       material                 MIT                                  git+https://github.com/lodash/lodash.git                                                 {{remoteVersion}}  {{installedVersion}}  John-David Dalton
kessler     stuff       [[rc]]                            perpetual       material                 (BSD-2-Clause OR MIT OR Apache-2.0)  git+https://github.com/dominictarr/rc.git                                                {{remoteVersion}}  {{installedVersion}}  Dominic Tarr
kessler     stuff       [[request]]                       perpetual       material                 Apache-2.0                           git+https://github.com/request/request.git                                               {{remoteVersion}}  {{installedVersion}}  Mikeal Rogers
kessler     stuff       [[semver]]                        perpetual       material                 ISC                                  git+https://github.com/npm/node-semver.git                                               {{remoteVersion}}  {{installedVersion}}  n/a
kessler     stuff       [[stubborn]]                      perpetual       material                 ISC                                  git://github.com/grudzinski/stubborn.git                                                 {{remoteVersion}}  {{installedVersion}}  Roman Grudzinski
kessler     stuff       [[text-table]]                    perpetual       material                 MIT                                  git://github.com/substack/text-table.git                                                 {{remoteVersion}}  {{installedVersion}}  James Halliday
kessler     stuff       [[visit-values]]                  perpetual       material                 MIT                                  https://github.com/kessler/node-visit-values                                             {{remoteVersion}}  {{installedVersion}}  Yaniv Kessler
kessler     stuff       [[@kessler/exponential-backoff]]  perpetual       material                 MIT                                  https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz  {{remoteVersion}}  {{installedVersion}}  Yaniv Kessler
kessler     stuff       [[mocha]]                         perpetual       material                 MIT                                  git+https://github.com/mochajs/mocha.git                                                 {{remoteVersion}}  {{installedVersion}}  TJ Holowaychuk
`;
