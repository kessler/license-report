# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.0.1](https://github.com/ironSource/license-report/compare/v5.0.0...v5.0.1) (2022-02-20)


### Features

* automatically create changelog from commit messages ([f9c1030](https://github.com/ironSource/license-report/commit/f9c103053378bb88db61715331ed8f0d208fcc95))


### Bug Fixes

* issue [#68](https://github.com/ironSource/license-report/issues/68) - evaluate string only author field ([4498bb7](https://github.com/ironSource/license-report/commit/4498bb7f9b5f74658118ee2cd96df443e5d95383))

## [5.0.0](https://github.com/ironSource/license-report///compare/v5.0.0...v4.5.0) (2021-09-09)


### ⚠ BREAKING CHANGES

* installed version shows actually installed version, not value from package.json without range character

### Features

* Allow fetching license info from peerDependencies and optionalDependencies too with `--only=prod,dev,opt,peer`
* allow versions like "nightly" and "latest"
* securely access private npm repositories with configuration variable `--npmTokenEnvVar` and authorization header with bearer token; show warning, if `--npmTokenEnvVar` is used as a config option
* add CHANGELOG.md to make changes visible to users

### Bug Fixes

* fixes typos in source code
* fixes sort order for `--output=table` and `--output=html`

## [4.5.0](https://github.com/ironSource/license-report/compare/v5.0.0...v4.5.0) (2022-02-19)


### Bug Fixes

* issue [#68](https://github.com/ironSource/license-report/issues/68) - evaluate string only author field ([4498bb7](https://github.com/ironSource/license-report/commit/4498bb7f9b5f74658118ee2cd96df443e5d95383))
