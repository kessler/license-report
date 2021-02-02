const packageLock = require('../../package-lock.json')

module.exports.jsonUpdateVersions = (dependencies) => {
	const { packages } = packageLock
	for (const dependency of dependencies) {
		const package = packages[`node_modules/${dependency.name}`]
		dependency.remoteVersion = package.version
		dependency.installedVersion = package.version
	}

	return dependencies
}
