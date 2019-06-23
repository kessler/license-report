/*
	add all packages to a package index array. 
	maintaining uniqueness (crudly)
*/
module.exports = function(packages, packageIndex, exclusions) {
	exclusions = exclusions  || []

	// iterate over packages and prepare urls before I call the registry
	for (var key in packages) {
		if (exclusions.indexOf(key) !== -1) {
			continue
		}

		var name = key
		var fullName = key
		var version = packages[key]
		var scope = undefined

		if(key.indexOf('@') === 0) {
			var scopeSeparator = key.indexOf('/')
			scope = key.substring(1, scopeSeparator)
			name = key.substring(scopeSeparator + 1, key.length)
		}
		
		var entry = { 
			fullName: fullName,
			name: name,
			version: version, 
			scope: scope
		}

		if (indexOfPackage(packageIndex, entry) === -1) {
			packageIndex.push(entry)
		}
	}	
}

function indexOfPackage(index, newEntry) {
	for (var i = 0; i < index.length; i++) {
		var entry = index[i]
		if (entry.name === newEntry.name && entry.version === newEntry.version && entry.scope === newEntry.scope) {
			return i
		}
	}

	return -1
}
