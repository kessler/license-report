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

/*
	update width of title and corresponding dashes if any version number is wider than the default title
*/
function updateHeaderLines(startOfVersionTitle, widthOfVersionTitle, versionTitleText, titleLine, dashesLine) {
	if (widthOfVersionTitle > versionTitleText.length) {
		titleLine = titleLine.replace(versionTitleText, versionTitleText.padEnd(widthOfVersionTitle))
		dashesLine = dashesLine.slice(0, startOfVersionTitle) + ''.padEnd(widthOfVersionTitle, '-') + dashesLine.slice(startOfVersionTitle + versionTitleText.length)
	}
	return {
		titleLine: titleLine,
		dashesLine: dashesLine
	}
}

/*
	create expected value for table output
*/
module.exports.rawDataToTable = (expectedData, tableTemplate) => {
	// find max width of remoteVersion and installedVersion
	let maxWidthOfRemoteVersion = 0
	let maxWidthOfInstalledVersion = 0
	expectedData.forEach(element => {
		if (element.installedVersion.length > maxWidthOfInstalledVersion) {
			maxWidthOfInstalledVersion = element.installedVersion.length
		}
		if (element.remoteVersion.length > maxWidthOfRemoteVersion) {
			maxWidthOfRemoteVersion = element.remoteVersion.length
		}
	})

	const templateLines = tableTemplate.split('\n')
	const remoteVersionTitleText = 'remote version'
	const installedVersionTitleText = 'installed version'
	const startOfRemoteVersion = templateLines[0].indexOf(remoteVersionTitleText)
	const startOfInstalledVersion = templateLines[0].indexOf(installedVersionTitleText)
	const widthOfRemoteVersion = Math.max(remoteVersionTitleText.length, maxWidthOfRemoteVersion)
	const widthOfInstalledVersion = Math.max(installedVersionTitleText.length, maxWidthOfInstalledVersion)

	// adapt title lines
	let updatedHeader = {}
	// titles / dashes must be adapted from right to left
	if (startOfRemoteVersion < startOfInstalledVersion) {
		updatedHeader = updateHeaderLines(startOfRemoteVersion, widthOfRemoteVersion, remoteVersionTitleText, templateLines[0], templateLines[1])
		updatedHeader = updateHeaderLines(startOfInstalledVersion, widthOfInstalledVersion, installedVersionTitleText, updatedHeader.titleLine, updatedHeader.dashesLine)
	} else {
		updatedHeader = updateHeaderLines(startOfInstalledVersion, widthOfInstalledVersion, installedVersionTitleText, templateLines[0], templateLines[1])
		updatedHeader = updateHeaderLines(startOfRemoteVersion, widthOfRemoteVersion, remoteVersionTitleText, updatedHeader.titleLine, updatedHeader.dashesLine)
	}
	templateLines[0] = updatedHeader.titleLine
	templateLines[1] = updatedHeader.dashesLine

	// replace placeholders with values
	const packageNamePattern = /\[\[(.+)]]/
	for (let i = 2; i < templateLines.length; i++) {
		let line = templateLines[i]
		// find package name in line
		const found = line.match(packageNamePattern)
		if ((found !== null) && Array.isArray(found) && (found.length === 2)) {
			// get package data from expectedData
			const packageName = found[1]
			const expectedPackageData = expectedData.find(element => element.name === packageName)
			if (expectedPackageData !== undefined) {
				line = line.replace(found[0], expectedPackageData.name)
				line = line.replace('{{installedVersion}}', (expectedPackageData.installedVersion).padEnd(widthOfInstalledVersion))
				line = line.replace('{{remoteVersion}}', (expectedPackageData.remoteVersion).padEnd(widthOfRemoteVersion))
			}
		}

		templateLines[i] = line
	}

	return templateLines.join('\n')
}
