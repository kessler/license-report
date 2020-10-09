var cp = require('child_process')
var path = require('path')
var assert = require('assert')

var scriptPath = path.resolve(__dirname, '..', 'index.js')

describe('end to end test', function() {
	it('produce a json report', function(done) {
		this.timeout(50000)

		cp.exec('node ' + scriptPath, function(err, stdout, stderr) {
			if (err) {
				console.error(stderr)
				return done(err)
			}

			var result = JSON.parse(stdout)
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
})

var EXPECTED_JSON_RESULT = [{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'async',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/caolan/async.git',
		comment: '3.2.0',
		installedVersion: '3.2.0'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'debug',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git://github.com/visionmedia/debug.git',
		comment: '4.3.0',
		installedVersion: '4.1.1'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'lodash',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/lodash/lodash.git',
		comment: '4.17.20',
		installedVersion: '4.17.15'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'rc',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: '(BSD-2-Clause OR MIT OR Apache-2.0)',
		link: 'git+https://github.com/dominictarr/rc.git',
		comment: '1.2.8',
		installedVersion: '1.2.8'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'request',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'Apache-2.0',
		link: 'git+https://github.com/request/request.git',
		comment: '2.88.2',
		installedVersion: '2.88.2'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'semver',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'ISC',
		link: 'git+https://github.com/npm/node-semver.git',
		comment: '7.3.2',
		installedVersion: '7.3.2'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'stubborn',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'ISC',
		link: 'git://github.com/grudzinski/stubborn.git',
		comment: '1.2.5',
		installedVersion: '1.2.5'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'text-table',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git://github.com/substack/text-table.git',
		comment: '0.2.0',
		installedVersion: '0.2.0'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'visit-values',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'https://github.com/kessler/node-visit-values',
		comment: '2.0.0',
		installedVersion: '2.0.0'
	},
	{
		comment: '2.0.1',
		installedVersion: '2.0.1',
		department: 'kessler',
		licensePeriod: 'perpetual',
		licenseType: 'MIT',
		link: 'https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz',
		material: 'material',
		name: '@kessler/exponential-backoff',
		relatedTo: 'stuff'
	},
	{
		comment: '8.1.3',
		department: 'kessler',
		installedVersion: '8.1.3',
		licensePeriod: 'perpetual',
		licenseType: 'MIT',
		link: 'git+https://github.com/mochajs/mocha.git',
		material: 'material',
		name: 'mocha',
		relatedTo: 'stuff'
	}
]

var EXPECTED_TABLE_RESULT = `department  related to  name                          license period  material / not material  license type                         link                                                                                     comment  installed version
----------  ----------  ----                          --------------  -----------------------  ------------                         ----                                                                                     -------  -----------------
kessler     stuff       async                         perpetual       material                 MIT                                  git+https://github.com/caolan/async.git                                                  3.2.0    3.2.0
kessler     stuff       debug                         perpetual       material                 MIT                                  git://github.com/visionmedia/debug.git                                                   4.3.0    4.1.1
kessler     stuff       lodash                        perpetual       material                 MIT                                  git+https://github.com/lodash/lodash.git                                                 4.17.20  4.17.15
kessler     stuff       rc                            perpetual       material                 (BSD-2-Clause OR MIT OR Apache-2.0)  git+https://github.com/dominictarr/rc.git                                                1.2.8    1.2.8
kessler     stuff       request                       perpetual       material                 Apache-2.0                           git+https://github.com/request/request.git                                               2.88.2   2.88.2
kessler     stuff       semver                        perpetual       material                 ISC                                  git+https://github.com/npm/node-semver.git                                               7.3.2    7.3.2
kessler     stuff       stubborn                      perpetual       material                 ISC                                  git://github.com/grudzinski/stubborn.git                                                 1.2.5    1.2.5
kessler     stuff       text-table                    perpetual       material                 MIT                                  git://github.com/substack/text-table.git                                                 0.2.0    0.2.0
kessler     stuff       visit-values                  perpetual       material                 MIT                                  https://github.com/kessler/node-visit-values                                             2.0.0    2.0.0
kessler     stuff       @kessler/exponential-backoff  perpetual       material                 MIT                                  https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz  2.0.1    2.0.1
kessler     stuff       mocha                         perpetual       material                 MIT                                  git+https://github.com/mochajs/mocha.git                                                 8.1.3    8.1.3
`;


var EXPECTED_CSV_RESULT = `department,relatedTo,name,licensePeriod,material,licenseType,link,comment,installedVersion
kessler,stuff,async,perpetual,material,MIT,git+https://github.com/caolan/async.git,3.2.0,3.2.0
kessler,stuff,debug,perpetual,material,MIT,git://github.com/visionmedia/debug.git,4.3.0,4.1.1
kessler,stuff,lodash,perpetual,material,MIT,git+https://github.com/lodash/lodash.git,4.17.20,4.17.15
kessler,stuff,rc,perpetual,material,(BSD-2-Clause OR MIT OR Apache-2.0),git+https://github.com/dominictarr/rc.git,1.2.8,1.2.8
kessler,stuff,request,perpetual,material,Apache-2.0,git+https://github.com/request/request.git,2.88.2,2.88.2
kessler,stuff,semver,perpetual,material,ISC,git+https://github.com/npm/node-semver.git,7.3.2,7.3.2
kessler,stuff,stubborn,perpetual,material,ISC,git://github.com/grudzinski/stubborn.git,1.2.5,1.2.5
kessler,stuff,text-table,perpetual,material,MIT,git://github.com/substack/text-table.git,0.2.0,0.2.0
kessler,stuff,visit-values,perpetual,material,MIT,https://github.com/kessler/node-visit-values,2.0.0,2.0.0
kessler,stuff,@kessler/exponential-backoff,perpetual,material,MIT,https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz,2.0.1,2.0.1
kessler,stuff,mocha,perpetual,material,MIT,git+https://github.com/mochajs/mocha.git,8.1.3,8.1.3
`;