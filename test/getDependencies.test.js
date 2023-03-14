// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import path from 'node:path';
import url from 'node:url';
import assert from 'node:assert';

import getDependencies from '../lib/getDependencies.js';
import util from '../lib/util.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const packageJsonPath = path
	.resolve(__dirname, 'fixture', 'default-fields', 'package.json')
	.replace(/(\s+)/g, '\\$1')

	// test data for test using package.json with empty dependencies
const emptyDepsPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'dependencies', 'empty-dependency-package.json')
	.replace(/(\s+)/g, '\\$1')
// test data for test using package.json with no dependencies
const noDepsPackageJsonPath = path
	.resolve(__dirname, 'fixture', 'dependencies', 'no-dependency-package.json')
	.replace(/(\s+)/g, '\\$1')

describe('getDependencies', () => {
	let packageJson

	beforeEach(async () => {
		packageJson = await util.readJson(packageJsonPath)
	})

	it('adds all dependency types to output (no "depsType" parameter)', () => {
		const exclusions = []
    let depsIndex = getDependencies(packageJson, exclusions)

		assert.strictEqual(depsIndex.length, 4)
	})

	it('adds all dependency types to output (empty "depsType" parameter)', () => {
		const exclusions = []
    let depsIndex = getDependencies(packageJson, exclusions, [])

		assert.strictEqual(depsIndex.length, 4)
	})

	it('adds dependencies to output', () => {
		const exclusions = []
    let depsIndex = getDependencies(packageJson, exclusions, ['prod'])

		assert.strictEqual(depsIndex.length, 1)
		assert.strictEqual(depsIndex[0].fullName, '@kessler/tableify')
	})

	it('adds optionalDependencies to output', () => {
		const exclusions = []
    let depsIndex = getDependencies(packageJson, exclusions, ['opt'])

		assert.strictEqual(depsIndex.length, 1)
		assert.strictEqual(depsIndex[0].fullName, 'semver')
	})

	it('adds dependencies and optionalDependencies to output', () => {
		const exclusions = []
    let depsIndex = getDependencies(packageJson, exclusions, ['prod', 'opt'])

		assert.strictEqual(depsIndex.length, 2)
		assert.strictEqual(depsIndex[0].fullName, '@kessler/tableify')
		assert.strictEqual(depsIndex[1].fullName, 'semver')
	})

	it('adds peerDependencies to output', () => {
		const exclusions = []
    let depsIndex = getDependencies(packageJson, exclusions, ['peer'])

		assert.strictEqual(depsIndex.length, 1)
		assert.strictEqual(depsIndex[0].fullName, 'lodash')
	})

	it('adds dependencies to output for empty dependencies property', () => {
		const exclusions = []
    let depsIndex = getDependencies(emptyDepsPackageJsonPath, exclusions)

		assert.strictEqual(depsIndex.length, 0)
	})

	it('adds all dependency to output for missing dependencies properties', () => {
		const exclusions = []
    let depsIndex = getDependencies(noDepsPackageJsonPath, exclusions)

		assert.strictEqual(depsIndex.length, 0)
	})
});
