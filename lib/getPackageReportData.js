const semver = require('semver')
const getPackageJson = require('./getPackageJson.js')
const extractLink = require('./extractLink.js')
const extractLicense = require('./extractLicense.js')
const extractInstalledFrom = require('./extractInstalledFrom.js')

module.exports = getPackageReportData

/**
 * Collects the data for a single package (link, installedFrom, remoteVersion)
 * @param {object} packageEntry - object with information about 1 dependency from the package.json
 * @returns {object} with all informations about the package
 */
async function getPackageReportData(packageEntry) {
	const notAvailableText = 'n/a'
	let definedVersion = packageEntry.version
	let author = packageEntry.author
	let licenseType = packageEntry.licenseType

	let installedVersion = packageEntry.installedVersion
	if (installedVersion === undefined) {
		if (definedVersion.match(/^[\^~].*/)) {
			installedVersion = definedVersion.substring(1)
		} else {
			installedVersion = definedVersion
		}
	}

	let json = {}
	let version = ''
	let link = ''
	let installedFrom = ''
	const fullPackageName = packageEntry.fullName

	// test if this is a locally installed package
	const linkVersionRegex = /^(http|https|file|git|git\+ssh|git\+https|github):.+/i
	if (!linkVersionRegex.test(definedVersion)) {
		json = await getPackageJson(fullPackageName)

		if (json.versions) {
			const versions = Object.keys(json.versions)
			const installedVersionData = json.versions[installedVersion]
			if (installedVersionData !== undefined) {
				installedFrom = extractInstalledFrom(installedVersionData) || notAvailableText
			} else {
				installedFrom = notAvailableText
			}

			// Get the right remote version for this package
			let localVersionSemverRange = semver.validRange(definedVersion)
			if (!localVersionSemverRange) {
				localVersionSemverRange = definedVersion
			}

			// remoteVersion
			version = semver.maxSatisfying(versions, localVersionSemverRange)
			if ((version === null) && (json['dist-tags'] !== undefined) && (json['dist-tags'][definedVersion] !== undefined)) {
				version = json['dist-tags'][definedVersion]
			}

			// link
			if (version !== null) {
				const serverVersionData = json.versions[version]
				link = extractLink(serverVersionData)
			} else {
				version = `no matching version found in registry for package '${toPackageString(packageEntry)}'`
				link = notAvailableText
			}
		} else {
			link = notAvailableText
			installedFrom = notAvailableText
			version = `no versions in registry for package ${fullPackageName}`
		}
	} else {
		link = notAvailableText
		installedFrom = packageEntry.version
		definedVersion = notAvailableText
		version = notAvailableText
	}

	return {
		name: fullPackageName,
		author: author,
		licenseType: licenseType,
		link: link,
		installedFrom: installedFrom,
		definedVersion: definedVersion,
		installedVersion: installedVersion,
		remoteVersion: version.toString(),
		comment: version.toString()
	}
}

function toPackageString(entry) {
	return entry.fullName + '@' + entry.version
}