const assert = require('assert')
const getInstalledVersions = require('../lib/getInstalledVersions.js')

describe('getInstalledVersions', () => {
  it('gets the list of versions for installed packages', () => {
    const packageLockContent = { dependencies: { mocha: { version: '6.2.3' } } }
    const depsIndex = [{ name: 'mocha', fullName: 'mocha', version: '^6.2.1' }]
		const installedVersions = getInstalledVersions(packageLockContent, depsIndex)

		assert.strictEqual(installedVersions['mocha'], '6.2.3')
  });

  it('gets versions with prebuild package', () => {
    const packageLockContent = { dependencies: { ol: { version: '6.5.1-dev.1622493276948' } } }
    const depsIndex = [{ name: 'ol', fullName: 'ol', version: 'dev' }]
		const installedVersions = getInstalledVersions(packageLockContent, depsIndex)

		assert.strictEqual(installedVersions['ol'], '6.5.1-dev.1622493276948')
  });

  it('gets versions with alias package', () => {
    const packageLockContent = { dependencies: { 'mocha_8.3.1': { version: 'npm:mocha@8.4.0' } } }
    const depsIndex = [{ name: 'mocha_8.3.1', fullName: 'mocha_8.3.1', version: 'npm:mocha@^8.3.1' }]
		const installedVersions = getInstalledVersions(packageLockContent, depsIndex)

		assert.strictEqual(installedVersions['mocha_8.3.1'], 'npm:mocha@8.4.0')
  });
});