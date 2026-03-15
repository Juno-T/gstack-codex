/**
 * find-browse — locate the gstack browse binary.
 *
 * Compiled to browse/dist/find-browse (standalone binary, no bun runtime needed).
 * Outputs the absolute path to the browse binary on stdout, or exits 1 if not found.
 */

import { existsSync } from 'fs';
import { homedir } from 'os';
import { candidateBrowseBinaries } from '../../lib/install-presets';

// ─── Binary Discovery ───────────────────────────────────────────

function getGitRoot(): string | null {
  try {
    const proc = Bun.spawnSync(['git', 'rev-parse', '--show-toplevel'], {
      stdout: 'pipe',
      stderr: 'pipe',
    });
    if (proc.exitCode !== 0) return null;
    return proc.stdout.toString().trim();
  } catch {
    return null;
  }
}

export function getCandidateBinaryPaths(root: string | null = getGitRoot(), home: string = homedir()): string[] {
  return candidateBrowseBinaries(root, home);
}

export function locateBinary(root: string | null = getGitRoot(), home: string = homedir()): string | null {
  for (const candidate of getCandidateBinaryPaths(root, home)) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

// ─── Main ───────────────────────────────────────────────────────

function main() {
  const bin = locateBinary();
  if (!bin) {
    process.stderr.write('ERROR: browse binary not found. Run: cd <skill-dir> && ./setup\n');
    process.exit(1);
  }

  console.log(bin);
}

if (import.meta.main) {
  main();
}
