const fs = require('fs')

exports.readJson = readJson

/**
 * Get an object by asynchronously reading a file
 * @param {string} path - path of the json file
 * @returns {object} generated from the content of the file
 */
 async function readJson(path) {
  const data = await fs.promises.readFile(path)
  return JSON.parse(data)
}

exports.helpText = `Generate a detailed report of the licenses of all projects dependencies.

Usage: license-report [options]

Options:
  --csvHeaders                          Add header row to csv output containing labels for all fields.
  
  --delimiter="|"                       Set delimiter for csv output (defaults to ",").

  --exclude=<name of 1 package>         Exclude a package from output (can be added multiple times).

  --html.cssFile=</a/b/c.css>           Use custom stylesheet for html output.

  --only={dev|prod}                     Output licenses from devDependencies or dependencies (defaults to both).

  --output={table|json|csv|html}        Select output format (defaults to json).

  --package=</path/to/package.json>     Use another package.json file (defaults to current project).

  --registry=<https://myregistry.com/>  Use private repository for information about packages (defaults to npmjs.org).

  --<field>.label=<new-label>           Set label for output field. Allowed field names are:
                                        department, relatedTo, name, licensePeriod, material, licenseType,
                                        link, remoteVersion, installedVersion, definedVersion, author, installedFrom.

  --<field>.value=<new-value>           Set value for static output field. Allowed field names are:
                                        department, relatedTo, licensePeriod, material.
`