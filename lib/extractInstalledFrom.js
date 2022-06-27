module.exports = function(json) {
	if (json.dist && json.dist.tarball) {
		return json.dist.tarball
	}
}