import assert from 'node:assert';
import nock from 'nock';
import config from '../lib/config.js';
import addPackageDataFromRepository from '../lib/addPackageDataFromRepository.js';

/**
 * Fetching data from the repository gets mocked to get independent from
 * the latest data on the repository.
 */
describe('addPackageDataFromRepository', function() {
	this.timeout(20000)

	let originalHttpRetryLimit

	beforeEach(function() {
		originalHttpRetryLimit = config.httpRetryOptions.limit
  })

  afterEach(function() {
		config.httpRetryOptions.limit = originalHttpRetryLimit
		nock.cleanAll()
  })

	it('gets the package report data for package', async () => {
		const packageEntry = {
			fullName: 'async',
			name: 'async',
			version: '^3.1.1',
			installedVersion: '3.2.0',
			licenseType: 'MIT',
			author: 'Caolan McMahon'
		}

		// Mock the npm repository response
		config.httpRetryOptions.limit = 1
		const scope = nock(config.registry, {"encodedQueryParams":true})
	  .get(`/${packageEntry.fullName}`)
	  .reply(200, responses[packageEntry.fullName])

		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.remoteVersion, '3.2.2')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/caolan/async.git')
		assert.strictEqual(packageReportData.installedFrom, 'https://registry.npmjs.org/async/-/async-3.2.0.tgz')
		assert.ok(scope.isDone())
	})

	it('gets the scoped package report data', async () => {
		const packageEntry = {
			fullName: '@kessler/tableify',
			name: 'tableify',
			version: '^1.0.1',
			scope: 'kessler',
			alias: '@kessler/tableify_1.0.1',
			installedVersion: '1.0.2',
			licenseType: 'MIT',
			author: 'Dan VerWeire, Yaniv Kessler'
		}

		// Mock the npm repository response
		config.httpRetryOptions.limit = 1
		const scope = nock(config.registry, {"encodedQueryParams":true})
	  .get(`/${packageEntry.fullName}`)
	  .reply(200, responses[packageEntry.fullName])

		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, '@kessler/tableify')
		assert.strictEqual(packageReportData.remoteVersion, '1.0.2')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/kessler/node-tableify.git')
		assert.strictEqual(packageReportData.installedFrom, 'https://registry.npmjs.org/@kessler/tableify/-/tableify-1.0.2.tgz')
		assert.ok(scope.isDone())
	})

	it('returns message in remoteVersion when version is invalid', async () => {
		const packageEntry = {
			fullName: 'async',
			name: 'async',
			version: 'a.b.c',
			installedVersion: '3.2.0',
			licenseType: 'MIT',
			author: 'Caolan McMahon'
		}

		// Mock the npm repository response
		config.httpRetryOptions.limit = 1
		const scope = nock(config.registry, {"encodedQueryParams":true})
	  .get(`/${packageEntry.fullName}`)
	  .reply(200, responses[packageEntry.fullName])

		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.remoteVersion, "no matching version found in registry for package 'async@a.b.c'")
		assert.strictEqual(packageReportData.link, 'n/a')
		assert.strictEqual(packageReportData.installedFrom, 'https://registry.npmjs.org/async/-/async-3.2.0.tgz')
		assert.ok(scope.isDone())
	})

	it('returns message in remoteVersion when version does not exist on repository', async () => {
		const packageEntry = {
			fullName: 'async',
			name: 'async',
			version: '0.0.1',
			installedVersion: '3.2.0',
			licenseType: 'MIT',
			author: 'Caolan McMahon'
		}

		// Mock the npm repository response
		config.httpRetryOptions.limit = 1
		const scope = nock(config.registry, {"encodedQueryParams":true})
	  .get(`/${packageEntry.fullName}`)
	  .reply(200, responses[packageEntry.fullName])

		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.remoteVersion, "no matching version found in registry for package 'async@0.0.1'")
		assert.strictEqual(packageReportData.link, 'n/a')
		assert.strictEqual(packageReportData.installedFrom, 'https://registry.npmjs.org/async/-/async-3.2.0.tgz')
		assert.ok(scope.isDone())
	})

	it('gets report data for package with prebuild version', async () => {
		const packageEntry = {
			fullName: 'ol',
			name: 'ol',
			version: 'dev',
			installedVersion:  '6.5.1-dev.1622493276948',
			licenseType: 'BSD-2-Clause',
			author: 'n/a'
		}

		// Mock the npm repository response
		config.httpRetryOptions.limit = 1
		const scope = nock(config.registry, {"encodedQueryParams":true})
	  .get(`/${packageEntry.fullName}`)
	  .reply(200, responses[packageEntry.fullName])

		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, 'ol')
		assert.strictEqual(packageReportData.remoteVersion, '6.14.2-dev.1656800207214')
		assert.strictEqual(packageReportData.link, 'git://github.com/openlayers/openlayers.git')
		assert.strictEqual(packageReportData.installedFrom, 'https://registry.npmjs.org/ol/-/ol-6.5.1-dev.1622493276948.tgz')
		assert.ok(scope.isDone())
	})

	it('gets report data for package with nightly version', async () => {
		const packageEntry = {
			fullName: '@parcel/optimizer-cssnano',
			name: 'optimizer-cssnano',
			scope: 'parcel',
			version: 'nightly',
			installedVersion: '2.0.0-nightly.662',
			licenseType: 'MIT',
			author: 'n/a'
		}

		// Mock the npm repository response
		config.httpRetryOptions.limit = 1
		const scope = nock(config.registry, {"encodedQueryParams":true})
	  .get(`/${packageEntry.fullName}`)
	  .reply(200, responses[packageEntry.fullName])

		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, '@parcel/optimizer-cssnano')
		assert.strictEqual(packageReportData.remoteVersion, '2.0.0-nightly.1135')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/parcel-bundler/parcel.git')
		assert.strictEqual(packageReportData.installedFrom, 'https://registry.npmjs.org/@parcel/optimizer-cssnano/-/optimizer-cssnano-2.0.0-nightly.662.tgz')
		assert.ok(scope.isDone())
	})

	it('gets report data for package with alias name', async () => {
		const packageEntry = {
			fullName: 'mocha',
			name: 'mocha',
			version: '^8.3.1',
			alias: 'mocha_8.3.1',
			installedVersion: '8.3.1',
			licenseType: 'MIT',
			author: 'TJ Holowaychuk tj@vision-media.ca'
		}

		// Mock the npm repository response
		config.httpRetryOptions.limit = 1
		const scope = nock(config.registry, {"encodedQueryParams":true})
	  .get(`/${packageEntry.fullName}`)
	  .reply(200, responses[packageEntry.fullName])

		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, 'mocha')
		assert.strictEqual(packageReportData.remoteVersion, '8.4.0')
		assert.strictEqual(packageReportData.link, 'git+https://github.com/mochajs/mocha.git')
		assert.strictEqual(packageReportData.installedFrom, 'https://registry.npmjs.org/mocha/-/mocha-8.3.1.tgz')
		assert.ok(scope.isDone())
	})

	it('gets report data for local package using "file:"', async () => {
		const packageEntry = {
			fullName: 'my-local-package',
			name: 'my-local-package',
			version: 'file:local-libs/my-local-package',
			alias: '',
			installedVersion: '1.2.3',
			licenseType: 'n/a',
			author: 'n/a'
		}
		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, 'my-local-package')
		assert.strictEqual(packageReportData.remoteVersion, 'n/a')
		assert.strictEqual(packageReportData.link, 'n/a')
		assert.strictEqual(packageReportData.installedFrom, 'file:local-libs/my-local-package')
	})

	it('gets report data for local package using "git:"', async () => {
		const packageEntry = {
			fullName: 'debug',
			name: 'debug',
			version: 'git://github.com/debug-js/debug.git',
			alias: '',
			installedVersion: '3.4.5',
			licenseType: 'n/a',
			author: 'n/a'
		}
		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, 'debug')
		assert.strictEqual(packageReportData.remoteVersion, 'n/a')
		assert.strictEqual(packageReportData.link, 'n/a')
		assert.strictEqual(packageReportData.installedFrom, 'git://github.com/debug-js/debug.git')
	})

	it('gets report data for local package using "github:"', async () => {
		const packageEntry = {
			fullName: 'async',
			name: 'async',
			version: 'github:caolan/async',
			alias: '',
			installedVersion: '5.6.7',
			licenseType: 'n/a',
			author: 'n/a'
		}
		const packageReportData = await addPackageDataFromRepository(packageEntry)

		assert.strictEqual(packageReportData.name, 'async')
		assert.strictEqual(packageReportData.remoteVersion, 'n/a')
		assert.strictEqual(packageReportData.link, 'n/a')
		assert.strictEqual(packageReportData.installedFrom, 'github:caolan/async')
	})
})

