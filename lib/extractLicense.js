var util = require('util')
var _ = require('lodash')

module.exports = function(json) {
	if (typeof json.license === 'string')
		return json.license

	if (util.isArray(json.licenses)) {
		var result = ''
		for (var i = 0; i < json.licenses.length; i++) {
			if (i > 0)
				result += ', '

			result += json.licenses[i].type
		}

		return result
	}
}