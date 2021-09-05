# license report tool
generate a license report of the projects dependencies

## Installation
```
npm install -g license-report
```
## Functionality
`license-report` reads data from a `package.json` file and adds detailed version information about the installed versions from the corresponding `package-lock.json` file and about the latest available version from the (npm) registry.

## Usage

#### simple:
```
cd your/project/
license-report
```
by default, `license-report` outputs all licenses from `dependencies`, `devDependencies`, `optionalDependencies` and `peerDependencies`.  
To specify one or the other, use `--only`; e.g.
```
license-report --only=dev
```
```
license-report --only=prod
```
```
license-report --only=prod,opt,peer
```
The 'only' option is a comma separated list of the dependencies to use.  
Possible values are:
|value|segment of package.json|
|---|---|
|prod|dependencies|
|dev|devDependencies|
|opt|optionalDependencies|
|peer|peerDependencies|

#### explicit package.json:
```
license-report --package=/path/to/package.json
```

#### customize a field's label:
Used as column headers in table / csv / html output. For html output the labels of all fields in the output must be unique.
```
license-report --department.label=division
```

#### customize a fields default value:
Only applicable for the fields in the list later in this document (look for "Fields with data set in the configuration of license-report")
```
license-report --department.value=ninjaSquad
```

#### use another registry:
```
license-report --registry=https://myregistry.com/
```

#### generate different outputs:
```
license-report --output=table
license-report --output=json
license-report --output=csv
license-report --output=html

# replace default ',' separator with something else
license-report --output=csv --delimiter="|" 

# output csv headers (fields) on first row
license-report --output=csv --csvHeaders

# use custom stylesheet for html output
license-report --output=html --html.cssFile=/a/b/c.css

# see the output immediately in your browser, use hcat (npm i -g hcat)
license-report --output=html | hcat
```

#### select fields for output:
```
# set options with command line options and config file
license-report --output=csv --config license-report-config.json
```
```
# example of config file for backward compatible output:
{
  "fields": [
    "department",
    "relatedTo",
    "name",
    "licensePeriod",
    "material",
    "licenseType",
    "link",
    "comment",
    "installedVersion",
    "author"
  ]
}
```

#### exclude packages:
```
license-report --exclude=async --exclude=rc
```

## Screenshots

![screenshot](screenshot.png)
![screenshot1](html.png)

## Available fields
Fields with data of the installed packages:
| fieldname | column title | data source |
|---|---|---|
| name | name | name of the package |
| licenseType | license type | type of the license of the package (e.g. MIT) |
| link | link | link to the repository of the package |
| remoteVersion | remote version | latest available version of the package (can be different from the installed version) |
| installedVersion | installed version | installed version of the package (can be different from the remote version) |
| definedVersion | defined version | version of the package as defined in the (dev-) dependencies entry (can start with a semver range character) |
| comment | comment | deprecated (replaced by field 'remoteVersion'); will be removed in a future version |
| author | author | author of the package |

Fields with data set in the configuration of license-report:
| fieldname | column title | set value |
|--|---|---|
| department | department | --department.value=kessler |
| relatedTo | related to | --relatedTo.value=stuff |
| licensePeriod | license period | --licensePeriod.value=perpetual |
| material | material / not material | --material.value=material |

## More configuration options
See lib/config.js for more details e.g. on customizing the generated html data.

Use [rc](https://github.com/dominictarr/rc) for further customization.

## Debug report generation

By setting the debug environment variable as follows, detailed log information is generated during the report generation. For details see the documentation of the debug package on npm.
```
export DEBUG=license-report*
```

![ironSource logo](ironsource.png)
