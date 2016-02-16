module.exports = function(json) {
	if (json.repository && json.repository.url) {
		return json.repository.url
	} else {
                return 'n/a';
        }
}