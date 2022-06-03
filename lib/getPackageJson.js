const got = require('got')
const debug = require('debug')('license-report:getPackageJson')
const config = require('./config.js')

module.exports = async function(name) {
	const uri = config.registry + name

	debug('getPackageJson - REQUEST %s', uri)

	const options = {
		retry: config.httpRetryOptions.maxAttempts,
		hooks: {
			beforeRetry: [
				(options, error, retryCount) => {
					debug(`http request to npm for package "${name}" failed, retrying again soon...`)
				}
			],
			beforeError: [
				error => {
					debug(error)
					return error
				}
			]
		}
	}

	if ((config.npmTokenEnvVar !== null) && (config.npmTokenEnvVar !== undefined) && (config[config.npmTokenEnvVar] !== undefined)) {
		console.warn(`the environment variable '${config.npmTokenEnvVar}' containing the token used by npm to access the private repository should not be a configuration parameter (this is a severe security problem!)`)
	}
	const npmToken = process.env[config.npmTokenEnvVar] || ''
	if (npmToken.trim().length > 0) {
		options['headers'] = { 'Authorization': `Bearer ${npmToken}` }
	}

	let response = {}
	try {
		response = await got(uri, options).json()
	} catch (error) {
		debug(`http request to npm for package "${name}" failed with error '${error}'`)
	}

	return response
}