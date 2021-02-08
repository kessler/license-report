const assert = require('assert')
const path = require('path')
const fs = require('fs')
const eol = require('eol')
const config = require('../lib/config.js')
const getFormatter = require('../lib/getFormatter.js')

describe('formatter for json', () => {
  it('produces a report', () => {
    const jsonFormatter = getFormatter('json')
    const jsonResult = jsonFormatter(testData, config)

		assert.strictEqual(jsonResult, EXPECTED_JSON_RESULT)
  })

  it('produces a report for an empty data array', () => {
    const jsonFormatter = getFormatter('json')
    const jsonResult = jsonFormatter([], config)

		assert.strictEqual(jsonResult, '[]')
  })
})

describe('formatter for table', () => {
  it('produces a report', () => {
    const tableFormatter = getFormatter('table')
    const tableResult = tableFormatter(testData, config)

		assert.strictEqual(tableResult, EXPECTED_TABLE_RESULT)
  })

  it('produces a report for an empty data array', () => {
    const tableFormatter = getFormatter('table')
    const tableResult = tableFormatter([], config)

		assert.strictEqual(tableResult, EXPECTED_TABLE_RESULT_EMPTY_DATA)
  })
})

describe('formatter for csv', function() {
  let csvHeadersBackup;

  beforeEach(function() {
    csvHeadersBackup = config.csvHeaders
  });

  afterEach(function() {
    config.csvHeaders = csvHeadersBackup;
  });

	it('produces a report without header', function() {
    const csvFormatter = getFormatter('csv')
    const csvResult = csvFormatter(testData, config)

		assert.strictEqual(csvResult, EXPECTED_CSV_RESULT)
	})

	it('produces a report with header', function() {
    config.csvHeaders = true
    const csvFormatter = getFormatter('csv')
    const csvResult = csvFormatter(testData, config)
    const csvExpectedResult = EXPECTED_CSV_HEADER + "\n" + EXPECTED_CSV_RESULT

		assert.strictEqual(csvResult, csvExpectedResult)
	})

	it('produces a report for data with delimiter in field value', function() {
    const csvFormatter = getFormatter('csv')
    const csvResult = csvFormatter(testDataWithCsvDelimiter, config)

		assert.strictEqual(csvResult, EXPECTED_CSV_RESULT_WITH_DELIMITER)
	})

  it('produces a report for an empty data array', function() {
    const csvFormatter = getFormatter('csv')
    const csvResult = csvFormatter([], config)
  
    assert.strictEqual(csvResult, '')
  })

  it('produces a report with header for an empty data array', function() {
    config.csvHeaders = true
    const csvFormatter = getFormatter('csv')
    const csvResult = csvFormatter([], config)
  
    assert.strictEqual(csvResult, EXPECTED_CSV_HEADER)
  })
})

describe('formatter for html', () => {
  it('produces a report', () => {
    const htmlFormatter = getFormatter('html')
    const htmlResult = eol.auto(htmlFormatter(testData, config))
    const expectedResult = eol.auto(fs.readFileSync(path.join(__dirname, 'expectedOutput.formatter.html'), 'utf8'))

		assert.strictEqual(htmlResult, expectedResult)
  })

  it('produces a report for an empty data array', () => {
    const htmlFormatter = getFormatter('html')
    const htmlResult = eol.auto(htmlFormatter([], config))
    const expectedResult = eol.auto(fs.readFileSync(path.join(__dirname, 'expectedOutput.formatter.empty.html'), 'utf8'))

		assert.strictEqual(htmlResult, expectedResult)
  })
})

const testData = [
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

const testDataWithCsvDelimiter = [
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

const EXPECTED_JSON_RESULT = '[{"department":"kessler","relatedTo":"stuff","name":"async","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"git+https://github.com/caolan/async.git","comment":"3.2.0","installedVersion":"3.2.0","author":"Caolan McMahon"},{"department":"kessler","relatedTo":"stuff","name":"debug","licensePeriod":"perpetual","material":"material","licenseType":"MIT","link":"git://github.com/visionmedia/debug.git","comment":"4.3.0","installedVersion":"4.1.1","author":"TJ Holowaychuk"}]'

const EXPECTED_TABLE_RESULT_EMPTY_DATA = `department  related to  name  license period  material / not material  license type  link  remote version  installed version  author
----------  ----------  ----  --------------  -----------------------  ------------  ----  --------------  -----------------  ------`

const EXPECTED_TABLE_RESULT = `department  related to  name   license period  material / not material  license type  link                                     remote version  installed version  author
----------  ----------  ----   --------------  -----------------------  ------------  ----                                     --------------  -----------------  ------
kessler     stuff       async  perpetual       material                 MIT           git+https://github.com/caolan/async.git  3.2.0           3.2.0              Caolan McMahon
kessler     stuff       debug  perpetual       material                 MIT           git://github.com/visionmedia/debug.git   4.3.0           4.1.1              TJ Holowaychuk`

const EXPECTED_CSV_HEADER = 'department,related to,name,license period,material / not material,license type,link,remote version,installed version,author'

const EXPECTED_CSV_RESULT = `kessler,stuff,async,perpetual,material,MIT,git+https://github.com/caolan/async.git,3.2.0,3.2.0,Caolan McMahon
kessler,stuff,debug,perpetual,material,MIT,git://github.com/visionmedia/debug.git,4.3.0,4.1.1,TJ Holowaychuk`

const EXPECTED_CSV_RESULT_WITH_DELIMITER = `kessler,stuff,@kessler/tableify,perpetual,material,MIT,git+https://github.com/kessler/node-tableify.git,1.0.2,1.0.2,Dan VerWeire, Yaniv Kessler
kessler,stuff,async,perpetual,material,MIT,git+https://github.com/caolan/async.git,3.2.0,3.2.0,Caolan McMahon
kessler,stuff,debug,perpetual,material,MIT,git://github.com/visionmedia/debug.git,4.3.0,4.1.1,TJ Holowaychuk`

const EXPECTED_HTML_RESULT = ''
