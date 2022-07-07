import assert from 'node:assert';
import extractLicense from '../lib/extractLicense.js';

describe('extractLicense', function() {
	it('if it is a string', function() {
		const license = extractLicense({ license: '123' })
		assert.strictEqual(license, '123')
	})

	it('if it is an array', function() {
		const license = extractLicense({ licenses: [{ type: '123' }, { type: '456' }] })
		assert.strictEqual(license, '123, 456')
	})

	it('if it is an empty array', function() {
		const license = extractLicense({ licenses: [] })
		assert.strictEqual(license, 'n/a')
	})

	it('cannot extract for some reason', function() {
		const license = extractLicense('lkasdlkjsdlkj')
		assert.strictEqual(license, 'n/a')
	})
})