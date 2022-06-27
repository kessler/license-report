const semver = require('semver')
const getPackageJson = require('./getPackageJson.js')
const extractLink = require('./extractLink.js')
const extractLicense = require('./extractLicense.js')
const extractInstalledFrom = require('./extractInstalledFrom.js')

module.exports = getPackageReportData

/*
	collect the data for a single package
*/
async function getPackageReportData(packageEntry, installedPackagesData) {
	const notAvailableText = 'n/a'
	let definedVersion = packageEntry.version

	let installedVersion = ''
	let installedPackageData = installedPackagesData[packageEntry.fullName]
	if (installedPackageData !== undefined) {
		installedVersion = installedPackageData.version
	} else {
		installedVersion = definedVersion
		if (installedVersion.match(/^[\^~].*/)) {
			installedVersion = installedVersion.substring(1)
		}
	}

	let json = {}
	let version = ''
	let licenseType = ''
	let link = ''
	let installedFrom = ''
	let author = ''
	const fullPackageName = packageEntry.fullName

	// test if this is a locally installed package
	const linkVersionRegex = /^(http|https|file|git|git\+ssh|git\+https|github):.+/i
	if (!linkVersionRegex.test(packageEntry.version)) {
		json = await getPackageJson(fullPackageName)

		if (json.versions) {
			const versions = Object.keys(json.versions)
			const installedVersionData = json.versions[installedVersion]
			if (installedVersionData !== undefined) {
				installedFrom = extractInstalledFrom(installedVersionData)
				if (installedFrom === undefined) {
					installedFrom = notAvailableText
				}
			} else {
				installedFrom = notAvailableText
			}

			// find the right remote version for this package
			let localVersionSemverRange = semver.validRange(packageEntry.version)
			if (!localVersionSemverRange) {
				localVersionSemverRange = packageEntry.version
			}

			version = semver.maxSatisfying(versions, localVersionSemverRange)
			if ((version === null) && (json['dist-tags'] !== undefined) && (json['dist-tags'][definedVersion] !== undefined)) {
				version = json['dist-tags'][definedVersion]
			}

			if (version !== null) {
				const serverVersionData = json.versions[version]
				licenseType = extractLicense(serverVersionData)
				link = extractLink(serverVersionData)
			} else {
				version = `no matching version found in registry for package '${toPackageString(packageEntry)}'`
			}
		} else {
			version = `no versions in registry for package ${fullPackageName}`
			installedFrom = notAvailableText
		}
	} else {
		author = notAvailableText
		licenseType = notAvailableText
		link = notAvailableText
		installedFrom = packageEntry.version
		version = notAvailableText
		definedVersion = notAvailableText
		installedVersion = notAvailableText
	}

	if (isObject(json.author)) {
		author = json.author.name || ''
		if (json.author.email) {
			if (author.length > 0) {
				author += ' ';
			}
			author += json.author.email;
		}

		if (json.author.url) {
			if (author.length > 0){
				author += ' ';
			}
			author += json.author.url;
		}
	} else {
		if ((typeof json.author === 'string') || (json.author instanceof String)) {
			author = json.author;
		}
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

function isObject(element) {
	return ((element !== null) && ((typeof element === "object") || (typeof element === 'function')))
}