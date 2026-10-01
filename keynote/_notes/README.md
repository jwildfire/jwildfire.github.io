# Keynote working notes

Working material for the R/Pharma 2026 keynote deck (`keynote/slides.html`).
Jekyll skips folders whose names start with `_`, so nothing in `_notes/` is published.

- `inbox/` — drop anything here: outlines, dictation, screenshots, PDFs, links.
  Images meant for the deck move to `keynote/assets/` once they're used on a slide.
- `research-digest.md` — what the developer diary, the obot.roadmap hub and the
  earlier `RPharma2026-AIKeynote` deck already say about the talk.

## Deck template

`keynote/slides.html` uses the site's rainbow hex theme: paper background, Instrument
Serif headings, the seven-hue spectrum through a strip of hex outlines. Each section
takes the next hue (`data-hue="0"` … `"6"`). Layouts: `s-title`, `s-section`,
`s-bullets`, `s-quote`, `s-stat`, `s-split`, `s-image`, `s-todo`. Speaker notes go in
`<aside class="notes">`.

Keys: ← → / space to move · O overview · N notes · F fullscreen · `#7` in the URL
jumps to slide 7 · print to PDF gives one slide per page.
