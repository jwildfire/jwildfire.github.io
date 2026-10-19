#!/bin/sh
# Registers the Reminders helper with Google Chrome, so the Quick Hit popup's
# "Add to AI Reading" button can reach Apple Reminders. Run once per Mac:
#
#   sh scripts/quick-hit/native/install.sh
#
# It copies reminders_host.py to ~/Library/Application Support/wildfiring-quick-hit/
# (so the helper keeps working if this checkout moves) and writes Chrome's host
# manifest, which only the Quick Hit extension (its ID is pinned by the "key" in
# manifest.json) is allowed to use. Run it again after changing the helper.
# To uninstall, delete those two files.
set -eu

NAME="com.wildfiring.quick_hit"
EXTENSION_ID="cogmehpgoajcdcbmekoeobaekokkijia"
HERE="$(cd "$(dirname "$0")" && pwd)"
DEST="$HOME/Library/Application Support/wildfiring-quick-hit"
HOSTS="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"

mkdir -p "$DEST" "$HOSTS"
cp "$HERE/reminders_host.py" "$DEST/reminders_host.py"
chmod 755 "$DEST/reminders_host.py"

cat > "$HOSTS/$NAME.json" <<EOF
{
  "name": "$NAME",
  "description": "Adds links from the Quick Hit extension to Apple Reminders",
  "path": "$DEST/reminders_host.py",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://$EXTENSION_ID/"]
}
EOF

echo "Installed the Reminders helper for Chrome."
echo "  helper:   $DEST/reminders_host.py"
echo "  manifest: $HOSTS/$NAME.json"
echo "The first time you add a link, macOS asks whether Google Chrome may control Reminders: choose OK."
