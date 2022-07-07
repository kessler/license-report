/**
 * Extract author from content of a package.json file
 * @param {object} packageJSONContent - content of package.json for 1 package
 * @returns {string} with name of author of a package
 */
function extractAuthor(packageJSONContent) {
	let author = 'n/a'
	if (isObject(packageJSONContent.author)) {
		author = packageJSONContent.author.name || ''
		if (packageJSONContent.author.email) {
			if (author.length > 0) {
				author += ' ';
			}
			author += packageJSONContent.author.email;
		}

		if (packageJSONContent.author.url) {
			if (author.length > 0){
				author += ' ';
			}
			author += packageJSONContent.author.url;
		}
	} else {
		if ((typeof packageJSONContent.author === 'string') || (packageJSONContent.author instanceof String)) {
			author = packageJSONContent.author;
		}
	}

	return author
}

function isObject(element) {
	return ((element !== null) && ((typeof element === "object") || (typeof element === 'function')))
}

export default extractAuthor;
