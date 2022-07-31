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

  const outputFormatter = getFormatter(config.output)

  try {
    const resolvedPackageJson = path.resolve(process.cwd(), config.package)

    debug('loading %s', resolvedPackageJson)
    let packageJson
    if (fs.existsSync(resolvedPackageJson)) {
      packageJson = await util.readJson(resolvedPackageJson)
    } else {
      throw new Error(`Warning: the file '${resolvedPackageJson}' is required to get installed versions of packages`)
    }
    
    // an index of all the dependencies
    const inclusions = util.isNullOrUndefined(config.only) ? null : config.only.split(',')
    const exclusions = Array.isArray(config.exclude) ? config.exclude : [config.exclude]
    let depsIndex = getDependencies(packageJson, exclusions, inclusions)

    const projectRootPath = path.dirname(resolvedPackageJson)
    const packagesData = await Promise.all(
      depsIndex.map(async (element) => {
        const localDataForPackages = await addLocalPackageData(element, projectRootPath)
        const packagesData = await addPackageDataFromRepository(localDataForPackages)
        return packageDataToReportData(packagesData, config)
      })
    )

    console.log(outputFormatter(packagesData, config))
  } catch (e) {
    console.error(e.stack)
    process.exit(1)
  }
})();
