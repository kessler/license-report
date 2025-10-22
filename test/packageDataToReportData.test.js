import assert from 'node:assert';
import { describe, it } from 'node:test';
import { packageDataToReportData } from '../lib/packageDataToReportData.js';

describe('packageDataToReportData', () => {
  it('generates the final raw data for default fields', async () => {
    const config = {
      fields: ['name', 'licenseType'],
    };

    const packageData = {
      name: 'lodash',
      installedVersion: '4.17.21',
      author: 'John-David Dalton <john.david.dalton@gmail.com>',
      licenseType: 'MIT',
      link: 'git+https://github.com/lodash/lodash.git',
      installedFrom: 'https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz',
      definedVersion: '^4.17.20',
      remoteVersion: '4.17.21',
      latestRemoteVersion: '4.17.21',
      latestRemoteModified: '2024-09-05T10:52:45.342Z',
      comment: '4.17.21',
    };

    const expectedResult = {
      name: 'lodash',
      licenseType: 'MIT',
    };

    const finalData = packageDataToReportData(packageData, config);

    assert.ok(finalData);
    assert.deepStrictEqual(finalData, expectedResult);
  });

  it('generates the final raw data for custom field', async () => {
    const config = {
      fields: ['name', 'licenseType', 'repository'],
      repository: {
        url: {
          label: 'RepoUrl',
          value: 'na',
        },
      },
    };

    const packageData = {
      name: 'lodash',
      installedVersion: '4.17.21',
      author: 'John-David Dalton <john.david.dalton@gmail.com>',
      licenseType: 'MIT',
      link: 'git+https://github.com/lodash/lodash.git',
      installedFrom: 'https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz',
      definedVersion: '^4.17.20',
      remoteVersion: '4.17.21',
      latestRemoteVersion: '4.17.21',
      latestRemoteModified: '2024-09-05T10:52:45.342Z',
      comment: '4.17.21',
      repository: 'lodash/lodash',
    };

    const expectedResult = {
      name: 'lodash',
      licenseType: 'MIT',
      repository: 'lodash/lodash',
    };

    const finalData = packageDataToReportData(packageData, config);

    assert.ok(finalData);
    assert.deepStrictEqual(finalData, expectedResult);
  });

  it('generates the final raw data for custom nested field', async () => {
    const config = {
      fields: ['name', 'licenseType', 'repository.url'],
      repository: {
        url: {
          label: 'RepoUrl',
          value: 'na',
        },
      },
    };

    const packageData = {
      name: 'lodash',
      installedVersion: '4.17.21',
      author: 'John-David Dalton <john.david.dalton@gmail.com>',
      licenseType: 'MIT',
      link: 'git+https://github.com/lodash/lodash.git',
      installedFrom: 'https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz',
      definedVersion: '^4.17.20',
      remoteVersion: '4.17.21',
      latestRemoteVersion: '4.17.21',
      latestRemoteModified: '2024-09-05T10:52:45.342Z',
      comment: '4.17.21',
      'repository.url': 'git@github.com:colorjs/my-local-package.git',
    };

    const expectedResult = {
      name: 'lodash',
      licenseType: 'MIT',
      'repository.url': 'git@github.com:colorjs/my-local-package.git',
    };

    const finalData = packageDataToReportData(packageData, config);

    assert.ok(finalData);
    assert.deepStrictEqual(finalData, expectedResult);
  });
});
