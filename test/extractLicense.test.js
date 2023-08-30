import assert from 'node:assert';
import extractLicense from '../lib/extractLicense.js';

describe('extractLicense', () => {
	it('if it is a string', () => {
		const license = extractLicense({ license: '123' })
		assert.strictEqual(license, '123')
	})

	it('if it is an array', () => {
		const license = extractLicense({ licenses: [{ type: '123' }, { type: '456' }] })
		assert.strictEqual(license, '123, 456')
	})

	it('if it is an empty array', () => {
		const license = extractLicense({ licenses: [] })
		assert.strictEqual(license, 'n/a')
	})

	it('cannot extract for some reason', () => {
		const license = extractLicense('lkasdlkjsdlkj')
		assert.strictEqual(license, 'n/a')
	})
})