const semver = require('semver')
const getPackageJson = require('./getPackageJson.js')
const extractLink = require('./extractLink.js')
const extractLicense = require('./extractLicense.js')

module.exports = getPackageReportData

/*
	collect the data for a single package
*/
async function getPackageReportData(packageEntry, installedPackagesData) {
	let definedVersion = packageEntry.version

	let installedVersion = ''
	let installedFrom = ''
	let installedPackageData = installedPackagesData[packageEntry.fullName]
	if (installedPackageData !== undefined) {
		installedVersion = installedPackageData.version
		installedFrom = installedPackageData.installedFrom
	} else {
		installedVersion = definedVersion
		if (installedVersion.match(/^[\^~].*/)) {
			installedVersion = installedVersion.substring(1);
		}
	}

	let json = {}
	let version = ''
	let licenseType = ''
	let link = ''
	let author = ''
	const fullPackageName = packageEntry.fullName

	// test if this is a locally installed package
	const linkVersionRegex = /^(http|https|file|git|git\+ssh|git\+https|github):.+/i
	if (!linkVersionRegex.test(packageEntry.version)) {
		json = await getPackageJson(fullPackageName)

		// find the right remote version for this package
		let localVersionSemverRange = semver.validRange(packageEntry.version)
		if (!localVersionSemverRange) {
			localVersionSemverRange = packageEntry.version
		}

		if (json.versions) {
			const versions = Object.keys(json.versions)
			version = semver.maxSatisfying(versions, localVersionSemverRange)
			if ((version === null) && (json['dist-tags'] !== undefined) && (json['dist-tags'][definedVersion] !== undefined)) {
				version = json['dist-tags'][definedVersion]
			}

			if (version !== null) {
				const versionData = json.versions[version]
				licenseType = extractLicense(versionData)
				link = extractLink(versionData)
			} else {
				version = `no matching version found in registry for package '${toPackageString(packageEntry)}'`
			}
		} else {
			version = `no versions in registry for package ${fullPackageName}`
		}
	} else {
		author = 'n/a'
		licenseType = 'n/a'
		link = 'n/a'
		installedFrom = packageEntry.version
		version = 'n/a'
		definedVersion = 'n/a'
		installedVersion = 'n/a'
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