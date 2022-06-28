const debug = require('debug')('license-report:addLocalPackageDataToIndexData')

module.exports = addLocalPackageDataToIndexData

/**
 * Adds info about a package extracted from the package-lock.json.
 * If package-lock.json file does not exist, 'n/a' is added as installedVersion
 * @param {object} element - entry for a package in depsIndex
 * @param {object} packageLockDependency - entry for package from 'dependencies' element of the package-lock.json
 */
function addLocalPackageDataToIndexData(element, packageLockDependency) {
	const notAvailableText = 'n/a'
  if ((packageLockDependency !== undefined) && (packageLockDependency.version !== undefined)) {
    element['installedVersion'] = packageLockDependency.version
  } else {
    element['installedVersion'] = notAvailableText
  }
}