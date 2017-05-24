var visit = require('visit-values')

module.exports = function(json) {
	if (json.repository && json.repository.url) {
		return json.repository.url
	}

	/*
		a feeble attempt to find some other url
	*/
	var otherUrls = []

	visit(json, function(value) {
		if (value.substr(0, 'http'.length) === 'http') {
			return otherUrls.push(value)
		}

		if (value.substr(0, 'git'.length) === 'git') {
			return otherUrls.push(value)
		}
	})
	
	if (otherUrls.length > 0) {
		return otherUrls[0]
	}
}