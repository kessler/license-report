#!/usr/bin/env node

const path = require('path')
const debug = require('debug')('license-report')
const config = require('./lib/config.js')
const getFormatter = require('./lib/getFormatter')
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

const resolvedPackageJson = path.resolve(process.cwd(), config.package)
debug('requiring %s', resolvedPackageJson)
const packageJson = require(resolvedPackageJson)

// fill deps with "dependencies"; dpendingon options, other dependencies will be added later
const deps = packageJson.dependencies
const devDeps = packageJson.devDependencies
const peerDeps = packageJson.peerDependencies
const optDeps = packageJson.optionalDependencies

	const exclusions = Array.isArray(config.exclude) ? config.exclude : [config.exclude]
	/*
		an index of all the dependencies
	*/
	let depsIndex = []

	if (!config.only || config.only.indexOf('prod') > -1) {
		addPackagesToIndex(deps, depsIndex, exclusions)
	}

	if (!config.only || config.only.indexOf('dev') > -1) {
		if (peerDeps) {
			addPackagesToIndex(peerDeps, depsIndex, exclusions)
		}
		
		if (optDeps) {
			addPackagesToIndex(optDeps, depsIndex, exclusions)
		}
		
		addPackagesToIndex(devDeps, depsIndex, exclusions)
	}

	try {
		const results = await Promise.all(
			depsIndex.map(async (packageEntry) => {
				return await getPackageReportData(packageEntry)
			})
		)
		packagesData = results.map(element => packageDataToReportData(element, config))
		console.log(outputFormatter(packagesData, config))
	} catch (e) {
		console.error(e.stack)
		process.exit(1)
	}
})();
