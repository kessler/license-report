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

describe('end to end test', function() {
	it.only('produce a json report', function(done) {
		this.timeout(50000)

		cp.exec('node ' + scriptPath, function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			const result = JSON.parse(stdout)

			assert.deepStrictEqual(result, EXPECTED_JSON_RESULT)
			done()
		})
	})

	it('produce a table report', function(done) {
		this.timeout(50000)

		cp.exec('node ' + scriptPath + ' --output=table', function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			assert.strictEqual(stdout, EXPECTED_TABLE_RESULT)
			done()
		})
	})

	it('produce a csv report', function(done) {
		this.timeout(50000)

		cp.exec('node ' + scriptPath + ' --output=csv --csvHeaders', function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			assert.strictEqual(stdout, EXPECTED_CSV_RESULT)
			done()
		})
	})

	it('produce an html report', function(done) {
		this.timeout(50000)

		cp.exec('node ' + scriptPath + ' --output=html', function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			const expectedResult = eol.auto(fs.readFileSync(path.join(__dirname, 'fixture', 'expectedOutput.html'), 'utf8'))
			const actualResult = eol.auto(stdout)
			assert.strictEqual(actualResult, expectedResult)
			done()
		})
	})
})

const EXPECTED_JSON_RESULT = expectedOutput.jsonUpdateVersions([{
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
])

const EXPECTED_TABLE_RESULT = `department  related to  name                          license period  material / not material  license type                         link                                                                                     remote version  installed version  author
----------  ----------  ----                          --------------  -----------------------  ------------                         ----                                                                                     --------------  -----------------  ------
kessler     stuff       @kessler/tableify             perpetual       material                 MIT                                  git+https://github.com/kessler/node-tableify.git                                         1.0.2           1.0.2              Dan VerWeire, Yaniv Kessler
kessler     stuff       async                         perpetual       material                 MIT                                  git+https://github.com/caolan/async.git                                                  3.2.0           3.2.0              Caolan McMahon
kessler     stuff       debug                         perpetual       material                 MIT                                  git://github.com/visionmedia/debug.git                                                   4.3.1           4.2.0              TJ Holowaychuk
kessler     stuff       eol                           perpetual       material                 MIT                                  git+https://github.com/ryanve/eol.git                                                    0.9.1           0.9.1              Ryan Van Etten
kessler     stuff       lodash                        perpetual       material                 MIT                                  git+https://github.com/lodash/lodash.git                                                 4.17.20         4.17.20            John-David Dalton
kessler     stuff       rc                            perpetual       material                 (BSD-2-Clause OR MIT OR Apache-2.0)  git+https://github.com/dominictarr/rc.git                                                1.2.8           1.2.8              Dominic Tarr
kessler     stuff       request                       perpetual       material                 Apache-2.0                           git+https://github.com/request/request.git                                               2.88.2          2.88.2             Mikeal Rogers
kessler     stuff       semver                        perpetual       material                 ISC                                  git+https://github.com/npm/node-semver.git                                               7.3.2           7.3.2              n/a
kessler     stuff       stubborn                      perpetual       material                 ISC                                  git://github.com/grudzinski/stubborn.git                                                 1.2.5           1.2.5              Roman Grudzinski
kessler     stuff       text-table                    perpetual       material                 MIT                                  git://github.com/substack/text-table.git                                                 0.2.0           0.2.0              James Halliday
kessler     stuff       visit-values                  perpetual       material                 MIT                                  https://github.com/kessler/node-visit-values                                             2.0.0           2.0.0              Yaniv Kessler
kessler     stuff       @kessler/exponential-backoff  perpetual       material                 MIT                                  https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz  2.0.1           2.0.1              Yaniv Kessler
kessler     stuff       mocha                         perpetual       material                 MIT                                  git+https://github.com/mochajs/mocha.git                                                 8.2.1           8.2.0              TJ Holowaychuk
`;

const EXPECTED_CSV_RESULT = `department,related to,name,license period,material / not material,license type,link,remote version,installed version,author
kessler,stuff,@kessler/tableify,perpetual,material,MIT,git+https://github.com/kessler/node-tableify.git,1.0.2,1.0.2,Dan VerWeire, Yaniv Kessler
kessler,stuff,async,perpetual,material,MIT,git+https://github.com/caolan/async.git,3.2.0,3.2.0,Caolan McMahon
kessler,stuff,debug,perpetual,material,MIT,git://github.com/visionmedia/debug.git,4.3.1,4.2.0,TJ Holowaychuk
kessler,stuff,eol,perpetual,material,MIT,git+https://github.com/ryanve/eol.git,0.9.1,0.9.1,Ryan Van Etten
kessler,stuff,lodash,perpetual,material,MIT,git+https://github.com/lodash/lodash.git,4.17.20,4.17.20,John-David Dalton
kessler,stuff,rc,perpetual,material,(BSD-2-Clause OR MIT OR Apache-2.0),git+https://github.com/dominictarr/rc.git,1.2.8,1.2.8,Dominic Tarr
kessler,stuff,request,perpetual,material,Apache-2.0,git+https://github.com/request/request.git,2.88.2,2.88.2,Mikeal Rogers
kessler,stuff,semver,perpetual,material,ISC,git+https://github.com/npm/node-semver.git,7.3.2,7.3.2,n/a
kessler,stuff,stubborn,perpetual,material,ISC,git://github.com/grudzinski/stubborn.git,1.2.5,1.2.5,Roman Grudzinski
kessler,stuff,text-table,perpetual,material,MIT,git://github.com/substack/text-table.git,0.2.0,0.2.0,James Halliday
kessler,stuff,visit-values,perpetual,material,MIT,https://github.com/kessler/node-visit-values,2.0.0,2.0.0,Yaniv Kessler
kessler,stuff,@kessler/exponential-backoff,perpetual,material,MIT,https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz,2.0.1,2.0.1,Yaniv Kessler
kessler,stuff,mocha,perpetual,material,MIT,git+https://github.com/mochajs/mocha.git,8.2.1,8.2.0,TJ Holowaychuk
`;