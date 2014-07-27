# license report tool

generate license report of a project's dependencies

### install 
```
	npm install -g license-report
```

### usage
simple:
```
	license-report --package=/path/to/package.json
```
customize a field's label:
```
	license-report --package=/path/to/package.json --report.label.department=division
```
customize a default value (only applicable for some fields):
```
	license-report --package=/path/to/package.json --department.label=division --department.value=ninjaSquad
```
another registry:
```
	license-report --package=/path/to/package.json --registry=https://myregistry.com/
```
different outputs:
```
	license-report --package=/path/to/package.json --output=table
	license-report --package=/path/to/package.json --output=json
	license-report --package=/path/to/package.json --output=csv
	license-report --package=/path/to/package.json --output=csv --delimiter="|"
```
exclude (TBD):
```
	license-report --package=/path/to/package.json --excluse=async --exclude=rc
```

see lib/config.js for more details

use [rc](https://github.com/dominictarr/rc) for further customization