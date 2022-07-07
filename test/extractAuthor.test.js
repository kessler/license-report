import assert from 'node:assert';
import extractAuthor from '../lib/extractAuthor.js';

describe('extractAuthor', function() {
	it('if its a string', function() {
		const author = extractAuthor({ author: 'John Doe' })

		assert.strictEqual(author, 'John Doe')
	})

	it('if its an object with name', function() {
		const packageJsonAuthor = { author: {
			name : 'Barney Rubble'
		} }
		const author = extractAuthor(packageJsonAuthor)

		assert.strictEqual(author, 'Barney Rubble')
	})

	it('if its an object with email', function() {
		const packageJsonAuthor = { author: {
			email : 'b@rubble.com'
		} }
		const author = extractAuthor(packageJsonAuthor)

		assert.strictEqual(author, 'b@rubble.com')
	})

	it('if its an object with name and email', function() {
		const packageJsonAuthor = { author: {
			name : 'Barney Rubble',
			email : 'b@rubble.com'
		} }
		const author = extractAuthor(packageJsonAuthor)

		assert.strictEqual(author, 'Barney Rubble b@rubble.com')
	})

	it('if its an object with name, email, url', function() {
		const packageJsonAuthor = { author: {
			name : 'Barney Rubble',
			email : 'b@rubble.com',
			url : 'http://barnyrubble.tumblr.com/'
		} }
		const author = extractAuthor(packageJsonAuthor)

		assert.strictEqual(author, 'Barney Rubble b@rubble.com http://barnyrubble.tumblr.com/')
	})
	
	it('if no author field is present', function() {
		const author = extractAuthor({})

		assert.strictEqual(author, 'n/a')
	})
})