# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.1.0](https://github.com/ironSource/license-report/compare/v5.0.2...v5.1.0) (2022-06-04)


### Features

* add support for installedFrom field ([207f167](https://github.com/ironSource/license-report/commit/207f167b4492e45f34a8554f026cdb5c97e4888b))


### Bug Fixes

* add error handling for requests to the registry ([cb7123a](https://github.com/ironSource/license-report/commit/cb7123a055238827ed3a4d71cadff9de60e42156)), closes [#85](https://github.com/ironSource/license-report/issues/85)
* broken e2e tests due to changed ownership for debug-js ([25d754e](https://github.com/ironSource/license-report/commit/25d754ed342b94af01b5bc96a5692495d8d687ce))
* fix missing variable declaration ([f4a64eb](https://github.com/ironSource/license-report/commit/f4a64eb5db57e42908dacb4148f93c5be7757207))
* remove typo in error message ([2cd5475](https://github.com/ironSource/license-report/commit/2cd547517af40b4f1b72b458c6f7d8be7218c6bf))

### [5.0.2](https://github.com/ironSource/license-report/compare/v5.0.1...v5.0.2) (2022-03-11)


### Bug Fixes

* issue [#72](https://github.com/ironSource/license-report/issues/72) (Cannot read property 'version' of undefined) ([dec72d1](https://github.com/ironSource/license-report/commit/dec72d1c5828f89219dacdd2c2e8c9b808c63142))

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
