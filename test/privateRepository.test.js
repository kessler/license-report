const assert = require('assert')
const nock = require('nock')
const config = require('../lib/config')
const getPackageJson = require('../lib/getPackageJson')

/**
 * Fetching data from the private repository gets mocked to get independent from
 * having a real private repository.
 */
 describe('getPackageJson with private repository', function() {
	this.timeout(20000)

	let originalConfigRegistry
	let originalConfigNpmTokenEnvVar
	let originalHttpRetry

	beforeEach(function() {
		originalConfigRegistry = config.registry
		originalConfigNpmTokenEnvVar = config.npmTokenEnvVar
		originalHttpRetry = config.httpRetryOptions.maxAttempts
  })

  afterEach(function() {
		config.registry = originalConfigRegistry
		config.npmTokenEnvVar = originalConfigNpmTokenEnvVar
		config.httpRetryOptions.maxAttempts = originalHttpRetry
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
		config.httpRetryOptions.maxAttempts = 1

		// Mock the npm private repository response
		const scope = nock(npmRegistry, {"encodedQueryParams":true})
	  .get(`/${packageName}`)
	  .reply(200, responses.async)

		const packageReportData = await getPackageJson(packageName)

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
		config.httpRetryOptions.maxAttempts = 1

		// Mock the npm private repository response
		const scope = nock(npmRegistry, {"encodedQueryParams":true})
	  .matchHeader("host", npmRegistryHost)
	  .matchHeader("authorization", `Bearer ${npmToken}`)
	  .get(`/${packageName}`)
	  .reply(200, responses.async)

		const packageReportData = await getPackageJson('async')

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
		config.httpRetryOptions.maxAttempts = 1

		// Mock the npm private repository response
		const scope = nock(npmRegistry, {"encodedQueryParams":true})
	  .matchHeader("host", npmRegistryHost)
	  .matchHeader("authorization", `Bearer ${npmToken}`)
	  .get(`/${packageName}`)
	  .reply(401, {})

		try {
			await getPackageJson('async')
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
	}
}
