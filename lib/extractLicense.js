var util = require('util')
var _ = require('lodash')

module.exports = function(json) {
	if (json.name === 'request')
		console.log(json)
	if (typeof json.license === 'string')
		return json.license

	if (typeof json.license === 'object')
		return json.license.type

	if (util.isArray(json.licenses)) {
		var result = ''
		for (var i = 0; i < json.licenses.length; i++) {
			if (i > 0)
				result += ', '

			if (typeof json.licenses[i] === 'string' )
				result += json.licenses[i]
			else
				result += json.licenses[i].type
		}

		return result
	}
}