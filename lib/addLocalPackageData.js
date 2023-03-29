import fs from 'node:fs';
import path from 'node:path';
import createDebugMessages from 'debug';
import semver from 'semver';
import util from './util.js';
import extractAuthor from './extractAuthor.js';
import extractLicense from './extractLicense.js';

const debug = createDebugMessages('license-report:addLocalPackageData');

/**
 * Extract information about a package from the corresponding package.json file
 * and add it to the given 'element' object.
 * The fetched entries are 'installedVersion', 'author', 'licenseType' and the
 * properties of the package.json defined in the 'fields' list.
 * If package.json file is found, 'n/a' is added as installedVersion.
 * The logic to resolve mimics nodes logic (if not found, step up 1 level up to root)
 * @param {object} element - object entry of depsIndex defining a package (name, version etc.)
 * @param {string} projectRootPath - path of the package.json the report is generated for
 * @param fields - 'fields' list from the global configuration object
 * @returns {object} element with installedVersion, author and licenseType added
 */
 async function addLocalPackageData(element, projectRootPath, fields) {
  const notAvailableText = 'n/a'
  const exclusionList = ['installedVersion', 'author', 'licenseType']

  let projectPackageJsonPath = projectRootPath
  let oldProjectPackageJsonPath = ''

  element['installedVersion'] = notAvailableText
  element['author'] = notAvailableText
  element['licenseType'] = notAvailableText


  let packageFolderName
  if (element.alias.length === 0) {
    packageFolderName = element.fullName
  } else {
    packageFolderName = element.alias
  }

  do {
    const elementPackageJsonPath = path.join(projectPackageJsonPath, 'node_modules', packageFolderName, 'package.json')
    if (fs.existsSync(elementPackageJsonPath)) {
      const packageJSONContent = await util.readJson(elementPackageJsonPath)
      if ((packageJSONContent?.version !== undefined)) {
        if(!semver.validRange(element.version) || semver.satisfies(packageJSONContent.version, element.version)) {
          element['installedVersion'] = packageJSONContent.version
          element['author'] = extractAuthor(packageJSONContent)
          element['licenseType'] = extractLicense(packageJSONContent)
          element['packageJsonPath'] = elementPackageJsonPath
          // create entries for 'custom' fields
          fields.forEach(fieldName => {
            if ((element[fieldName] === undefined)
                && !(fieldName in exclusionList)
                && (packageJSONContent[fieldName] !== undefined)) {
              element[fieldName] = packageJSONContent[fieldName]
            }
          })
          break
        }
      }
    }
    oldProjectPackageJsonPath = projectPackageJsonPath
    projectPackageJsonPath = path.dirname(projectPackageJsonPath)
  } while (projectPackageJsonPath !== oldProjectPackageJsonPath)

  if (element['installedVersion'] === notAvailableText) {
    debug('found no package.json file for %s', element.fullName)
  }

  return element
}

export default addLocalPackageData;