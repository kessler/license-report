import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginJson from 'eslint-plugin-json';
import pluginMocha from 'eslint-plugin-mocha';
import pluginNode from 'eslint-plugin-n';
import pluginChaiExpect from 'eslint-plugin-chai-expect';
import pluginSecurity from 'eslint-plugin-security';
import pluginSecurityNode from 'eslint-plugin-security-node';
// TODO wait for eslint-plugin-import to be usable in eslint v9; corresponding
// issue see https://github.com/import-js/eslint-plugin-import/issues/2948

export default [{
  ignores: ["**/.vscode/"],
  }, 
  pluginJs.configs.recommended,
  pluginJsdoc.configs['flat/recommended'],
  pluginMocha.configs.flat.recommended,
  pluginNode.configs['flat/recommended-module'],
  pluginChaiExpect.configs['recommended-flat'],
  pluginSecurity.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
        ...globals.mocha,
      },
    },
    plugins: {
      'security-node': pluginSecurityNode
    },
    rules: {
      'mocha/no-mocha-arrows': 'off',
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-object-injection': 'off',
      ...pluginSecurityNode.configs.recommended.rules,
      // disable redundant checks (already exists as security/detect-possible-timing-attacks)
      'security-node/detect-possible-timing-attacks': 'off',
      'security-node/non-literal-reg-expr': 'off'
    },
  },
  {
    files: ['**/*.json'],
    ignores: ['**/.vscode/launch.json'],
    plugins: {
      pluginJson,
    },
    processor: pluginJson.processors['.json'],
    rules: {
      'pluginJson/*': ['error', { allowComments: true }],
    },
  },
];
