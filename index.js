#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const debug = require('debug')('license-report')
const config = require('./lib/config.js')
const getFormatter = require('./lib/getFormatter')
const getInstalledPackagesData = require('./lib/getInstalledPackagesData')
const addPackagesToIndex = require('./lib/addPackagesToIndex')
const getPackageReportData = require('./lib/getPackageReportData.js')
const packageDataToReportData = require('./lib/packageDataToReportData')
const util = require('./lib/util');

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

    // package-lock.json is used to get the installed package information from
    let installedPackagesData = {}
    const resolvedPackageLockJson = path.resolve(path.dirname(resolvedPackageJson), 'package-lock.json')
    debug('loading %s', resolvedPackageLockJson)
    if (fs.existsSync(resolvedPackageLockJson)) {
      const packageLockContent = await util.readJson(resolvedPackageLockJson)
      installedPackagesData = getInstalledPackagesData(packageLockContent, depsIndex)
    } else {
      console.warn(`Warning: the file '${resolvedPackageLockJson}' is required to get installed versions of packages`)
    }

    const results = await Promise.all(
      depsIndex.map(async (packageEntry) => {
        return await getPackageReportData(packageEntry, installedPackagesData)
      })
    )

    packagesData = results.map(element => packageDataToReportData(element, config))
    console.log(outputFormatter(packagesData, config))
  } catch (e) {
    console.error(e.stack)
    process.exit(1)
  }
})();
