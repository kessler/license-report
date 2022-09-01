// precommit.js
// update the version of license-report-recurse in the README.md file

import fs from 'fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const packageJsonPath = path
	.resolve(__dirname, '..', 'package.json')
	.replace(/(\s+)/g, '\\$1');

const readmePath = path
	.resolve(__dirname, '..', 'README.md')
	.replace(/(\s+)/g, '\\$1');

(async () => {
  const packageJsonAsBuffer = await fs.promises.readFile(packageJsonPath);
  const packageJson = JSON.parse(packageJsonAsBuffer.toString());

  let licenseReportRecurseVersion = packageJson?.version;
  if (!licenseReportRecurseVersion) {
    licenseReportRecurseVersion = '0.0.0'
  }

  const readmeContentAsBuffer = await fs.promises.readFile(readmePath);
  const readmeContentAsString = readmeContentAsBuffer.toString();
  const versionSearchPattern = /(.*https:\/\/img.shields.io\/badge\/version-)(.+)(-blue\.svg.*)/is;
  const regexResult = readmeContentAsString.match(versionSearchPattern);
  let newReadmeContent = readmeContentAsString;
  if (regexResult?.length === 4) {
    newReadmeContent = [regexResult[1], licenseReportRecurseVersion, regexResult[3]].join('');
    await fs.promises.writeFile(readmePath, newReadmeContent);
  } else {
    console.error('Error: pattern in README.md not found.')
  }
})();