#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import createDebugMessages from 'debug';

import config from './lib/config.js';
import getFormatter from './lib/getFormatter.js';
import addLocalPackageData from './lib/addLocalPackageData.js';
import addPackageDataFromRepository from './lib/addPackageDataFromRepository.js';
import getDependencies from './lib/getDependencies.js';
import packageDataToReportData from './lib/packageDataToReportData.js';
import util from './lib/util.js';

const debug = createDebugMessages('license-report');

const generateLicenseData = async (config, packagePath) => {

  const outputFormatter = getFormatter(config.output)

  try {
    const rootPackageJson = path.resolve(process.cwd(), config.package);

    const resolvedPackageJson = path.resolve(process.cwd(), packagePath);

    debug('loading %s', resolvedPackageJson)
    let packageJson
    if (fs.existsSync(resolvedPackageJson)) {
      packageJson = await util.readJson(resolvedPackageJson)
    } else {
      throw new Error(`Warning: the file '${resolvedPackageJson}' is required to get installed versions of packages`)
    }
    
    // Get a list of all the dependencies we want information about.
    const inclusions = util.isNullOrUndefined(config.only) ? null : config.only.split(',')
    const exclusions = Array.isArray(config.exclude) ? config.exclude : [config.exclude]
    let depsIndex = getDependencies(packageJson, exclusions, inclusions)

    const projectRootPath = path.dirname(rootPackageJson)
    const packagesData = await Promise.all(
      depsIndex.map(async (element) => {
        const localDataForPackage = await addLocalPackageData(element, projectRootPath, config.fields)
        const completeDataForPackage = await addPackageDataFromRepository(localDataForPackage)
        return packageDataToReportData(completeDataForPackage, config)
      })
    )

    let currentDependencyLicense = [];
    currentDependencyLicense = JSON.parse(outputFormatter(packagesData, config));

    let subDependenciesLicense = [];
    for (let i = 0; i< currentDependencyLicense.length; i++) {
      if (currentDependencyLicense[i].packageJsonPath) {
        let licData = [];
        try {
          licData = await generateLicenseData(config, currentDependencyLicense[i].packageJsonPath);
        } catch(e) {
          licData = [];
        } finally {
          subDependenciesLicense = [...subDependenciesLicense, ...licData];
        }
        
      }
    }


    return [...currentDependencyLicense, ...subDependenciesLicense];

  } catch (e) {
    console.error(e.stack)
    process.exit(1)
  }
}

(async () => {
  if (config.help) {
    console.log(util.helpText)
    return
  }

  if (!config.package) {
    config.package = './package.json'
  }

  if (path.extname(config.package) !== '.json') {
    throw new Error('invalid package.json ' + config.package)
  }

  const output = [];

  console.log(JSON.stringify(await generateLicenseData(config, config.package)));

})();
