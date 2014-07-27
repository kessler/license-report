var child = require('child_process')
var assert = require('assert')

run()

function run() {
	var c = child.exec('node index.js -p ./package.json', function(err, stdout, stderr) {
		console.log(stdout)
	})
}