# Keynote working notes

Working material for the R/Pharma 2026 keynote deck (source `keynote/keynote_notes.html`, local only; published as `keynote/keynote_extended.html` and `keynote/keynote.html` without speaker notes).
Jekyll skips folders whose names start with `_`, so nothing in `_notes/` is published.

- `inbox/` — drop anything here: outlines, dictation, screenshots, PDFs, links.
  Images meant for the deck move to `keynote/assets/` once they're used on a slide.
- `research-digest.md` — what the developer diary, the obot.roadmap hub and the
  earlier `RPharma2026-AIKeynote` deck already say about the talk.

## Deck template

`keynote/keynote_extended.html` uses the site's rainbow hex theme: paper background, Instrument
Serif headings, the seven-hue spectrum through a strip of hex outlines. Each section
takes the next hue (`data-hue="0"` … `"6"`). Layouts: `s-title`, `s-section`,
`s-bullets`, `s-quote`, `s-stat`, `s-split`, `s-image`, `s-todo`. Speaker notes go in
`<aside class="notes">`.

Keys: ← → / space to move · O overview · N notes · F fullscreen · `#7` in the URL
jumps to slide 7 · print to PDF gives one slide per page.

## Two decks, one source

- `keynote/keynote_notes.html` is the only deck file to edit: every slide, reserves included, with the speaker notes. It is LOCAL ONLY (in `.git/info/exclude`; never commit, push or publish it). `python3 keynote/_notes/build-keynote.py` writes `keynote/keynote_extended.html` (every slide) and `keynote/keynote.html` (the talk) from it with the notes taken out; commit those two. Present from keynote_notes.html so the presenter window has the notes. Since 2026-10-19.
- `keynote/keynote.html` is the talk: the same deck without the reserve slides
  (`data-reserve`). It is generated, never edited by hand.
- After any edit to the extended deck, run `python3 keynote/_notes/build-keynote.py` and
  commit both files together. `--check` fails when `keynote.html` is stale.
