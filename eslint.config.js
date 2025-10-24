import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginJson from 'eslint-plugin-json';
import pluginNode from 'eslint-plugin-n';
import pluginChaiExpect from 'eslint-plugin-chai-expect';
import pluginSecurity from 'eslint-plugin-security';
import pluginSecurityNode from 'eslint-plugin-security-node';
export default [
  {
    ignores: ['**/.vscode/'],
  },
  pluginJs.configs.recommended,
  pluginJsdoc.configs['flat/recommended'],
  pluginNode.configs['flat/recommended-module'],
  pluginChaiExpect.configs['recommended-flat'],
  pluginSecurity.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
    plugins: {
      'security-node': pluginSecurityNode,
    },
    rules: {
      'n/no-unsupported-features/node-builtins': [
        'error',
        { ignores: ['test.describe'] },
      ],
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-object-injection': 'off',
      ...pluginSecurityNode.configs.recommended.rules,
      // disable redundant checks (already exists as security/detect-possible-timing-attacks)
      'security-node/detect-possible-timing-attacks': 'off',
      'security-node/non-literal-reg-expr': 'off',
      'jsdoc/reject-any-type': 'off',
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
