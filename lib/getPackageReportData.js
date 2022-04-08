const semver = require('semver')
const getPackageJson = require('./getPackageJson.js')
const extractLink = require('./extractLink.js')
const extractLicense = require('./extractLicense.js')

module.exports = getPackageReportData

/*
	collect the data for a single package
*/
async function getPackageReportData(packageEntry, installedPackagesData) {
	const definedVersion = packageEntry.version

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

	const fullPackageName = packageEntry.fullName
	const json = await getPackageJson(fullPackageName)

	// dont think it is possible but just to make sure.
	if (!json.versions) {
		throw new Error(`no versions in registry for package ${fullPackageName}`)
	}

	// find the right remote version for this package
	let localVersionSemverRange = semver.validRange(packageEntry.version)
	if (!localVersionSemverRange) {
		localVersionSemverRange = packageEntry.version
	}

	const versions = Object.keys(json.versions)
	let version = semver.maxSatisfying(versions, localVersionSemverRange)
	if ((version === null) && (json['dist-tags'] !== undefined) && (json['dist-tags'][definedVersion] !== undefined)) {
		version = json['dist-tags'][definedVersion]
	}

	let licenseType = ''
	let link = ''
	if (version !== null) {
		const versionData = json.versions[version]
		licenseType = extractLicense(versionData)
		link = extractLink(versionData)
	} else {
		version = `no matching version found in registry for package '${toPackageString(packageEntry)}'`
	}

	let author = ''
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