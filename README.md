# license report tool
generate license report of a project's dependencies

### install 
```
npm install -g license-report
```

### usage

#### simple:
```
cd your/project/
license-report
```
by default, `license-report` outputs all licenses from `dependencies` and `devDependencies`.
To specify one or the other, use `--only`
```
license-report --only=dev
```
```
license-report --only=prod
```

#### explicit package.json:
```
license-report --package=/path/to/package.json
```

#### customize a field's label:
```
license-report --report.label.department=division
```

#### customize a default value (only applicable for some fields):
```
license-report --department.label=division --department.value=ninjaSquad
```

#### another registry:
```
license-report --registry=https://myregistry.com/
```

#### different outputs:
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

#### exclude:
```
license-report --exclude=async --exclude=rc
```

### screenshots

![screenshot](screenshot.png)
![screenshot1](html.png)

### available fields
Fields with data of the installed packages:
| fieldname | column title | data source |
|---|---|---|
| name | name | name of the package |
| licenseType | license type | type of the license of the package (e.g. MIT) |
| link | link | link to the repository of the package |
| comment | comment | latest available version of the package (can be different from the installed version) |

Fields with data set in the configuration of license-report:
| fieldname | column title | set value |
|--|---|---|
| department | department | --department.value=kessler |
| relatedTo | related to | --relatedTo.value=stuff |
| licensePeriod | license period | --licensePeriod.value=perpetual |
| material | material / not material | --material.value=material |

### debug
```
export DEBUG=license-report*
```

see lib/config.js for more details

use [rc](https://github.com/dominictarr/rc) for further customization

![ironSource logo](ironsource.png)
