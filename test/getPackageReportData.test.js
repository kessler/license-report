const assert = require('assert')
const getPackageReportData = require('../lib/getPackageReportData.js')

/**
 * No asserts on (valid) remote versions (and field comment) in the tests,
 * as the value changes over time and we would have to update the tests,
 * when new versions of a package get available
 */
describe('getPackageReportData', function() {
	this.timeout(20000)

	it('gets the package report data for package with author string (name)', async () => {
		const installedVersions = { '@babel/cli': '7.17.3' }
		const packageEntry = { name: '@babel/cli', fullName: '@babel/cli', version: '^7.17.0' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, '@babel/cli')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, 'The Babel Team (https://babel.dev/team)')
		assert.strictEqual(packageReportData.link, 'https://github.com/babel/babel.git')
	})

	it('gets the package report data for package with author string (email)', async () => {
		const installedVersions = { 'react-hook-form': '7.27.0' }
		const packageEntry = { name: 'react-hook-form', fullName: 'react-hook-form', version: '^7.27.0' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, 'react-hook-form')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, 'bluebill1049@hotmail.com')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/react-hook-form/react-hook-form.git')
	})

	it('gets the package report data for package with author object (name)', async () => {
		const installedVersions = { async: '3.2.0' }
		const packageEntry = { name: 'async', fullName: 'async', version: '>0.0.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, 'Caolan McMahon')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/caolan/async.git')
	})

	it('gets the package report data for package with author object (name, email, url)', async () => {
		const installedVersions = { 'text-table': '0.2.0' }
		const packageEntry = { name: 'text-table', fullName: 'text-table', version: '0.2.0' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, 'text-table')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, 'James Halliday mail@substack.net http://substack.net')
		assert.strictEqual(packageReportData.link, 'git://github.com/substack/text-table.git')
	})

	it('gets the package report data for package without author field', async () => {
		const installedVersions = { 'got': '11.8.2' }
		const packageEntry = { name: 'got', fullName: 'got', version: '^11.8.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, 'got')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, '')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/sindresorhus/got.git')
	})

	it('gets the scoped package report data', async () => {
		const installedVersions = { '@kessler/tableify': '1.0.2' }
		const packageEntry = { fullName: '@kessler/tableify', name: 'tableify', version: '^1.0.1', scope: 'kessler', alias: '@kessler/tableify_1.0.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, '@kessler/tableify')
		assert.strictEqual(packageReportData.author, 'Dan VerWeire, Yaniv Kessler')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/kessler/node-tableify.git')
		assert.strictEqual(packageReportData.definedVersion, '^1.0.1', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '1.0.2', 'installedVersion')
	})

	it('returns version as message when semver is invalid', async () => {
		const installedVersions = { async: '3.2.0' }
		const packageEntry = { name: 'async', fullName: 'async', version: 'a.b.c' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.remoteVersion, "no matching version found in registry for package 'async@a.b.c'")
	})

	it('returns version as message when no version satisfies condition', async () => {
		const installedVersions = { async: '3.2.0' }
		const packageEntry = { name: 'async', fullName: 'async', version: '0.0.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.remoteVersion, "no matching version found in registry for package 'async@0.0.1'")
})

	it('returns only author name', async () => {
		const installedVersions = { 'google-auth-library': '7.0.2' }
		const packageEntry = { name: 'google-auth-library', fullName: 'google-auth-library', version: '7.0.2' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.author, 'Google Inc.')
	})

	it('returns only author email', async () => {
		const installedVersions = { 'react-hook-form': '6.15.1' }
		const packageEntry = { name: 'react-hook-form', fullName: 'react-hook-form', version: '6.15.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.author, 'bluebill1049@hotmail.com')
	})

	it('returns author name with url', async () => {
		const installedVersions = { knex: '0.21.17' }
		const packageEntry = { name: 'knex', fullName: 'knex', version: '0.21.17' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.author, 'Tim Griesser https://github.com/tgriesser')
	})

	it('returns author name with email',async () => {
		const installedVersions = { typeorm: '0.2.31' }
		const packageEntry = { name: 'typeorm', fullName: 'typeorm', version: '0.2.31' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.author, 'Umed Khudoiberdiev pleerock.me@gmail.com')
	})

	it('gets report data for package with prebuild version', async () => {
		const installedVersions = { ol: '6.5.1-dev.1622493276948' }
		const packageEntry = { name: 'ol', fullName: 'ol', version: 'dev' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, 'ol')
		assert.strictEqual(packageReportData.author, '')
		assert.strictEqual(packageReportData.licenseType, 'BSD-2-Clause')
		assert.strictEqual(packageReportData.link, 'git://github.com/openlayers/openlayers.git')
		assert.strictEqual(packageReportData.definedVersion, 'dev', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '6.5.1-dev.1622493276948', 'installedVersion')
	})

	it('gets report data for package with nightly version', async () => {
		const installedVersions = { '@parcel/optimizer-cssnano': '2.0.0-nightly.662' }
		const packageEntry = { name: 'optimizer-cssnano', fullName: '@parcel/optimizer-cssnano', scope: 'parcel', version: 'nightly' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, '@parcel/optimizer-cssnano')
		assert.strictEqual(packageReportData.author, '')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/parcel-bundler/parcel.git')
		assert.strictEqual(packageReportData.definedVersion, 'nightly', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '2.0.0-nightly.662', 'installedVersion')
	})

	it('gets report data for package with alias name', async () => {
		const installedVersions = { 'mocha_8.3.1': 'npm:mocha@8.4.0' }
		const packageEntry = { name: 'mocha', fullName: 'mocha', version: '^8.3.1', alias: 'mocha_8.3.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedVersions)

		assert.strictEqual(packageReportData.name, 'mocha')
		assert.strictEqual(packageReportData.author, 'TJ Holowaychuk tj@vision-media.ca')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/mochajs/mocha.git')
		assert.strictEqual(packageReportData.definedVersion, '^8.3.1', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '8.3.1', 'installedVersion')
	});
})