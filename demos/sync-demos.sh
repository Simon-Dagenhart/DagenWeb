#!/usr/bin/env bash
# =============================================================================
# DagenWeb — rebuild the hosted demo copies
#
# The portfolio hosts browsable copies of two sites so a reviewer can click
# through the real thing instead of only seeing a screenshot. Those copies
# live here in demos/ and are DERIVED — never edit them by hand, edit the
# source site and re-run this script:
#
#     bash dagenweb/demos/sync-demos.sh
#
# What it does per demo: wipe the old copy, copy the source, strip anything
# that can't work on static hosting (swanstore's PHP admin), then inject the
# shared demo bar into every page.
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"   # .../website
DEMOS="$ROOT/dagenweb/demos"

echo "site root: $ROOT"

# ---------------------------------------------------------------- Ashur ----
echo "→ ashur"
rm -rf "$DEMOS/ashur"
mkdir -p "$DEMOS/ashur"
cp -r "$ROOT/school/." "$DEMOS/ashur/"

# ------------------------------------------------------------ swanstore ----
# The storefront is static (fetches data/products.json), but admin/ is PHP and
# cannot run on GitHub Pages — drop it and remove the links that point at it.
echo "→ swanstore"
rm -rf "$DEMOS/swanstore"
mkdir -p "$DEMOS/swanstore"
cp -r "$ROOT/swanstore/." "$DEMOS/swanstore/"
rm -rf "$DEMOS/swanstore/admin"
find "$DEMOS/swanstore" -name '.htaccess' -delete
# The dashboard link is the last piece of a JS string concatenation built
# inline in each page. Blank the whole line rather than splicing the string —
# the preceding line ends in `+`, so an empty '' keeps the expression valid.
for f in "$DEMOS/swanstore"/*.html; do
  sed -i "/admin\/login\.php/s|.*|        '';|" "$f"
done

# --------------------------------------------------------- inject the bar ---
# One <script> before </body> on every page of every demo. Depth-aware src so
# pages in subfolders (ashur has none today, but swanstore/news-style subdirs
# would) still resolve back to demos/demo-bar.js.
inject() {
  local file="$1" rel="$2"
  grep -q 'demo-bar.js' "$file" && return 0
  sed -i "s|</body>|  <script src=\"${rel}demo-bar.js\"></script>\n</body>|" "$file"
}

count=0
for demo in ashur swanstore; do
  while IFS= read -r f; do
    depth=$(python -c "import os,sys;print(os.path.relpath('$DEMOS',os.path.dirname('$f')).replace(os.sep,'/')+'/')" 2>/dev/null \
            || echo "../")
    inject "$f" "$depth"
    count=$((count+1))
  done < <(find "$DEMOS/$demo" -name '*.html')
done

echo "done — demo bar injected into $count pages"
