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
}
