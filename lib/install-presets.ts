import * as fs from 'fs';
import * as path from 'path';

export interface InstallPreset {
  name: string;
  dotDir: string;
  docFile: string;
  skillsDir: string;
}

const PRESETS_FILE = path.join(import.meta.dir, '..', 'config', 'install-presets.tsv');
let cachedPresets: InstallPreset[] | null = null;

function parsePresets(): InstallPreset[] {
  const raw = fs.readFileSync(PRESETS_FILE, 'utf-8').trim();
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  const [headerLine, ...dataLines] = lines;
  const headers = headerLine.split('\t');

  return dataLines.map((line) => {
    const values = line.split('\t');
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    return {
      name: row.preset,
      dotDir: row.dot_dir,
      docFile: row.doc_file,
      skillsDir: row.skills_dir,
    };
  });
}

export function listInstallPresets(): InstallPreset[] {
  if (!cachedPresets) {
    cachedPresets = parsePresets();
  }
  return cachedPresets;
}

export function resolveInstallPreset(name = process.env.GSTACK_INSTALL_PRESET || 'claude'): InstallPreset {
  const preset = listInstallPresets().find((item) => item.name === name);
  if (!preset) {
    throw new Error(`Unknown install preset "${name}"`);
  }
  return preset;
}

export function workspaceGstackDir(root: string, preset: InstallPreset): string {
  return path.join(root, preset.dotDir, preset.skillsDir, 'gstack');
}

export function globalGstackDir(home: string, preset: InstallPreset): string {
  return path.join(home, preset.dotDir, preset.skillsDir, 'gstack');
}

export function workspaceBrowseBinary(root: string, preset: InstallPreset): string {
  return path.join(workspaceGstackDir(root, preset), 'browse', 'dist', 'browse');
}

export function globalBrowseBinary(home: string, preset: InstallPreset): string {
  return path.join(globalGstackDir(home, preset), 'browse', 'dist', 'browse');
}

export function candidateGstackDirs(root: string | null, home: string): string[] {
  const dirs: string[] = [];
  for (const preset of listInstallPresets()) {
    if (root) {
      dirs.push(workspaceGstackDir(root, preset));
    }
    dirs.push(globalGstackDir(home, preset));
  }
  return dirs;
}

export function candidateBrowseBinaries(root: string | null, home: string): string[] {
  const bins: string[] = [];
  for (const preset of listInstallPresets()) {
    if (root) {
      bins.push(workspaceBrowseBinary(root, preset));
    }
    bins.push(globalBrowseBinary(home, preset));
  }
  return bins;
}

export function installDocNames(): string[] {
  return Array.from(new Set(listInstallPresets().map((preset) => preset.docFile)));
}

export function formatInlineCodeList(values: string[]): string {
  const quoted = Array.from(new Set(values)).map((value) => `\`${value}\``);
  if (quoted.length <= 1) {
    return quoted[0] ?? '';
  }
  if (quoted.length === 2) {
    return `${quoted[0]} or ${quoted[1]}`;
  }
  return `${quoted.slice(0, -1).join(', ')}, or ${quoted[quoted.length - 1]}`;
}
