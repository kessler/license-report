const packageLock = require('../../package-lock.json')

const NPM_V6 = 1

module.exports.addVersionToMockupData = (dependencies)  => {
	const result = dependencies.map( dependency => {
		let packagelockData
		if (packageLock.lockfileVersion === NPM_V6) {
			packagelockData = packageLock.dependencies[dependency.name]
		} else {
			packagelockData = packageLock.packages[`node_modules/${dependency.name}`]
		}
		const installedVersion = packagelockData.version
		dependency.installedVersion = installedVersion
		dependency.remoteVersion = installedVersion
		return dependency
	})

	return result
}

/*
	create expected value for json output
*/
module.exports.rawDataToJson = (rawData) => {
	return rawData
}

/*
	create expected value for csv output
*/
module.exports.rawDataToCsv = (expectedData, csvTemplate) => {
	const packageNamePattern = /\[\[(.+)]]/
	const templateLines = csvTemplate.split('\n')
	const resultLines = templateLines.map( line => {
		// find package name in line
		const found = line.match(packageNamePattern)
		if ((found !== null) && Array.isArray(found) && (found.length === 2)) {
			// get package data from expectedData
			const packageName = found[1]
			const expectedPackageData = expectedData.find(element => element.name === packageName)
			if (expectedPackageData !== undefined) {
				line = line.replace(found[0], expectedPackageData.name)
				line = line.replace('{{installedVersion}}', expectedPackageData.installedVersion)
				line = line.replace('{{remoteVersion}}', expectedPackageData.remoteVersion)
			}
		}

		return line
	})

	return resultLines.join('\n')
}