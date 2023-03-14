import addPackagesToIndex from './addPackagesToIndex.js';
import util from './util.js';

/**
 * Get dependencies from given package.json file that follow the definition in 'inclusions' and 'exclusions'.
 * For each package the following information is added: 'name', 'fullName', 'alias', 'version', 'scope'
 * 'inclusions' is equivalent to the 'only' parameter in the config file, split into an array of strings.
 * Complete list: ['prod', 'dev', 'opt', 'peer'] or null or undefined.
 * 'exclusions' is equivalent to the 'exclude' parameter in the config file.
 * @param {object} packageJson - content of package.json
 * @param {string[]} exclusions - array of package names to be excluded (from config.exclude)
 * @param {string[]} inclusions - array of strings of types of dependencies to be included (from config.only)
 * @return {object[]} with dependencies
 */
function getDependencies(packageJson, exclusions, inclusions) {
  let depsIndex = []
  const noDepsTypeDefined = util.isNullOrUndefined(inclusions) || !Array.isArray(inclusions) || (inclusions.length === 0)
  if ((noDepsTypeDefined || (inclusions.indexOf('prod') > -1)) && (packageJson.dependencies !== undefined)) {
    addPackagesToIndex(packageJson.dependencies, depsIndex, exclusions);
  }

  if ((noDepsTypeDefined || (inclusions.indexOf('dev') > -1)) && (packageJson.devDependencies !== undefined)) {
    addPackagesToIndex(packageJson.devDependencies, depsIndex, exclusions);
  }

  if ((noDepsTypeDefined || (inclusions.indexOf('peer') > -1)) && (packageJson.peerDependencies !== undefined)) {
    addPackagesToIndex(packageJson.peerDependencies, depsIndex, exclusions);
  }

  if ((noDepsTypeDefined || (inclusions.indexOf('opt') > -1)) && (packageJson.optionalDependencies !== undefined)) {
    addPackagesToIndex(packageJson.optionalDependencies, depsIndex, exclusions);
  }

  return depsIndex
}

export default getDependencies;