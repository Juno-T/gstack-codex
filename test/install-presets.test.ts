import { describe, expect, test } from 'bun:test';
import {
  candidateBrowseBinaries,
  candidateGstackDirs,
  installDocNames,
  resolveInstallPreset,
} from '../lib/install-presets';

describe('install presets', () => {
  test('resolves claude preset', () => {
    const preset = resolveInstallPreset('claude');
    expect(preset.dotDir).toBe('.claude');
    expect(preset.docFile).toBe('CLAUDE.md');
  });

  test('resolves agents preset', () => {
    const preset = resolveInstallPreset('agents');
    expect(preset.dotDir).toBe('.agents');
    expect(preset.docFile).toBe('AGENTS.md');
  });

  test('resolves codex preset', () => {
    const preset = resolveInstallPreset('codex');
    expect(preset.dotDir).toBe('.agents');
    expect(preset.docFile).toBe('AGENTS.md');
  });

  test('candidate gstack dirs include workspace and global locations for both presets', () => {
    expect(candidateGstackDirs('/repo', '/home/user')).toEqual([
      '/repo/.claude/skills/gstack',
      '/home/user/.claude/skills/gstack',
      '/repo/.agents/skills/gstack',
      '/home/user/.agents/skills/gstack',
    ]);
  });

  test('candidate browse binaries include workspace and global locations for both presets', () => {
    expect(candidateBrowseBinaries('/repo', '/home/user')).toEqual([
      '/repo/.claude/skills/gstack/browse/dist/browse',
      '/home/user/.claude/skills/gstack/browse/dist/browse',
      '/repo/.agents/skills/gstack/browse/dist/browse',
      '/home/user/.agents/skills/gstack/browse/dist/browse',
    ]);
  });

  test('install doc names include both supported assistant doc files', () => {
    expect(installDocNames()).toEqual(['CLAUDE.md', 'AGENTS.md']);
  });
});