const responses = {
	async: {
		name: "async",
		description: "Higher-order functions and common patterns for asynchronous code",
		versions: {
			"3.1.1": {
				name: "async",
				description: "Higher-order functions and common patterns for asynchronous code",
				version: "3.1.1",
				repository: {
					type: "git",
					url: "git+https://github.com/caolan/async.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/async/-/async-3.1.1.tgz",
				},
			},
			"3.2.0": {
				name: "async",
				description: "Higher-order functions and common patterns for asynchronous code",
				version: "3.2.0",
				repository: {
					type: "git",
					url: "git+https://github.com/caolan/async.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/async/-/async-3.2.0.tgz",
				},
			},
			"3.2.1": {
				name: "async",
				description: "Higher-order functions and common patterns for asynchronous code",
				version: "3.2.1",
				repository: {
					type: "git",
					url: "git+https://github.com/caolan/async.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/async/-/async-3.2.1.tgz",
				},
			},
			"3.2.2": {
				name: "async",
				description: "Higher-order functions and common patterns for asynchronous code",
				version: "3.2.2",
				repository: {
					type: "git",
					url: "git+https://github.com/caolan/async.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/async/-/async-3.2.2.tgz",
				},
			},
		},
	},
	"@kessler/tableify": {
		name: "@kessler/tableify",
		versions: {
			"1.0.0": {
				name: "@kessler/tableify",
				private: false,
				version: "1.0.0",
				description: "Create HTML tables from Javascript Objects",
				repository: {
					type: "git",
					url: "git+https://github.com/wankdanker/node-tableify.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/@kessler/tableify/-/tableify-1.0.0.tgz",
					fileCount: 8,
					unpackedSize: 13396,
				},
			},
			"1.0.1": {
				name: "@kessler/tableify",
				private: false,
				version: "1.0.1",
				description: "Create HTML tables from Javascript Objects",
				repository: {
					type: "git",
					url: "git+https://github.com/kessler/node-tableify.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/@kessler/tableify/-/tableify-1.0.1.tgz",
					fileCount: 8,
					unpackedSize: 13387,
				},
			},
			"1.0.2": {
				name: "@kessler/tableify",
				private: false,
				version: "1.0.2",
				description: "Create HTML tables from Javascript Objects",
				repository: {
					type: "git",
					url: "git+https://github.com/kessler/node-tableify.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/@kessler/tableify/-/tableify-1.0.2.tgz",
					fileCount: 8,
					unpackedSize: 13353,
				},
			},
		},
	},
	ol: {
		name: "ol",
		description: "OpenLayers mapping library",
		"dist-tags": {
			latest: "6.14.1",
			dev: "6.14.2-dev.1656800207214",
		},
		versions: {
			"6.5.1-dev.1622493276948": {
				name: "ol",
				version: "6.5.1-dev.1622493276948",
				description: "OpenLayers mapping library",
				repository: {
					type: "git",
					url: "git://github.com/openlayers/openlayers.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/ol/-/ol-6.5.1-dev.1622493276948.tgz",
					fileCount: 993,
					unpackedSize: 7033249,
				},
			},
			"6.14.1": {
				name: "ol",
				version: "6.14.1",
				description: "OpenLayers mapping library",
				repository: {
					type: "git",
					url: "git://github.com/openlayers/openlayers.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/ol/-/ol-6.14.1.tgz",
					fileCount: 1706,
					unpackedSize: 9323815,
				},
			},
			"6.14.2-dev.1656620100371": {
				name: "ol",
				version: "6.14.2-dev.1656620100371",
				description: "OpenLayers mapping library",
				repository: {
					type: "git",
					url: "git://github.com/openlayers/openlayers.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/ol/-/ol-6.14.2-dev.1656620100371.tgz",
					fileCount: 1711,
					unpackedSize: 9395612,
				},
			},
			"6.14.2-dev.1656692026667": {
				name: "ol",
				version: "6.14.2-dev.1656692026667",
				description: "OpenLayers mapping library",
				repository: {
					type: "git",
					url: "git://github.com/openlayers/openlayers.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/ol/-/ol-6.14.2-dev.1656692026667.tgz",
					fileCount: 1711,
					unpackedSize: 9395909,
				},
			},
			"6.14.2-dev.1656800207214": {
				name: "ol",
				version: "6.14.2-dev.1656800207214",
				description: "OpenLayers mapping library",
				repository: {
					type: "git",
					url: "git://github.com/openlayers/openlayers.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/ol/-/ol-6.14.2-dev.1656800207214.tgz",
					fileCount: 1711,
					unpackedSize: 9397424,
				},
			},
		},
	},
	"@parcel/optimizer-cssnano": {
		name: "@parcel/optimizer-cssnano",
		"dist-tags": {
			latest: "2.6.2",
			nightly: "2.0.0-nightly.1135",
		},
		versions: {
			"2.6.2": {
				name: "@parcel/optimizer-cssnano",
				version: "2.6.2",
				repository: {
					type: "git",
					url: "git+https://github.com/parcel-bundler/parcel.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/@parcel/optimizer-cssnano/-/optimizer-cssnano-2.6.2.tgz",
					fileCount: 4,
					unpackedSize: 6475,
				},
			},
			"2.0.0-nightly.662": {
				name: "@parcel/optimizer-cssnano",
				version: "2.0.0-nightly.662",
				repository: {
					type: "git",
					url: "git+https://github.com/parcel-bundler/parcel.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/@parcel/optimizer-cssnano/-/optimizer-cssnano-2.0.0-nightly.662.tgz",
					fileCount: 4,
					unpackedSize: 5313,
				},
			},
			"2.0.0-nightly.1134": {
				name: "@parcel/optimizer-cssnano",
				version: "2.0.0-nightly.1134",
				repository: {
					type: "git",
					url: "git+https://github.com/parcel-bundler/parcel.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/@parcel/optimizer-cssnano/-/optimizer-cssnano-2.0.0-nightly.1134.tgz",
					fileCount: 4,
					unpackedSize: 6543,
				},
			},
			"2.0.0-nightly.1135": {
				name: "@parcel/optimizer-cssnano",
				version: "2.0.0-nightly.1135",
				repository: {
					type: "git",
					url: "git+https://github.com/parcel-bundler/parcel.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/@parcel/optimizer-cssnano/-/optimizer-cssnano-2.0.0-nightly.1135.tgz",
					fileCount: 4,
					unpackedSize: 6543,
				},
			},
		},
	},
	mocha: {
		name: "mocha",
		description: "simple, flexible, fun test framework",
		versions: {
			"2.6.2": {
				name: "@parcel/optimizer-cssnano",
				version: "2.6.2",
				repository: {
					type: "git",
					url: "git+https://github.com/parcel-bundler/parcel.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/@parcel/optimizer-cssnano/-/optimizer-cssnano-2.6.2.tgz",
					fileCount: 4,
					unpackedSize: 6475,
				},
			},
			"8.3.0": {
				name: "mocha",
				version: "8.3.0",
				description: "simple, flexible, fun test framework",
				repository: {
					type: "git",
					url: "git+https://github.com/mochajs/mocha.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/mocha/-/mocha-8.3.0.tgz",
					fileCount: 75,
					unpackedSize: 3072252,
				},
			},
			"8.3.1": {
				name: "mocha",
				version: "8.3.1",
				description: "simple, flexible, fun test framework",
				repository: {
					type: "git",
					url: "git+https://github.com/mochajs/mocha.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/mocha/-/mocha-8.3.1.tgz",
					fileCount: 75,
					unpackedSize: 3071677,
				},
			},
			"8.3.2": {
				name: "mocha",
				version: "8.3.2",
				description: "simple, flexible, fun test framework",
				repository: {
					type: "git",
					url: "git+https://github.com/mochajs/mocha.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/mocha/-/mocha-8.3.2.tgz",
					fileCount: 75,
					unpackedSize: 3072626,
				},
			},
			"8.4.0": {
				name: "mocha",
				version: "8.4.0",
				description: "simple, flexible, fun test framework",
				repository: {
					type: "git",
					url: "git+https://github.com/mochajs/mocha.git",
				},
				dist: {
					tarball: "https://registry.npmjs.org/mocha/-/mocha-8.4.0.tgz",
					fileCount: 75,
					unpackedSize: 3069049,
				},
			},
		},
	}
}