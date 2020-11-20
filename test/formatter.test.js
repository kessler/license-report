var assert = require('assert')
const config = require('../lib/config.js')
var getFormatter = require('../lib/getFormatter.js')

describe('formatter test', function() {

	it('produce a csv report with delimiter in field value', function() {
    const csvFormatter = getFormatter('csv')
    const csvResult = csvFormatter(csvWithDelimiterTestData, config)

		assert.strictEqual(csvResult, EXPECTED_CSV_RESULT_WITH_ESCAPE)
	})
})

const csvWithDelimiterTestData = [
  {
    department: 'kessler',
    relatedTo: 'stuff',
    name: '@kessler/tableify',
    licensePeriod: 'perpetual',
    material: 'material',
    licenseType: 'MIT',
    link: 'git+https://github.com/kessler/node-tableify.git',
    comment: '1.0.2',
    installedVersion: '1.0.2',
    author: 'Dan VerWeire, Yaniv Kessler'
  },
  {
    department: 'kessler',
    relatedTo: 'stuff',
    name: 'async',
    licensePeriod: 'perpetual',
    material: 'material',
    licenseType: 'MIT',
    link: 'git+https://github.com/caolan/async.git',
    comment: '3.2.0',
    installedVersion: '3.2.0',
    author: 'Caolan McMahon'
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
    installedVersion: '4.1.1',
    author: 'TJ Holowaychuk'
  }
]

const EXPECTED_CSV_RESULT_WITH_ESCAPE = `kessler,stuff,@kessler/tableify,perpetual,material,MIT,git+https://github.com/kessler/node-tableify.git,1.0.2,1.0.2,Dan VerWeire, Yaniv Kessler
kessler,stuff,async,perpetual,material,MIT,git+https://github.com/caolan/async.git,3.2.0,3.2.0,Caolan McMahon
kessler,stuff,debug,perpetual,material,MIT,git://github.com/visionmedia/debug.git,4.3.0,4.1.1,TJ Holowaychuk`;
