module.exports = extractLicense

/**
 * Extract license type from content of a package.json file
 * @param {object} packageJSONContent - content of package.json for 1 package
 * @returns {string} with license type
 */
function extractLicense(packageJSONContent) {
	const notAvailableText = 'n/a'

	if (typeof packageJSONContent.license === 'string') {
		return packageJSONContent.license
	}

	if (typeof packageJSONContent.license === 'object') {
		return packageJSONContent.license.type
	}

	let licenseType
	if (Array.isArray(packageJSONContent.licenses)) {
		licenseType = ''
		for (let i = 0; i < packageJSONContent.licenses.length; i++) {
			if (i > 0)
				licenseType += ', '

			if (typeof packageJSONContent.licenses[i] === 'string') {
				licenseType += packageJSONContent.licenses[i]
			} else {
				licenseType += packageJSONContent.licenses[i].type
			}
		}
		if (licenseType.length === 0) {
			licenseType = notAvailableText
		}
	} else {
		licenseType = notAvailableText
	}
	return licenseType
}