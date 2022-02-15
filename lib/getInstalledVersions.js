const debug = require('debug')('license-report:getInstalledVersions')

module.exports = getInstalledVersions

/**
 * Get the installed verions from package-lock.json.
 * If package-lock.json file does not exits, an empty object is returned
 * @param {object} packageLockContent - content of package-lock.json
 * @param {*} depsIndex - array returned by addPackagesToIndex
 * @returns {object} with a property for every entry in depsIndex with value = the installed version
 */
function getInstalledVersions(packageLockContent, depsIndex) {
  let installedVersions = {}
  if (packageLockContent.dependencies !== undefined) {
    const packageLockDependencies = packageLockContent.dependencies
    for (const element of depsIndex) {
      const packageLockDependency = packageLockDependencies[element.fullName]
      let installedVersion
      if ((packageLockDependency !== undefined) || (packageLockDependency.version !== undefined)) {
        installedVersion = packageLockDependency.version
      } else {
        installedVersion = 'no entry in packagelock.json'
      }
      installedVersions[element.fullName] = installedVersion
    }
  } else {
    debug('package-lock.json file does not contain a "dependency" element')
  }

  return installedVersions
}