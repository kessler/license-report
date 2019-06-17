var visit = require('visit-values')
var isGitUrl = require('is-git-url')
var isUrl = require('is-url')

module.exports = function(json) {
	if (json.repository && json.repository.url) {
		return json.repository.url
	}

	/*
		a feeble attempt to find some other url
	*/
	var otherUrls = []

	visit(json, function(value) {
		if (isUrl(value) || isGitUrl(value)) {
			return otherUrls.push(value)
		}
	})

	if (otherUrls.length > 0) {
		return otherUrls[0]
	}
}