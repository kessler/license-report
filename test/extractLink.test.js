import assert from 'node:assert';
import { describe, it } from 'node:test';
import { extractLink } from '../lib/extractLink.js';

describe('extractLink', () => {
  it('extracts the repository link if its there', () => {
    const link = extractLink({ repository: { url: 'http://lala.com' } });
    assert.strictEqual(link, 'http://lala.com');
  });

  it('search for another http link if repo link is not there', () => {
    const link = extractLink({ url: 'http://lala.com' });
    assert.strictEqual(link, 'http://lala.com');
  });

  it('returns nothing otherwise', () => {
    const link = extractLink({ url: 'lala.com' });
    assert(!link);
  });
});
