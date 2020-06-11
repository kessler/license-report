var cp = require('child_process')
var path = require('path')
var _ = require('lodash')
var assert = require('assert')

var scriptPath = path
	.resolve(__dirname, '..', 'index.js')
	.replace(/(\s+)/g, '\\$1');

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
		author: 'Caolan McMahon',
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'async',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'MIT',
		link: 'git+https://github.com/caolan/async.git',
		comment: '0.9.2'
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
		comment: '3.2.6'
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
		comment: '4.17.15'
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
		comment: '1.2.8'
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
		comment: '2.88.2'
	},
	{
		department: 'kessler',
		relatedTo: 'stuff',
		name: 'semver',
		licensePeriod: 'perpetual',
		material: 'material',
		licenseType: 'ISC',
		link: 'git+https://github.com/npm/node-semver.git',
		comment: '5.7.1'
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
		comment: '1.2.5'
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
		comment: '0.2.0'
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
		comment: '1.0.4'
	},
	{
		author: 'Yaniv Kessler',
		comment: '2.0.1',
		department: 'kessler',
		licensePeriod: 'perpetual',
		licenseType: 'MIT',
		link: 'https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz',
		material: 'material',
		name: '@kessler/exponential-backoff',
		relatedTo: 'stuff'
	}
]

var EXPECTED_TABLE_RESULT = `department  related to  name                          license period  material / not material  license type                         link                                                                                     comment  author
----------  ----------  ----                          --------------  -----------------------  ------------                         ----                                                                                     -------  ------
kessler     stuff       async                         perpetual       material                 MIT                                  git+https://github.com/caolan/async.git                                                  0.9.2    Caolan McMahon
kessler     stuff       debug                         perpetual       material                 MIT                                  git://github.com/visionmedia/debug.git                                                   3.2.6    TJ Holowaychuk
kessler     stuff       lodash                        perpetual       material                 MIT                                  git+https://github.com/lodash/lodash.git                                                 4.17.15  John-David Dalton
kessler     stuff       rc                            perpetual       material                 (BSD-2-Clause OR MIT OR Apache-2.0)  git+https://github.com/dominictarr/rc.git                                                1.2.8    Dominic Tarr
kessler     stuff       request                       perpetual       material                 Apache-2.0                           git+https://github.com/request/request.git                                               2.88.2   Mikeal Rogers
kessler     stuff       semver                        perpetual       material                 ISC                                  git+https://github.com/npm/node-semver.git                                               5.7.1    n/a
kessler     stuff       stubborn                      perpetual       material                 ISC                                  git://github.com/grudzinski/stubborn.git                                                 1.2.5    Roman Grudzinski
kessler     stuff       text-table                    perpetual       material                 MIT                                  git://github.com/substack/text-table.git                                                 0.2.0    James Halliday
kessler     stuff       visit-values                  perpetual       material                 MIT                                  https://github.com/kessler/node-visit-values                                             1.0.4    Yaniv Kessler
kessler     stuff       @kessler/exponential-backoff  perpetual       material                 MIT                                  https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz  2.0.1    Yaniv Kessler\n`

var EXPECTED_CSV_RESULT = `department,relatedTo,name,licensePeriod,material,licenseType,link,comment,author
kessler,stuff,async,perpetual,material,MIT,git+https://github.com/caolan/async.git,0.9.2,Caolan McMahon
kessler,stuff,debug,perpetual,material,MIT,git://github.com/visionmedia/debug.git,3.2.6,TJ Holowaychuk
kessler,stuff,lodash,perpetual,material,MIT,git+https://github.com/lodash/lodash.git,4.17.15,John-David Dalton
kessler,stuff,rc,perpetual,material,(BSD-2-Clause OR MIT OR Apache-2.0),git+https://github.com/dominictarr/rc.git,1.2.8,Dominic Tarr
kessler,stuff,request,perpetual,material,Apache-2.0,git+https://github.com/request/request.git,2.88.2,Mikeal Rogers
kessler,stuff,semver,perpetual,material,ISC,git+https://github.com/npm/node-semver.git,5.7.1,n/a
kessler,stuff,stubborn,perpetual,material,ISC,git://github.com/grudzinski/stubborn.git,1.2.5,Roman Grudzinski
kessler,stuff,text-table,perpetual,material,MIT,git://github.com/substack/text-table.git,0.2.0,James Halliday
kessler,stuff,visit-values,perpetual,material,MIT,https://github.com/kessler/node-visit-values,1.0.4,Yaniv Kessler
kessler,stuff,@kessler/exponential-backoff,perpetual,material,MIT,https://registry.npmjs.org/@kessler/exponential-backoff/-/exponential-backoff-2.0.1.tgz,2.0.1,Yaniv Kessler\n`
