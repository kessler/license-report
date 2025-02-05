import assert from 'node:assert';
import { joinUrlPath } from '../lib/util.js';

describe('util', () => {
  it('joins "https://registry.npmjs.org/" and "semver" to uri', () => {
    const uri = joinUrlPath('https://registry.npmjs.org/', 'semver');
    assert.strictEqual(uri, 'https://registry.npmjs.org/semver');
  });

  it('joins "https://registry.npmjs.org" and "semver" to uri', () => {
    const uri = joinUrlPath('https://registry.npmjs.org', 'semver');
    assert.strictEqual(uri, 'https://registry.npmjs.org/semver');
  });

  it('joins "https://registry.npmjs.org/" and "/semver" to uri', () => {
    const uri = joinUrlPath('https://registry.npmjs.org/', '/semver');
    assert.strictEqual(uri, 'https://registry.npmjs.org/semver');
  });

  it('joins "https://registry.npmjs.org" and "/semver" to uri', () => {
    const uri = joinUrlPath('https://registry.npmjs.org', '/semver');
    assert.strictEqual(uri, 'https://registry.npmjs.org/semver');
  });
});
