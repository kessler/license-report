import visit from 'visit-values';

/**
 * Extract link to repository from registry data for a package
 * @param {object} json - object fetched from registry with information about 1 package
 * @returns {string} with link to repository
 */
export function extractLink(json) {
	if (json.repository && json.repository.url) {
		return json.repository.url
	}

	/*
		a feeble attempt to find some other url
	*/
	let otherUrls = []

	visit(json, function(value) {
		if (typeof value !== 'string') return
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
