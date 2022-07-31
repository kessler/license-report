import assert from 'node:assert';

import nock from 'nock';

import config from '../lib/config.js';
import getPackageDataFromRepository from '../lib/getPackageDataFromRepository.js';

/**
 * Fetching data from the (private) repository gets mocked to get independent from
 * varying data on the server and from having a real private repository.
 */

describe('getPackageDataFromRepository without trailing slash in uri', function() {
	this.timeout(20000)

	let originalHttpRetryLimit
	let originalRegistryUri

	beforeEach(function() {
		originalHttpRetryLimit = config.httpRetryOptions.limit
		originalRegistryUri = config.registry
  })

  afterEach(function() {
		config.httpRetryOptions.limit = originalHttpRetryLimit
		config.registry = originalRegistryUri
  })

  it('gets the information about the package "semver" from server', async () => {
		const packageName = 'semver'

    const packageJson = await getPackageDataFromRepository('semver')

		assert.strictEqual(packageJson.name, packageName)
		assert.ok(packageJson.versions.hasOwnProperty('7.3.7'))
		assert.ok(packageJson.versions['7.3.7'].hasOwnProperty('dist'))
		assert.ok(packageJson.versions['7.3.7']['dist'].hasOwnProperty('tarball'))
		assert.ok(packageJson.versions['7.3.7'].hasOwnProperty('repository'))
		assert.ok(packageJson.versions['7.3.7']['repository'].hasOwnProperty('url'))
  })
})

describe('getPackageDataFromRepository', function() {
	this.timeout(20000)

	let originalHttpRetryLimit

	beforeEach(function() {
		originalHttpRetryLimit = config.httpRetryOptions.limit
  })

  afterEach(function() {
		config.httpRetryOptions.limit = originalHttpRetryLimit
		nock.cleanAll()
  })

  it('gets the information about the package "semver" from server', async () => {
		const packageName = 'semver'

		// Mock the npm private repository response
		config.httpRetryOptions.limit = 1
		const scope = nock(config.registry, {"encodedQueryParams":true})
	  .get(`/${packageName}`)
	  .reply(200, responses.semver)

    const packageJson = await getPackageDataFromRepository('semver')

		assert.strictEqual(packageJson.name, packageName)
		assert.ok(packageJson.versions.hasOwnProperty('7.3.7'))
		assert.ok(packageJson.versions['7.3.7'].hasOwnProperty('dist'))
		assert.ok(packageJson.versions['7.3.7']['dist'].hasOwnProperty('tarball'))
		assert.ok(packageJson.versions['7.3.7'].hasOwnProperty('repository'))
		assert.ok(packageJson.versions['7.3.7']['repository'].hasOwnProperty('url'))
		assert.ok(scope.isDone())
  })

  it('gets empty object for non existing package', async () => {
    const packageJson = await getPackageDataFromRepository('packagedoesnotexist')
    assert.deepEqual(packageJson, {})
  })
})

