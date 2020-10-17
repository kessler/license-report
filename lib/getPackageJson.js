var request = require('request')
var config = require('./config.js')
var debug = require('debug')('license-report:getPackageJson')
var Stubborn = require('stubborn')

var get = module.exports = function(name, versionOrCallback, callback) {
	var uri = config.registry + name

	if (arguments.length === 2) {
		callback = versionOrCallback
	} else {
		uri += '/' + versionOrCallback
	}

	debug('REQUEST %s', uri)

	var stubborn = new Stubborn(exec, config.httpRetryOptions, function (err, result) {
		if (err) {
			return callback(err)
		}

		callback(null, result)
	})

	stubborn.on('attemptError', function (err) {
		console.error(err)
		console.error('http request to npm for package "' + name + '" failed, retrying again soon...')
	})

	stubborn.run()

	function exec(internalCallback) {
		const npmToken = process.env[config.npmTokenEnvVar] || ''
		const options = {
			url: uri,
			headers: {
				'Authorization': `Bearer ${npmToken}`
			}
		}
		request(options, function(err, response, body) {
			if (err) {
				return internalCallback(err)
			}

			// 4xx / 5xx errors
			if (response.statusCode > 399 && response.statusCode < 599) {
				return internalCallback(new Error('invalid statusCode ' + response.statusCode))
			}

			var result, parseError

			try {
				debug('OK %s', uri)
				result = JSON.parse(body)
			} catch (e) {
				debug(e)
				debug(body)
				parseError = e
			}

			return internalCallback(parseError, result)
		})
	}
}
