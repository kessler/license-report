var request = require('request')
var config = require('./config.js')
var debug = require('debug')('license-report:getPackageJson')

var get = module.exports = function(name, versionOrCallback, callback) {
	var uri = config.registry + name

	if (arguments.length === 2) {
		callback = versionOrCallback
	} else {
		uri += '/' + versionOrCallback
	}

	debug('REQUEST %s', uri)

	request(uri, function(err, response, body) {
		if (err) {
			return callback(err)
		}

		// 4xx / 5xx errors
		if (response.statusCode > 399 && response.statusCode < 599) {
			return callback(new Error('invalid statusCode ' + response.statusCode))			
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

		return callback(parseError, result)
	})
}
