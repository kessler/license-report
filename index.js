#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import createDebugMessages from 'debug';
import config from './lib/config.js';
import getFormatter from './lib/getFormatter.js';
import addLocalPackageData from './lib/addLocalPackageData.js';
import addPackagesToIndex from './lib/addPackagesToIndex.js';
import addPackageDataFromRepository from './lib/addPackageDataFromRepository.js';
import packageDataToReportData from './lib/packageDataToReportData.js';
import { helpText, readJson } from './lib/util.js';

const debug = createDebugMessages('license-report');

(async () => {
  if (config.help) {
    console.log(helpText)
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
      packageJson = await readJson(resolvedPackageJson)
    } else {
      throw new Error(`Warning: the file '${resolvedPackageJson}' is required to get installed versions of packages`)
    }

    const deps = packageJson.dependencies
    const peerDeps = packageJson.peerDependencies
    const optDeps = packageJson.optionalDependencies
    const devDeps = packageJson.devDependencies

    const exclusions = Array.isArray(config.exclude) ? config.exclude : [config.exclude]

    // an index of all the dependencies
    let depsIndex = []

    if (!config.only || config.only.indexOf('prod') > -1) {
      addPackagesToIndex(deps, depsIndex, exclusions)
    }

    if (!config.only || config.only.indexOf('dev') > -1) {
			addPackagesToIndex(devDeps, depsIndex, exclusions)
    }

    if (!config.only || config.only.indexOf('peer') > -1) {
      if (peerDeps) {
        addPackagesToIndex(peerDeps, depsIndex, exclusions)
      }
    }

    if (!config.only || config.only.indexOf('opt') > -1) {
      if (optDeps) {
        addPackagesToIndex(optDeps, depsIndex, exclusions)
      }
    }

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
