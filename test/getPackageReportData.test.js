var assert = require('assert')
var getPackageReportData = require('../lib/getPackageReportData.js')

describe('getPackageReportData', function() {
	this.timeout(20000)

	it('gets the package report data', function(done) {

		getPackageReportData({ name: 'async', fullName: 'async', version: '>0.0.1' }, function(err, data) {
			if (err) return done(err)

			assert.strictEqual(data.name, 'async')
			assert.strictEqual(data.licenseType, 'MIT')
			assert.strictEqual(data.link, 'git+https://github.com/caolan/async.git')

			done()
		})
	})

	it('returns an error entry when semver is invalid', function(done) {
		getPackageReportData({ name: 'async', fullName: 'async', version: 'a.b.c' }, function(err, data) {
			if (err) return done(err)

			assert.strictEqual(data.name, 'async')
			assert.strictEqual(data.remoteVersion, 'skipping async@a.b.c (invalid semversion)')
			done()
		})
	})

	it('returns an error when no versions satisfy the condition', function(done) {
		getPackageReportData({ name: 'async', fullName: 'async', version: '0.0.1' }, function(err, data) {
			assert(err.message.indexOf('cannot find a version that satisfies range') === 0)
			done()
		})
	})

	it('return only author name', function(done) {
		getPackageReportData({ name: 'google-auth-library', fullName: 'google-auth-library', version: '7.0.2' }, function(err, data) {
			if (err) return done(err)
			assert.strictEqual(data.author, 'Google Inc.')
			done()
		})
	})
	it('return only author email', function(done) {
		getPackageReportData({ name: 'react-hook-form', fullName: 'react-hook-form', version: '6.15.1' }, function(err, data) {
			if (err) return done(err)

			assert.strictEqual(data.author, 'bluebill1049@hotmail.com')
			done()
		})
	})

	it('return author name with url', function(done) {
		getPackageReportData({ name: 'knex', fullName: 'knex', version: '0.21.17' }, function(err, data) {
			if (err) return done(err)

			assert.strictEqual(data.author, 'Tim Griesser https://github.com/tgriesser')
			done()
		})
	})

	it('return author name with email', function(done) {
		getPackageReportData({ name: 'typeorm', fullName: 'typeorm', version: '0.2.31' }, function(err, data) {
			if (err) return done(err)

			assert.strictEqual(data.author, 'Umed Khudoiberdiev pleerock.me@gmail.com')
			done()
		})
	})
})