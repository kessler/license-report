// readme-updater.js
// standard-version updater for readme files with iconified semantic version string.

module.exports.readVersion = function(contents) {
  const versionSearchPattern = /(.*!\[Version]\(https:\/\/img.shields.io\/badge\/version-)(.+)(-blue\.svg.*)/is;
  const regexResult = contents.match(versionSearchPattern);
  let version = '';
  if (regexResult.length === 4) {
    version = regexResult[2];
  }

  return version;
};

module.exports.writeVersion = function(contents, version) {
  const versionSearchPattern = /(.*!\[Version]\(https:\/\/img.shields.io\/badge\/version-)(.+)(-blue\.svg.*)/is;
  const regexResult = contents.match(versionSearchPattern);
  let newContents = contents;
  if (regexResult.length === 4) {
    newContents = [regexResult[1], version, regexResult[3]].join('');
  }

  return newContents;
};
