
/***
 * Before using this utilty.
 * Uncomment below code and 
 * Import All json files that have been geneareted with License-Report utlity.
 * Run this utility with below command.
 * node index.js > ZimbraStyleReprot.txt
 */

/*const zimbraPackage1 = require('');
const zimbraPackage2 = require('');


const combineAllPackages = [
	...zimbraPackage1,
    ...zimbraPackage2
];*/

const licenses = new Map();

combineAllPackages.forEach(({ licenseType, name, installedVersion, definedVersion, remoteVersion }) => {
	let version = '';
	if (installedVersion !== 'n/a') {
		version = installedVersion;
	} else if (definedVersion !== 'n/a') {
        version = definedVersion;
    } else {
        version = remoteVersion;
    }
	licenses.set(
		licenseType,
		new Set([
			...(licenses.get(licenseType) || []),
			`${name}@${version}`,
		])
	);
});

let index = 1;
let finalStringOut = '';
for (const [key, value] of licenses) {
	finalStringOut =
		finalStringOut +
		`\n\n\nSECTION ${index++}: ${key} License \n   >>> ${[...value].join(
			'\n   >>> '
		)} `;
}

console.log(finalStringOut);
