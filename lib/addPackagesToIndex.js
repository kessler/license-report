/*
	add all packages to a package index array. 
	maintaining uniqueness (crudely)
*/
module.exports = function(packages, packageIndex, exclusions) {
	exclusions = exclusions || []

	// iterate over packages and prepare urls before I call the registry
	for (let key in packages) {
		if (exclusions.indexOf(key) !== -1) {
			continue
		}

		let name = key
		let fullName = key
		let alias = ''
		let version = packages[key]
		if (version.startsWith('npm:')) {
			alias = fullName
			const aliasBase = version.substring(4)
			const versionSeparator = aliasBase.lastIndexOf('@')
			fullName = aliasBase.substring(0, versionSeparator)
			name = fullName
			version = aliasBase.substring(versionSeparator + 1)
		}

		let scope = undefined
		if (name.indexOf('@') === 0) {
			const scopeSeparator = name.indexOf('/')
			scope = name.substring(1, scopeSeparator)
			name = name.substring(scopeSeparator + 1, name.length)
		}

		const newEntry = {
			fullName: fullName,
			alias: alias,
			name: name,
			version: version,
			scope: scope
		}

		const indexOfNewEntry = packageIndex.findIndex(entry => (entry.name === newEntry.name && entry.version === newEntry.version && entry.scope === newEntry.scope))

		if (indexOfNewEntry === -1) {
			packageIndex.push(newEntry)
		}
	}
}