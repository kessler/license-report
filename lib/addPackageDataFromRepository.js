import semver from 'semver';
import getPackageDataFromRepository from './getPackageDataFromRepository.js';
import extractLink from './extractLink.js';
import extractInstalledFrom from './extractInstalledFrom.js';

/**
 * Create a string from the package name and the package version
 * @param {object} packageEntry - object with information about 1 dependency from the package.json
 * @returns string in the format 'packageName@packageVersion
 */
function toPackageString(packageEntry) {
	return packageEntry.fullName + '@' + packageEntry.version
}

/**
 * Collects the data for a single package from the repository (link, installedFrom, remoteVersion) and
 * add it to the given object.
 * @param {object} packageEntry - object with information about 1 package with data from the local package.json added
 * @returns {object} with all informations about the package
 */
async function addPackageDataFromRepository(packageEntry) {
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
	let latest = ''
	let lastModified = ''
	const fullPackageName = packageEntry.fullName

	// test if this is a locally installed package
	const linkVersionRegex = /^(http|https|file|git|git\+ssh|git\+https|github):.+/i
	if (!linkVersionRegex.test(definedVersion)) {
		json = await getPackageDataFromRepository(fullPackageName)

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

			// latestRemoteVersion
			latest = notAvailableText
			if ((json['dist-tags'] !== undefined) && (json['dist-tags'].latest !== undefined)) {
				latest = json['dist-tags'].latest
			}

			// latestRemoteModified
			lastModified = notAvailableText
			if ((json.time !== undefined) && (json.time.modified !== undefined)) {
				lastModified = json.time.modified
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
			latest = notAvailableText
			lastModified = notAvailableText
				}
	} else {
		link = notAvailableText
		installedFrom = packageEntry.version
		definedVersion = notAvailableText
		version = notAvailableText
		latest = notAvailableText
		lastModified = notAvailableText
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
		latestRemoteVersion: latest,
		latestRemoteModified: lastModified,
		comment: version.toString()
	}
}

export default addPackageDataFromRepository;
