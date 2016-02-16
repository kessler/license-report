var path = require('path')
var extractLink = require('./extractLink.js')
var extractLicense = require('./extractLicense.js')

module.exports = getPackageReportData

/*
	collect the data for a single package
*/
function getPackageReportData(package) {
  return {
    name: package.name,
    licenseType: extractLicense(package),
    link: extractLink(package),
    comment: package.version.toString()
  };
};