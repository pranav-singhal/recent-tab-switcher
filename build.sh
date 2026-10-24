#!/bin/sh
# Packages the extension for the Chrome Web Store.
set -e
cd "$(dirname "$0")"
rm -rf dist && mkdir dist
zip -r dist/recent-tab-switcher.zip manifest.json background.js content.js options.html options.js \
  icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png
echo "Built dist/recent-tab-switcher.zip"
