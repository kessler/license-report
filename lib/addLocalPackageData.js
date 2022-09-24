import fs from 'node:fs';
import path from 'node:path';
import createDebugMessages from 'debug';
import semver from 'semver';
import util from './util.js';
import extractAuthor from './extractAuthor.js';
import extractLicense from './extractLicense.js';

const debug = createDebugMessages('license-report:addLocalPackageData');

/**
 * Extracts information about a package from the corresponding package.json file
 * and adds it to the given 'element' object.
 * If package.json file is found, 'n/a' is added as installedVersion.
 * The logic to resolve mimics nodes logic (if not found, step up 1 level up to root)
 * @param {object} element - entry for a package in depsIndex
 * @param {string} projectRootPath - path of the package.json the report is generated for
 * @returns {object} element with installedVersion, author and licenseType added
 */
 async function addLocalPackageData(element, projectRootPath) {
  const notAvailableText = 'n/a'

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