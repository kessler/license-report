// precommit.js
// update the version of license-report in the README.md file
// when running "npm run release"

import cp from 'node:child_process';
import fs from 'fs';
import path from 'node:path';
import url from 'node:url';
import util from 'node:util';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const execAsPromise = util.promisify(cp.exec);

const packageJsonPath = path
  .resolve(__dirname, '..', 'package.json')
  .replace(/(\s+)/g, '\\$1');

const readmeFileName = 'README.md';
const readmePath = path
  .resolve(__dirname, '..', readmeFileName)
  .replace(/(\s+)/g, '\\$1');

(async () => {
  const packageJsonAsBuffer = await fs.promises.readFile(packageJsonPath);
  const packageJson = JSON.parse(packageJsonAsBuffer.toString());

  let licenseReportRecurseVersion = packageJson?.version;
  if (!licenseReportRecurseVersion) {
    licenseReportRecurseVersion = '0.0.0';
  }

  const readmeContentAsBuffer = await fs.promises.readFile(readmePath);
  const readmeContentAsString = readmeContentAsBuffer.toString();
  const versionSearchPattern =
    /(.*https:\/\/img.shields.io\/badge\/version-)(.+)(-blue\.svg.*)/is;
  const regexResult = readmeContentAsString.match(versionSearchPattern);
  let newReadmeContent = readmeContentAsString;
  if (regexResult?.length === 4) {
    newReadmeContent = [
      regexResult[1],
      licenseReportRecurseVersion,
      regexResult[3],
    ].join('');
    await fs.promises.writeFile(readmePath, newReadmeContent);
    const { stderr } = await execAsPromise(`git add ${readmeFileName}`);
    if (stderr) {
      console.error(`Error when adding ${readmeFileName} to git repository.`);
    }
  } else {
    console.error('Error: pattern in README.md not found.');
  }
})();
