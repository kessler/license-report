const _ = require('lodash');
const table = require('text-table');

module.exports = getFormatter;

/**
 * Formats package information as json string.
 * @param dataAsArray - array of objects with information about dependencies / devdependencies in package.json
 * @param config - global configuration object
 * @returns dataAsArray formatted as json string
 */
function formatAsJsonString(dataAsArray, config) {
  return JSON.stringify(dataAsArray);
}

/**
 * Formats package information as table.
 * @param dataAsArray - array of objects with information about dependencies / devdependencies in package.json
 * @param config - global configuration object
 * @returns dataAsArray formatted as table string
 */
function formatAsTable(dataAsArray, config) {
  let data = arrayOfObjectsToArrayOfArrays(dataAsArray);
  let labels = [];
  let lines = [];

  // create a labels array and a lines array
  // the lines will be the same length as the label's
  for (let i = 0; i < config.fields.length; i++) {
    let label = config[config.fields[i]].label;
    labels.push(label);
    lines.push('-'.repeat(label.length));
  }
  
  data.unshift(lines);
  data.unshift(labels);

  return table(data);
} 

/**
 * Formats package information as csv string.
 * @param dataAsArray - array of objects with information about dependencies / devdependencies in package.json
 * @param config - global configuration object
 * @returns dataAsArray formatted as csv string
 */
function formatAsCsv(dataAsArray, config) {
  let data = arrayOfObjectsToArrayOfArrays(dataAsArray);
  let csv = [];
  
  if (config.csvHeaders) {
    csv.push(config.fields.join(config.delimiter));
  }

  for (const element of data) {
    csv.push(element.join(config.delimiter));
  }

  return csv.join('\n');
}

/**
 * Gets the formatter function for the style given.
 * Allowed styles: 'json', 'table', 'csc'.
 * Function signature: function(dataAsArray, config);
 * dataAsArray: array of objects with information about dependencies / devdependencies in package.json,
 * config: global configuration object
 * @param style - output style to be generated
 * @returns function to format the data; signature: function(dataAsArray, config)
 */
function getFormatter(style) {
  let formatter;
  switch (style) {
    case 'json':
      formatter = formatAsJsonString;
      break;
    case 'table':
      formatter = formatAsTable;
      break;
    case 'csv':
      formatter = formatAsCsv;
      break;
    default:
      throw new Error('invalid output format in config');
  }

  return formatter;
}

function arrayOfObjectsToArrayOfArrays (arrayOfObjects) {
  const arrayOfArrays = arrayOfObjects.map(objectElement => {
    let objectAsArray = _.toArray(objectElement)
    return objectAsArray.map(arrayElement => !isNullOrUndefined(arrayElement) ? arrayElement : 'n/a');
  });
  return arrayOfArrays;
}

function isNullOrUndefined(value) {
  return ((value === undefined) || (value === null));
}
