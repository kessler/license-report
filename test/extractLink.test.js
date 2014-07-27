var assert = require('assert')
var extractLink = require('../lib/extractLink.js')

describe('extractLink', function () {
	it('extracts the repository link if its there', function () {
		var link = extractLink({ repository: { url: 'http://lala.com' }})
		assert.strictEqual(link, 'http://lala.com')
	})

	it('search for another http link if repo link isnt there', function () {
		var link = extractLink({ url: 'http://lala.com' })
		assert.strictEqual(link, 'http://lala.com')
	})

	it('search for another http link if repo link isnt there', function () {
		var link = extractLink({ repo: 'git://lala.com' })
		assert.strictEqual(link, 'git://lala.com')
	})

	it('returns nothing otherwise', function () {
		var link = extractLink({ url: 'lala.com' })
		assert(!link)
	})
})