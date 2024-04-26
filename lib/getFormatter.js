import fs from 'node:fs';
import table from 'text-table';
import tableify from '@kessler/tableify';
import tablemark from 'tablemark';

/**
 * Formats package information as json string.
 * @param dataAsArray - array of objects with information about dependencies / devdependencies in package.json
 * @param config - global configuration object
 * @returns dataAsArray formatted as json string
 */
function formatAsJsonString(dataAsArray, config) {
	return JSON.stringify(dataAsArray)
}

/**
 * Formats package information as table.
 * @param dataAsArray - array of objects with information about dependencies / devdependencies in package.json
 * @param config - global configuration object
 * @returns dataAsArray formatted as table string
 */
function formatAsTable(dataAsArray, config) {
	const fieldsList = Array.isArray(config.fields) ? config.fields : [config.fields]
	let data = arrayOfObjectsToArrayOfArrays(dataAsArray)
	let labels = []
	let lines = []

	// create a labels array and a lines array
	// the lines will be the same length as the label's
	for (let i = 0; i < fieldsList.length; i++) {
		let label = config[fieldsList[i]].label
		labels.push(label)
		lines.push('-'.repeat(label.length))
	}

	data.unshift(lines)
	data.unshift(labels)

	return table(data)
}

/**
 * Formats package information as csv string.
 * The names of the properties are used as column headers (if config.csvHeaders is true).
 * @param dataAsArray - array of objects with information about dependencies / devdependencies in package.json
 * @param config - global configuration object
 * @returns dataAsArray formatted as csv string
 */
function formatAsCsv(dataAsArray, config) {
	const fieldsList = Array.isArray(config.fields) ? config.fields : [config.fields]
	let data = arrayOfObjectsToArrayOfArrays(dataAsArray)
	let csv = []
	const delimiter = config.delimiter
	const escapeFields = config.escapeCsvFields

	if (config.csvHeaders) {
		let labels = []
		// create a labels array and a lines array
		for (let i = 0; i < fieldsList.length; i++) {
			labels.push(config[fieldsList[i]].label)
		}
		csv.push(labels.join(delimiter))
	}

	for (const element of data) {
		const validatedFields = element.map(fieldValue => {
			let validatedField = fieldValue
			if (fieldValue.includes(delimiter)) {
				console.warn(`Warning: field contains delimiter; value: "${fieldValue}"`)
				if (escapeFields) {
					validatedField = `"${fieldValue}"`
				}
			}
			return validatedField
		})

		csv.push(validatedFields.join(delimiter))
	}

	return csv.join('\n')
}

/**
 * Formats package information as html. The names of the properties are used as column headers.
 * To use the labels of the properties set in config as headers, the properties are renamed.
 * @param dataAsArray - array of objects with information about dependencies / devdependencies in package.json
 * @param config - global configuration object
 * @returns dataAsArray formatted as html
 */
function formatAsHTML(dataAsArray, config) {
	let rowsToBeDisplayed
	if (dataAsArray.length > 0) {
		rowsToBeDisplayed = dataAsArray.map(row => renameRowsProperties(row, config))
	} else {
		rowsToBeDisplayed = [ dataArrayWithEmptyRow(config) ]
	}

	return tableify.htmlDoc(rowsToBeDisplayed, config.html.tableify, fs.readFileSync(config.html.cssFile))
}

/**
 * Formats package information as a markdown table. The names of the properties are used as column headers.
 * @param dataAsArray - array of objects with information about dependencies / devdependencies in package.json
 * @param config - global configuration object
 * @returns dataAsArray formatted as a markdown table
 */
function formatAsMarkdown(dataAsArray, config) {
	let result = ''
	if (dataAsArray.length > 0) {
		// Respect the possibly overridden field names
		const dataAsArrayWithRenamedFields = dataAsArray.map(row => renameRowsProperties(row, config))
		result = tablemark(dataAsArrayWithRenamedFields, config.tablemarkOptions)
	}

	return result
  }

/**
 * Gets the formatter function for the style given.
 * Allowed styles: 'json', 'table', 'csc'.
 * Function signature: function(dataAsArray, config)
 * dataAsArray: array of objects with information about dependencies / devdependencies in package.json,
 * config: global configuration object
 * @param style - output style to be generated
 * @returns function to format the data; signature: function(dataAsArray, config)
 */
export function getFormatter(style) {
	let formatter
	switch (style) {
		case 'json':
			formatter = formatAsJsonString
			break
		case 'table':
			formatter = formatAsTable
			break
		case 'csv':
			formatter = formatAsCsv
			break
		case 'html':
			formatter = formatAsHTML
			break
		case 'markdown':
			formatter = formatAsMarkdown
			break
		default:
			throw new Error('invalid output format in config')
	}

	return formatter
}

function arrayOfObjectsToArrayOfArrays(arrayOfObjects) {
	const arrayOfArrays = arrayOfObjects.map(objectElement => {
		let objectAsArray = Object.values(objectElement)
		return objectAsArray.map(arrayElement => !isNullOrUndefined(arrayElement) ? arrayElement : 'n/a')
	})
	return arrayOfArrays
}

function isNullOrUndefined(value) {
	return ((value === undefined) || (value === null))
}

/**
 * Rename the property of an object
 * @param {string} oldProp - old name of the property
 * @param {string} newProp - new name of the property
 * @param {object} anonymous - object with the property to be renamed
 * @returns {object} object with the renamed property
 */
function renameProp(oldProp, newProp, { [oldProp]: old, ...others }) {
  const newObject = {[newProp]:old, ...others}
  return newObject
}

/**
 * Rename each property of row with the value of its label from config
 * @param {object} row - object with data of one row to be displayed
 * @param {object} config - configuration object
 */
function renameRowsProperties(row, config) {
	const fieldsList = Array.isArray(config.fields) ? config.fields : [config.fields]
	let renamedRow = row
	for (let i = fieldsList.length - 1; i >= 0; i--) {
		const fieldname = fieldsList[i];
		renamedRow = renameProp(fieldname, config[fieldname].label, renamedRow)
	}
	return renamedRow
}

/**
 * Create an object with one property for every field listed in config.fields;
 * the properties value is always an empty space character
 * The order of the fields is inverse, as renameRowsProperties used in formatAsHTML
 * reverses the order of the fields in the object
 * @param {object} config - configuration object
 * @returns {object} dummy entry with one space as value
 */
function dataArrayWithEmptyRow(config) {
	const fieldsList = Array.isArray(config.fields) ? config.fields : [config.fields]
	let emptyRow = {}
	// create an array with 1 line of empty entries, to display empty table with header
	for (let i = fieldsList.length - 1; i >= 0; i--) {
		let label = config[fieldsList[i]].label
		emptyRow[label] = ' '
	}
	return emptyRow
}