describe('getPackageDataFromRepository with private repository', function() {
	this.timeout(20000)

	let originalConfigRegistry
	let originalConfigNpmTokenEnvVar
	let originalHttpRetryLimit

	beforeEach(function() {
		originalConfigRegistry = config.registry
		originalConfigNpmTokenEnvVar = config.npmTokenEnvVar
		originalHttpRetryLimit = config.httpRetryOptions.limit
  })

  afterEach(function() {
		config.registry = originalConfigRegistry
		config.npmTokenEnvVar = originalConfigNpmTokenEnvVar
		config.httpRetryOptions.limit = originalHttpRetryLimit
		nock.cleanAll()
  })

	it('gets npm token via environment variable given in config file', function() {
		const envVarName = 'TEST_NPM_TOKEN_LR'
		const testToken = Math.random().toString(36).substring(2)
		config.npmTokenEnvVar = envVarName
		process.env[envVarName] = testToken

		const npmTokenFromConfig = process.env[config.npmTokenEnvVar] || ''

		assert.strictEqual(npmTokenFromConfig, testToken)
	})

	it('gets data from repository without authorization', async () => {
		const packageName = 'async'

		// Mock the config for accessing a npm private repository
		const npmRegistryHost = 'my.private.registry.com'
		const npmRegistry = `https://${npmRegistryHost}/`
		config.registry = npmRegistry
		process.env['NPM_TOKEN'] = ''
		config.httpRetryOptions.limit = 1

		// Mock the npm private repository response
		const scope = nock(npmRegistry, {"encodedQueryParams":true})
	  .get(`/${packageName}`)
	  .reply(200, responses.async)

		const packageReportData = await getPackageDataFromRepository(packageName)

		assert.strictEqual(packageReportData.name, packageName)
		assert.ok(packageReportData.versions.hasOwnProperty('3.2.0'))
		assert.ok(packageReportData.versions['3.2.0'].hasOwnProperty('dist'))
		assert.ok(packageReportData.versions['3.2.0']['dist'].hasOwnProperty('tarball'))
		assert.ok(packageReportData.versions['3.2.0'].hasOwnProperty('repository'))
		assert.ok(packageReportData.versions['3.2.0']['repository'].hasOwnProperty('url'))
		assert.ok(scope.isDone())
	})

	it('gets data from repository with authorization', async () => {
		const packageName = 'async'

		// Mock the config for accessing a npm private repository
		const npmRegistryHost = 'my.private.registry.com'
		const npmRegistry = `https://${npmRegistryHost}/`
		const npmToken = 'pp6j6gzcge'
		config.registry = npmRegistry
		process.env['NPM_TOKEN'] = npmToken
		config.httpRetryOptions.limit = 1

		// Mock the npm private repository response
		const scope = nock(npmRegistry, {"encodedQueryParams":true})
	  .matchHeader("host", npmRegistryHost)
	  .matchHeader("authorization", `Bearer ${npmToken}`)
	  .get(`/${packageName}`)
	  .reply(200, responses.async)

		const packageReportData = await getPackageDataFromRepository('async')

		assert.strictEqual(packageReportData.name, packageName)
		assert.ok(packageReportData.versions.hasOwnProperty('3.2.0'))
		assert.ok(packageReportData.versions['3.2.0'].hasOwnProperty('dist'))
		assert.ok(packageReportData.versions['3.2.0']['dist'].hasOwnProperty('tarball'))
		assert.ok(packageReportData.versions['3.2.0'].hasOwnProperty('repository'))
		assert.ok(packageReportData.versions['3.2.0']['repository'].hasOwnProperty('url'))
		assert.ok(scope.isDone())
	})

	it('throws error when using incorrect authorization', async () => {
		const packageName = 'async'

		// Mock the config for accessing a npm private repository
		const npmRegistryHost = 'my.private.registry.com'
		const npmRegistry = `https://${npmRegistryHost}/`
		const npmToken = 'pp6j6gzcge'
		config.registry = npmRegistry
		process.env['NPM_TOKEN'] = npmToken
		config.httpRetryOptions.limit = 1

		// Mock the npm private repository response
		const scope = nock(npmRegistry, {"encodedQueryParams":true})
	  .matchHeader("host", npmRegistryHost)
	  .matchHeader("authorization", `Bearer ${npmToken}`)
	  .get(`/${packageName}`)
	  .reply(401, {})

		try {
			await getPackageDataFromRepository('async')
		} catch (error) {
			assert.strictEqual(error.name, 'HTTPError')
			assert.strictEqual(error.message, 'Response code 401 (Unauthorized)')
		} finally {
			assert.ok(scope.isDone())
		}
	})
})

const responses = {
	async: {
		name: "async",
		description: "Higher-order functions and common patterns for asynchronous code",
		versions: {
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
		},
	},
  semver: {
    name: "semver",
    description: "The semantic version parser used by npm.",
    versions: {
      "7.3.6": {
        name: "semver",
        version: "7.3.6",
        description: "The semantic version parser used by npm.",
        repository: {
          type: "git",
          url: "git+https://github.com/npm/node-semver.git",
        },
        dist: {
          tarball: "https://registry.npmjs.org/semver/-/semver-7.3.6.tgz",
          fileCount: 51,
          unpackedSize: 87319,
        },
      },
      "7.3.7": {
        name: "semver",
        version: "7.3.7",
        description: "The semantic version parser used by npm.",
        repository: {
          type: "git",
          url: "git+https://github.com/npm/node-semver.git",
        },
        dist: {
          tarball: "https://registry.npmjs.org/semver/-/semver-7.3.7.tgz",
          fileCount: 51,
          unpackedSize: 87418,
        },
      },
    },
  }
}