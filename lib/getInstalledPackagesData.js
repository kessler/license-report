const debug = require('debug')('license-report:getInstalledPackagesData')

module.exports = getInstalledPackagesData

/**
 * Gets info about the installed packages from package-lock.json.
 * If package-lock.json file does not exist, an object populated with 'no entry in package-lock.json' values is returned
 * @param {object} packageLockContent - content of package-lock.json
 * @param {[object]} depsIndex - array returned by addPackagesToIndex
 * @returns {object} with a property for every entry in depsIndex with value = { version: 'installed version' }
 */
function getInstalledPackagesData(packageLockContent, depsIndex) {
  let installedPackagesData = {}
  if (packageLockContent.dependencies !== undefined) {
    const packageLockDependencies = packageLockContent.dependencies
    for (const element of depsIndex) {
      const packageLockDependency = packageLockDependencies[element.fullName]
      let installedPackageData
      if (packageLockDependency !== undefined) {
        installedPackageData = { 
          version: packageLockDependency.version || 'no entry in package-lock.json'
        }
      } else {
        installedPackageData = { 
          version: 'no entry in package-lock.json'
        }
      }
      installedPackagesData[element.fullName] = installedPackageData
    }
  } else {
    debug('package-lock.json file does not contain a "dependencies" element')
  }

  return installedPackagesData
}