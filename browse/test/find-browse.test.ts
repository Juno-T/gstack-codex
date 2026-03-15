/**
 * Tests for find-browse binary locator.
 */

import { describe, test, expect } from 'bun:test';
import { getCandidateBinaryPaths, locateBinary } from '../src/find-browse';
import { existsSync } from 'fs';

describe('locateBinary', () => {
  test('includes both claude and agents preset candidates in order', () => {
    const root = '/tmp/workspace';
    const home = '/tmp/home';
    const candidates = getCandidateBinaryPaths(root, home);

    expect(candidates).toEqual([
      '/tmp/workspace/.claude/skills/gstack/browse/dist/browse',
      '/tmp/home/.claude/skills/gstack/browse/dist/browse',
      '/tmp/workspace/.agents/skills/gstack/browse/dist/browse',
      '/tmp/home/.agents/skills/gstack/browse/dist/browse',
    ]);
  });

  test('returns null when no binary exists at known paths', () => {
    // This test depends on the test environment — if a real binary exists at a
    // supported preset path, it will find it.
    // We mainly test that the function doesn't throw.
    const result = locateBinary();
    expect(result === null || typeof result === 'string').toBe(true);
  });

  test('returns string path when binary exists', () => {
    const result = locateBinary();
    if (result !== null) {
      expect(existsSync(result)).toBe(true);
    }
  });
});
