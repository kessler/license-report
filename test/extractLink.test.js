import assert from 'node:assert';
import extractLink from '../lib/extractLink.js';

describe('extractLink', function() {
	it('extracts the repository link if its there', function() {
		const link = extractLink({ repository: { url: 'http://lala.com' }})
		assert.strictEqual(link, 'http://lala.com')
	})

	it('search for another http link if repo link is not there', function() {
		const link = extractLink({ url: 'http://lala.com' })
		assert.strictEqual(link, 'http://lala.com')
	})

	it('returns nothing otherwise', function() {
		const link = extractLink({ url: 'lala.com' })
		assert(!link)
	})
})