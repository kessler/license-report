const assert = require('assert')
const addLocalPackageDataToIndexData = require('../lib/addLocalPackageDataToIndexData.js')

describe('addLocalPackageDataToIndexData', () => {
  it('gets the package data for installed packages', () => {
    const packageLockDependency = { version: '6.2.3', resolved: 'https://registry.npmjs.org/mocha/-/mocha-6.2.3.tgz' }
    const depsIndexElement = { name: 'mocha', fullName: 'mocha', version: '^6.2.1' }
		addLocalPackageDataToIndexData(depsIndexElement, packageLockDependency)

		assert.strictEqual(depsIndexElement.installedVersion, '6.2.3')
  })

  it('gets the package data for local package', () => {
    const packageLockDependency = { version: 'file:local-libs/my-local-package' }
    const depsIndexElement = { name: 'my-local-package', fullName: 'my-local-package', version: 'file:local-libs/my-local-package' }
		addLocalPackageDataToIndexData(depsIndexElement, packageLockDependency)

		assert.strictEqual(depsIndexElement.installedVersion, 'file:local-libs/my-local-package')
  })

  it('gets versions with prebuild package', () => {
    const packageLockDependency = { version: '6.5.1-dev.1622493276948' }
    const depsIndexElement = { name: 'ol', fullName: 'ol', version: 'dev' }
		addLocalPackageDataToIndexData(depsIndexElement, packageLockDependency)

		assert.strictEqual(depsIndexElement.installedVersion, '6.5.1-dev.1622493276948')
  })

  it('gets versions with alias package', () => {
    const packageLockDependency = { version: 'npm:mocha@8.4.0' }
    const depsIndexElement = { name: 'mocha_8.3.1', fullName: 'mocha_8.3.1', version: 'npm:mocha@^8.3.1' }
		addLocalPackageDataToIndexData(depsIndexElement, packageLockDependency)

		assert.strictEqual(depsIndexElement.installedVersion, 'npm:mocha@8.4.0')
  })
})