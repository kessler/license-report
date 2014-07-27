var assert = require('assert')
var extractLicense = require('../lib/extractLicense.js')

describe.only('extractLicense', function () {
	
	it('if its a string', function () {
		var license = extractLicense({ license: '123' })
		assert.strictEqual(license, '123')
	})

	it('if its an array', function () {
		var license = extractLicense({ licenses: [{ type: '123' }, { type: '456' }] })
		assert.strictEqual(license, '123, 456')
	})
	
	it('cannot extract for some reason', function () {
		var license = extractLicense('lkasdlkjsdlkj')
		assert(!license)
	})
})