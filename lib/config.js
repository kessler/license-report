import path from 'node:path';
import url from 'node:url';
import rc from 'rc';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const config = rc('license-report', {
  /*
		possible outputs:

		json || table || csv || html || markdown
	*/
  output: 'json',

  /*
		if output is html
	*/
  html: {
    cssFile: path.resolve(__dirname, '..', 'defaultHtmlStyle.css'),

    // passed directly to tableify (see: https://github.com/kessler/node-tableify)
    tableify: {},
  },

  /*
		if output is csv
	*/
  delimiter: ',',

  /*
    if output is a markdown table.
    See https://github.com/haltcase/tablemark for details.
  */
  tablemarkOptions: {},

  /*
		escape fields containing delimiter character if output is csv
	*/
  escapeCsvFields: false,

  /*
		export deps or dev deps. falsy -> output everything
		possible values (as csv without whitespace):
		prod || dev || opt || peer
	*/
  only: null,

  /*
		npm registry url
	*/
  registry: 'https://registry.npmjs.org/',

  /*
		use .npmrc file to find the registry for scoped packages;
		if no .npmrc file exists or when no registry is defined
		for a scope, the entry 'registry' in the config file is used;
    the path to the .npmrc file can be defined with a --npmrc
    config setting
	*/
  useNpmrc: false,

  /*
		name of the environment variable holding the access token for private npm registries
	*/
  npmTokenEnvVar: 'NPM_TOKEN',

  /*
		an array of package names that will be excluded from the report
	*/
  exclude: [],

  /*
		a regular expression of package names that will be excluded from the report;
		the regex string must not start or end with a forward slash (e.g. '^@bepo65\/.*')
	*/
  excludeRegex: '',

  /*
    how many times will license-report try to connect
    to the registry server
  */
  httpRetryOptions: {
    limit: 5,
  },

  /*
    how long (in milliseconds) will license-report wait for
    the response for a request to the registry server
  */
  httpTimeoutOptions: {
    request: 30000,
  },

  /*
		fields participating in the report and their order
	*/
  fields: [
    'department',
    'relatedTo',
    'name',
    'licensePeriod',
    'material',
    'licenseType',
    'link',
    'remoteVersion',
    'installedVersion',
    'definedVersion',
    'author',
  ],

  department: {
    value: 'kessler',
    label: 'department',
  },
  relatedTo: {
    value: 'stuff',
    label: 'related to',
  },
  licensePeriod: {
    value: 'perpetual',
    label: 'license period',
  },
  material: {
    value: 'material',
    label: 'material / not material',
  },
  name: {
    value: '',
    label: 'name',
  },
  licenseType: {
    value: 'n/a',
    label: 'license type',
  },
  link: {
    value: 'n/a',
    label: 'link',
  },
  installedFrom: {
    value: 'n/a',
    label: 'installed from',
  },
  remoteVersion: {
    value: '',
    label: 'remote version',
  },
  installedVersion: {
    value: 'n/a',
    label: 'installed version',
  },
  definedVersion: {
    value: 'n/a',
    label: 'defined version',
  },
  latestRemoteVersion: {
    value: 'n/a',
    label: 'latest remote version',
  },
  latestRemoteModified: {
    value: 'n/a',
    label: 'latest remote modified',
  },
  author: {
    value: 'n/a',
    label: 'author',
  },
  comment: {
    value: '',
    label: 'comment',
  },
});
