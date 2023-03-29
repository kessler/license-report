/**
 * Create object with all fields listed in config.fields with current values about one package.
 * Only fields from the field list will be returned in the generated object.
 * If there is no value for a field in 'packageData', then the value is taken from the corresponding
 * entry in the config file (e.g. from config.material.value for the 'material' field).
 * @param packageData - object with information about one package (fields are e.g. 'name', 'licenseType', 'link', 'remoteVersion', 'installedVersion', 'author')
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
			finalData[fieldName] = config[fieldName]?.value
		}
	})

	return finalData
}

export default packageDataToReportData;
