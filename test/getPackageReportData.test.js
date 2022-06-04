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
		const installedPackagesData = { '@babel/cli': { version: '7.17.3' } }
		const packageEntry = { name: '@babel/cli', fullName: '@babel/cli', version: '^7.17.0' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, '@babel/cli')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, 'The Babel Team (https://babel.dev/team)')
		assert.strictEqual(packageReportData.link, 'https://github.com/babel/babel.git')
	})

	it('gets the package report data for package with author string (email)', async () => {
		const installedPackagesData = { 'react-hook-form': { version: '7.27.0' } }
		const packageEntry = { name: 'react-hook-form', fullName: 'react-hook-form', version: '^7.27.0' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'react-hook-form')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, 'bluebill1049@hotmail.com')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/react-hook-form/react-hook-form.git')
	})

	it('gets the package report data for package with author object (name)', async () => {
		const installedPackagesData = { async: { version: '3.2.0' } }
		const packageEntry = { name: 'async', fullName: 'async', version: '>0.0.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, 'Caolan McMahon')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/caolan/async.git')
	})

	it('gets the package report data for package with author object (name, email, url)', async () => {
		const installedPackagesData = { 'text-table': { version: '0.2.0' } }
		const packageEntry = { name: 'text-table', fullName: 'text-table', version: '0.2.0' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'text-table')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, 'James Halliday mail@substack.net http://substack.net')
		assert.strictEqual(packageReportData.link, 'git://github.com/substack/text-table.git')
	})

	it('gets the package report data for package without author field', async () => {
		const installedPackagesData = { 'got': { version: '11.8.2' } }
		const packageEntry = { name: 'got', fullName: 'got', version: '^11.8.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'got')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.author, '')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/sindresorhus/got.git')
	})

	it('gets the scoped package report data', async () => {
		const installedPackagesData = { '@kessler/tableify': { version: '1.0.2' } }
		const packageEntry = { fullName: '@kessler/tableify', name: 'tableify', version: '^1.0.1', scope: 'kessler', alias: '@kessler/tableify_1.0.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, '@kessler/tableify')
		assert.strictEqual(packageReportData.author, 'Dan VerWeire, Yaniv Kessler')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/kessler/node-tableify.git')
		assert.strictEqual(packageReportData.definedVersion, '^1.0.1', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '1.0.2', 'installedVersion')
	})

	it('returns version as message when semver is invalid', async () => {
		const installedPackagesData = { async: { version: '3.2.0' } }
		const packageEntry = { name: 'async', fullName: 'async', version: 'a.b.c' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.remoteVersion, "no matching version found in registry for package 'async@a.b.c'")
	})

	it('returns version as message when no version satisfies condition', async () => {
		const installedPackagesData = { async: { version: '3.2.0' } }
		const packageEntry = { name: 'async', fullName: 'async', version: '0.0.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.remoteVersion, "no matching version found in registry for package 'async@0.0.1'")
})

	it('returns only author name', async () => {
		const installedPackagesData = { 'google-auth-library': { version: '7.0.2' } }
		const packageEntry = { name: 'google-auth-library', fullName: 'google-auth-library', version: '7.0.2' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.author, 'Google Inc.')
	})

	it('returns only author email', async () => {
		const installedPackagesData = { 'react-hook-form': { version: '6.15.1' } }
		const packageEntry = { name: 'react-hook-form', fullName: 'react-hook-form', version: '6.15.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.author, 'bluebill1049@hotmail.com')
	})

	it('returns author name with url', async () => {
		const installedPackagesData = { knex: { version: '0.21.17' } }
		const packageEntry = { name: 'knex', fullName: 'knex', version: '0.21.17' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.author, 'Tim Griesser https://github.com/tgriesser')
	})

	it('returns author name with email',async () => {
		const installedPackagesData = { typeorm: { version: '0.2.31' } }
		const packageEntry = { name: 'typeorm', fullName: 'typeorm', version: '0.2.31' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.author, 'Umed Khudoiberdiev pleerock.me@gmail.com')
	})

	it('gets report data for package with prebuild version', async () => {
		const installedPackagesData = { ol: { version:  '6.5.1-dev.1622493276948' } }
		const packageEntry = { name: 'ol', fullName: 'ol', version: 'dev' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'ol')
		assert.strictEqual(packageReportData.author, '')
		assert.strictEqual(packageReportData.licenseType, 'BSD-2-Clause')
		assert.strictEqual(packageReportData.link, 'git://github.com/openlayers/openlayers.git')
		assert.strictEqual(packageReportData.definedVersion, 'dev', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '6.5.1-dev.1622493276948', 'installedVersion')
	})

	it('gets report data for package with nightly version', async () => {
		const installedPackagesData = { '@parcel/optimizer-cssnano': { version: '2.0.0-nightly.662' } }
		const packageEntry = { name: 'optimizer-cssnano', fullName: '@parcel/optimizer-cssnano', scope: 'parcel', version: 'nightly' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, '@parcel/optimizer-cssnano')
		assert.strictEqual(packageReportData.author, '')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/parcel-bundler/parcel.git')
		assert.strictEqual(packageReportData.definedVersion, 'nightly', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '2.0.0-nightly.662', 'installedVersion')
	})

	it('gets report data for package with alias name', async () => {
		const installedPackagesData = { 'mocha_8.3.1': { version: 'npm:mocha@8.4.0' } }
		const packageEntry = { name: 'mocha', fullName: 'mocha', version: '^8.3.1', alias: 'mocha_8.3.1' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'mocha')
		assert.strictEqual(packageReportData.author, 'TJ Holowaychuk tj@vision-media.ca')
		assert.strictEqual(packageReportData.licenseType, 'MIT')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/mochajs/mocha.git')
		assert.strictEqual(packageReportData.definedVersion, '^8.3.1', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '8.3.1', 'installedVersion')
	})

	it('gets report data for package with installed from', async () => {
		const installedPackagesData = { '@angular/core': { version: '13.3.0', installedFrom: 'https://registry.npmjs.org/@angular/core/-/core-13.3.0.tgz' } }
		const packageEntry = { name: '@angular/core', fullName: '@angular/core', version: '^13.0.0' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, '@angular/core')
		assert.strictEqual(packageReportData.definedVersion, '^13.0.0', 'definedVersion')
		assert.strictEqual(packageReportData.installedVersion, '13.3.0', 'installedVersion')
		assert.strictEqual(packageReportData.installedFrom, 'https://registry.npmjs.org/@angular/core/-/core-13.3.0.tgz', 'installedFrom')
	})

	it('gets report data for local package using "file:"', async () => {
		const installedPackagesData = { 'my-local-package': { version: 'file:local-libs/my-local-package' } }
		const packageEntry = { fullName: 'my-local-package', name: 'my-local-package', version: 'file:local-libs/my-local-package', scope: undefined, alias: '' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'my-local-package')
		assert.strictEqual(packageReportData.author, 'n/a')
		assert.strictEqual(packageReportData.licenseType, 'n/a')
		assert.strictEqual(packageReportData.link, 'n/a')
		assert.strictEqual(packageReportData.installedFrom, 'file:local-libs/my-local-package')
		assert.strictEqual(packageReportData.definedVersion, 'n/a')
		assert.strictEqual(packageReportData.installedVersion, 'n/a')
		assert.strictEqual(packageReportData.remoteVersion, 'n/a')
	})

	it('gets report data for local package using "git:"', async () => {
		const installedPackagesData = { 'debug': { version: 'git://github.com/debug-js/debug.git' } }
		const packageEntry = { fullName: 'debug', name: 'debug', version: 'git://github.com/debug-js/debug.git', scope: undefined, alias: '' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'debug')
		assert.strictEqual(packageReportData.author, 'n/a')
		assert.strictEqual(packageReportData.licenseType, 'n/a')
		assert.strictEqual(packageReportData.link, 'n/a')
		assert.strictEqual(packageReportData.installedFrom, 'git://github.com/debug-js/debug.git')
		assert.strictEqual(packageReportData.definedVersion, 'n/a')
		assert.strictEqual(packageReportData.installedVersion, 'n/a')
		assert.strictEqual(packageReportData.remoteVersion, 'n/a')
	})

	it('gets report data for local package using "github:"', async () => {
		const installedPackagesData = { 'async': { version: 'github:caolan/async' } }
		const packageEntry = { fullName: 'async', name: 'async', version: 'github:caolan/async', scope: undefined, alias: '' }
		const packageReportData = await getPackageReportData(packageEntry, installedPackagesData)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.author, 'n/a')
		assert.strictEqual(packageReportData.licenseType, 'n/a')
		assert.strictEqual(packageReportData.link, 'n/a')
		assert.strictEqual(packageReportData.installedFrom, 'github:caolan/async')
		assert.strictEqual(packageReportData.definedVersion, 'n/a')
		assert.strictEqual(packageReportData.installedVersion, 'n/a')
		assert.strictEqual(packageReportData.remoteVersion, 'n/a')
	})
})