# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.1.0](https://github.com/ironSource/license-report/compare/v6.0.0...v6.1.0) (2022-07-31)


### Features

* add new optional fields with data from registry ([ead1a55](https://github.com/ironSource/license-report/commit/ead1a550d212a030e657fef71f245d2299c76d08))


### Bug Fixes

* issue [#101](https://github.com/ironSource/license-report/issues/101) (config.registry without trailing slash throws an error) ([76525ed](https://github.com/ironSource/license-report/commit/76525ed1a411fc007e4ea655c17fcef042c789f8))

## [6.0.0](https://github.com/ironSource/license-report/compare/v5.1.0...v6.0.0) (2022-07-07)


### ⚠ BREAKING CHANGES

* update 'got' to v12; this requires switching to esm
modules and dropping support for node versions prior to Node v14 (which
are all out of maintenance status by now).
* get the installed version, the author and the
license type from the node_modules directory instead of from
the package-lock.json file.


### Bug Fixes

* add default request timeout ([fce9e05](https://github.com/ironSource/license-report/commit/fce9e051170711f680aba53e3f23003a1300af39))
* add missing fieldnames in command line help text ([d29c8a1](https://github.com/ironSource/license-report/commit/d29c8a1ebf0da0c058fb0d70c47ce2f6ab290f0a))
* return 'n/a' when no license property is found in repository data ([1ffe505](https://github.com/ironSource/license-report/commit/1ffe5055086e67646f6f1d0d9f5b9667d3564bd3))

## [5.1.0](https://github.com/ironSource/license-report/compare/v5.0.2...v5.1.0) (2022-06-04)


### Features

* add support for installedFrom field ([207f167](https://github.com/ironSource/license-report/commit/207f167b4492e45f34a8554f026cdb5c97e4888b))


### Bug Fixes

* add error handling for requests to the registry ([cb7123a](https://github.com/ironSource/license-report/commit/cb7123a055238827ed3a4d71cadff9de60e42156)), closes [#85](https://github.com/ironSource/license-report/issues/85)
* fix broken e2e tests due to changed ownership for debug-js ([25d754e](https://github.com/ironSource/license-report/commit/25d754ed342b94af01b5bc96a5692495d8d687ce))
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
