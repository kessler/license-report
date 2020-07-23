module.exports = packageDataToReportData

/**
 * Add fields from config.fields to object with information about one package.
 * Only fields from field list will be returned in generated object.
 * @param packageData - object with information about one package (fields 'name', 'licenseType', 'link', 'comment')
 * @param config - global configuration object
 * @returns object with all fields listed in config.fields
 */
function packageDataToReportData(packageData, config) {
	let finalData = {}

	// create only fields specified in the config
	config.fields.forEach(fieldName => {
		if ((fieldName in packageData)) {
			finalData[fieldName] = packageData[fieldName]
		} else {
			finalData[fieldName] = config[fieldName].value
		}
	})

	return finalData
}