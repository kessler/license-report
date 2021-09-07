const assert = require('assert')
const nock = require('nock');
const config = require('../lib/config')
const getPackageJson = require('../lib/getPackageJson')

describe('private repository access test', function() {
	this.timeout(20000)

	let originalConfigRegistry
	let originalConfigNpmTokenEnvVar
	let originalHttpRetry

	beforeEach(function() {
		originalConfigRegistry = config.registry
		originalConfigNpmTokenEnvVar = config.npmTokenEnvVar
		originalHttpRetry = config.httpRetryOptions.maxAttempts
  });

  afterEach(function() {
		config.registry = originalConfigRegistry
		config.npmTokenEnvVar = originalConfigNpmTokenEnvVar
		config.httpRetryOptions.maxAttempts = originalHttpRetry
		nock.cleanAll()
  });

	it('get npm token indirect from config', function() {
		const envVarName = 'TEST_NPM_TOKEN_LR'
		const testToken = Math.random().toString(36).substring(2)
		config.npmTokenEnvVar = envVarName
		process.env[envVarName] = testToken

		const npmTokenFromConfig = process.env[config.npmTokenEnvVar] || ''

		assert.strictEqual(npmTokenFromConfig, testToken)
	})

	it('get data from remote repository without authorization', async () => {
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
	  .reply(200, responses.async);

		const packageReportData = await getPackageJson(packageName)

		assert.strictEqual(packageReportData.name, packageName)
		assert.strictEqual(packageReportData.license, 'MIT')
		assert.ok(packageReportData.versions.hasOwnProperty('3.2.0'))
		assert.ok(packageReportData.versions['3.2.0'].hasOwnProperty('license'))
	})

	it('get data from remote repository with authorization', async () => {
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
	  .reply(200, responses.async);

		const packageReportData = await getPackageJson('async')

		assert.strictEqual(packageReportData.name, packageName)
		assert.ok(packageReportData.versions.hasOwnProperty('3.2.0'))
		assert.ok(packageReportData.versions['3.2.0'].hasOwnProperty('license'))
		assert.ok(scope.isDone())
	})

	it('get error from remote repository with incorrect authorization', async () => {
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
	  .reply(401, {});

		try {
			const packageReportData = await getPackageJson('async')
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
		id: "async",
		rev: "1661-d403a09616d6678ed32b5e0deffeacc9",
		name: "async",
		description: "Higher-order functions and common patterns for asynchronous code",
		'dist-tags': { latest: "3.2.0", next: "3.1.0" },
		versions: {
			'3.1.1': {
				name: 'async',
				description: 'Higher-order functions and common patterns for asynchronous code',
				version: '3.1.1',
				main: 'dist/async.js',
				homepage: 'https://caolan.github.io/async/',
				license: 'MIT',
				nyc: [Object],
				module: 'dist/async.mjs',
				_id: 'async@3.1.1',
				_nodeVersion: '10.16.0',
				_npmVersion: '6.9.0',
				directories: {},
				_hasShrinkwrap: false
			},
			'3.2.0': {
				name: "async",
				description: "Higher-order functions and common patterns for asynchronous code",
				version: "3.2.0",
				main: "dist/async.js",
				homepage: "https://caolan.github.io/async/",
				license: "MIT",
				module: "dist/async.mjs",
				_id: "async@3.2.0",
				_nodeVersion: "12.16.1",
				_npmVersion: "6.13.4",
				directories: {},
				_hasShrinkwrap: false
			}
		},
		time: {
			modified: "2020-03-05T17:23:38.004Z",
			created: "2010-12-19T16:41:51.765Z",
			'3.1.1': '2020-01-24T23:58:16.097Z',
			'3.2.0': "2020-02-24T02:58:20.125Z"
		},
		users: {
			thejh: true,
			justjavac: true
		},
		readmeFilename: "README.md",
		homepage: "https://caolan.github.io/async/",
		keywords: [ "async", "callback", "module", "utility" ],
		license: "MIT"
	}
}
