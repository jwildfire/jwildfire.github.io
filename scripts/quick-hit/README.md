# Quick hit (Chrome extension)

Shares the page you're on as a quick hit on the blog: one file in `_links/`, committed straight to `main`, live about a minute later on the homepage News feed, on `/links/`, and in `/feed/links.xml`. It can also drop the page into an Apple Reminders list ("AI Reading" by default) as a reading queue, without publishing anything.

## Install (once per machine)

1. `chrome://extensions` → turn on Developer mode → Load unpacked → pick this folder (`scripts/quick-hit/`).
2. Pin it to the toolbar if you like. The shortcut is ⌥⇧L (change it at `chrome://extensions/shortcuts`).
3. Its Settings page opens from the popup. Make a fine-grained GitHub token limited to the blog repository with Contents: Read and write, paste it in, and press Check token.
4. For the Reminders button, install the helper once: `sh scripts/quick-hit/native/install.sh`. The first time you add a link, macOS asks whether Google Chrome may control Reminders: choose OK. Settings → Check helper confirms it is installed.

The extension's ID is pinned by the `key` in `manifest.json` (`cogmehpgoajcdcbmekoeobaekokkijia`), so it stays the same wherever the folder is loaded from; the Reminders helper only answers that ID.

Chrome loads the extension from this folder, so it updates when the folder does. Load it from a checkout that stays on `main`, not from a worktree you will delete.

## Use

- Highlight a passage on the page if you want to quote it, then press ⌥⇧L.
- The cursor is in the comment box. Write a line or two (Markdown works) and press ⌘↵ to publish.
- Title, link and source are filled in from the page. Edit them if the page's own title is noisy.
- Save as draft commits the file with `published: false`, so it does not appear on the site. Delete that line on GitHub to publish it.
- "Also add to AI Reading" (ticked by default, remembered) sends every published quick hit and draft to the Reminders list too: the title as the reminder, the link plus any comment, quote and quick-hit page in its notes.
- "Only add to AI Reading" (⌘⇧↵) puts the page in the Reminders list and publishes nothing, for a reading queue. A link already open in the list is not added twice. The list name is a setting.
- Whatever you type is kept for that page until it is published, so closing the popup by accident loses nothing.

Working through the Reminders list: open each link, press ⌥⇧L, comment, publish, and tick the reminder off.

## Reminders helper

Chrome cannot reach Reminders itself, so `native/reminders_host.py` does it through Chrome native messaging: Chrome starts the script for each request and the script runs AppleScript. `native/install.sh` copies the script to `~/Library/Application Support/wildfiring-quick-hit/` and registers it in `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.wildfiring.quick_hit.json`. Delete those two files to uninstall. AppleScript cannot fill a reminder's URL field, so the link goes in the notes, where Reminders makes it clickable.

## File format

```markdown
---
title: "Page title"
link: "https://example.com/article"
source: "example.com"
date: 2026-10-18 09:12:00 -0400
quote: "The highlighted passage."
---
The comment.
```

Fix a typo by editing the file on GitHub. The body must not start with a heading: the site's titles-from-headings plugin would take it as the title (the extension escapes a leading `#`).

## Tests

`node --test` in this folder runs the file-format tests (`lib.test.js`).
