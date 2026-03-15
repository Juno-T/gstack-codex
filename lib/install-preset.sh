#!/usr/bin/env bash

GSTACK_PRESETS_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/install-presets.tsv"

gstack_preset_default() {
  echo "${GSTACK_INSTALL_PRESET:-claude}"
}

gstack_supported_presets() {
  awk -F'\t' 'NR > 1 && $1 !~ /^#/ && $1 != "" { print $1 }' "$GSTACK_PRESETS_FILE"
}

gstack_preset_exists() {
  local preset="${1:?preset required}"
  awk -F'\t' -v preset="$preset" 'NR > 1 && $1 == preset { found = 1 } END { exit found ? 0 : 1 }' "$GSTACK_PRESETS_FILE"
}

gstack_resolve_preset() {
  local preset="${1:-$(gstack_preset_default)}"
  if ! gstack_preset_exists "$preset"; then
    echo "ERROR: unknown install preset '$preset'." >&2
    echo "Supported presets: $(gstack_supported_presets | tr '\n' ' ' | sed 's/[[:space:]]*$//')" >&2
    return 1
  fi
  echo "$preset"
}

gstack_preset_field() {
  local preset="${1:?preset required}"
  local field="${2:?field required}"
  awk -F'\t' -v preset="$preset" -v field="$field" '
    NR == 1 {
      for (i = 1; i <= NF; i++) {
        if ($i == field) col = i
      }
      next
    }
    $1 == preset {
      print $col
      exit
    }
  ' "$GSTACK_PRESETS_FILE"
}

gstack_preset_dot_dir() {
  gstack_preset_field "$1" dot_dir
}

gstack_preset_doc_file() {
  gstack_preset_field "$1" doc_file
}

gstack_preset_skills_dir() {
  gstack_preset_field "$1" skills_dir
}
