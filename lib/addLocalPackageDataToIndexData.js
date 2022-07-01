const fs = require('fs')
const path = require('path')
const debug = require('debug')('license-report:addLocalPackageDataToIndexData')
const util = require('./util');

module.exports = addLocalPackageDataToIndexData

/**
 * Extracts information about a package from the corresponding package.json file
 * and adds it to the given 'element' object.
 * If package.json file is found, 'n/a' is added as installedVersion
 * @param {object} element - entry for a package in depsIndex
 * @param {string} projectRootPath - path of the package.json the report is generated for
 * @returns {object} element with installedVersion added
 */
 async function addLocalPackageDataToIndexData(element, projectRootPath) {
	const notAvailableText = 'n/a'
  let packageFolderName
  if (element.alias.length === 0) {
    packageFolderName = element.fullName
  } else {
    packageFolderName = element.alias
  }
  const elementPackageJsonPath = path.join(projectRootPath, 'node_modules', packageFolderName, 'package.json')
  if (fs.existsSync(elementPackageJsonPath)) {
    const packageJSONContent = await util.readJson(elementPackageJsonPath)
    if ((packageJSONContent !== undefined) && (packageJSONContent.version !== undefined)) {
      element['installedVersion'] = packageJSONContent.version
    } else {
      element['installedVersion'] = notAvailableText
    }
  } else {
    element['installedVersion'] = notAvailableText
    debug('found no package.json file for %s', element.fullName)
  }
  return element
}