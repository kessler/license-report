const assert = require('assert')
const getInstalledPackagesData = require('../lib/getInstalledPackagesData.js')

describe('getInstalledPackagesData', () => {
  it('gets the package data for installed packages', () => {
    const packageLockContent = { dependencies: {  mocha: { version: '6.2.3', resolved: 'https://registry.npmjs.org/mocha/-/mocha-6.2.3.tgz' } } }
    const depsIndex = [{ name: 'mocha', fullName: 'mocha', version: '^6.2.1' }]
		const installedPackagesData = getInstalledPackagesData(packageLockContent, depsIndex)

		assert.strictEqual(installedPackagesData['mocha'].version, '6.2.3')
    assert.strictEqual(installedPackagesData['mocha'].installedFrom, 'https://registry.npmjs.org/mocha/-/mocha-6.2.3.tgz')
  })

  it('gets versions with prebuild package', () => {
    const packageLockContent = { dependencies: { ol: { version: '6.5.1-dev.1622493276948' } } }
    const depsIndex = [{ name: 'ol', fullName: 'ol', version: 'dev' }]
		const installedPackagesData = getInstalledPackagesData(packageLockContent, depsIndex)

		assert.strictEqual(installedPackagesData['ol'].version, '6.5.1-dev.1622493276948')
  })

  it('gets versions with alias package', () => {
    const packageLockContent = { dependencies: { 'mocha_8.3.1': { version: 'npm:mocha@8.4.0' } } }
    const depsIndex = [{ name: 'mocha_8.3.1', fullName: 'mocha_8.3.1', version: 'npm:mocha@^8.3.1' }]
		const installedPackagesData = getInstalledPackagesData(packageLockContent, depsIndex)

		assert.strictEqual(installedPackagesData['mocha_8.3.1'].version, 'npm:mocha@8.4.0')
  })
})