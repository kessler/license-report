const assert = require('assert')
const getPackageJson = require('../lib/getPackageJson.js')

describe('getPackageJson', () => {
  it('gets the information about the package "semver" from server', async () => {
    const packageJson = await getPackageJson('semver')
    assert.strictEqual(packageJson.homepage, 'https://github.com/npm/node-semver#readme')
  })

  it('gets empty object for non existing package', async () => {
    const packageJson = await getPackageJson('packagedoesnotexist')
    assert.deepEqual(packageJson, {})
  })
})