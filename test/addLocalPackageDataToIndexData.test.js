const assert = require('assert')
const path = require('path')
const addLocalPackageDataToIndexData = require('../lib/addLocalPackageDataToIndexData.js')

describe('addLocalPackageDataToIndexData', function() {
  let projectRootPath

  beforeEach(() => {
    projectRootPath = path
      .resolve(__dirname, 'fixture', 'add-local-data')
      .replace(/(\s+)/g, '\\$1')
  })

  it('adds package data for package', async () => {
    const depsIndexElement = {
			fullName: 'mypackage',
			alias: 'mypackage',
			name: 'mypackage',
			version: '~9.8.1'
    }
    await addLocalPackageDataToIndexData(depsIndexElement, projectRootPath)

    assert.ok(depsIndexElement.installedVersion)
    assert.strictEqual(depsIndexElement.installedVersion, '9.8.7')
  })

  it('adds package data for scoped package', async () => {
    const depsIndexElement = {
			fullName: '@test/testpackage',
			alias: '@test/testpackage',
			name: 'testpackage',
			version: '^1.2.0',
			scope: '@test'
    }
    await addLocalPackageDataToIndexData(depsIndexElement, projectRootPath)

    assert.ok(depsIndexElement.installedVersion)
    assert.strictEqual(depsIndexElement.installedVersion, '1.2.3')
  })

  it('adds package data for local package', async () => {
    const depsIndexElement = {
      fullName: 'my-local-package',
      alias: 'my-local-package',
      name: 'my-local-package',
      version: 'file:local-libs/my-local-package'
    }
		await addLocalPackageDataToIndexData(depsIndexElement, projectRootPath)

    assert.ok(depsIndexElement.installedVersion)
    assert.strictEqual(depsIndexElement.installedVersion, '3.4.5')
  })

  it('gets versions with prebuild package', async () => {
    const depsIndexElement = {
      fullName: 'ol',
      alias: 'ol',
      name: 'ol',
      version: 'dev'
    }
		await addLocalPackageDataToIndexData(depsIndexElement, projectRootPath)

    assert.ok(depsIndexElement.installedVersion)
		assert.strictEqual(depsIndexElement.installedVersion, '6.5.1-dev.1622493276948')
  })

  it('gets versions with alias package', async () => {
    const depsIndexElement = {
      fullName: 'mocha',
      alias: 'my-mocha',
      name: 'mocha',
      version: '^8.3.1'
    }
		await addLocalPackageDataToIndexData(depsIndexElement, projectRootPath)

    assert.ok(depsIndexElement.installedVersion)
		assert.strictEqual(depsIndexElement.installedVersion, '8.3.1')
  })

  it('adds package data for not installed package', async () => {
    const depsIndexElement = {
			fullName: 'not-installed-package',
			alias: 'not-installed-package',
			name: 'not-installed-package',
			version: '~1.0.2'
    }
    await addLocalPackageDataToIndexData(depsIndexElement, projectRootPath)

    assert.ok(depsIndexElement.installedVersion)
    assert.strictEqual(depsIndexElement.installedVersion, 'n/a')
  })
})