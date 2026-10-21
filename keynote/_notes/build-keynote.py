#!/usr/bin/env python3
"""Write the two public decks from keynote/keynote_notes.html, the local-only source.

keynote_notes.html is the one file to edit: every slide, reserves included, with the speaker
notes. It is LOCAL ONLY (listed in the repository's .git/info/exclude): never commit it,
push it or publish it. Present from it, so the presenter window (P) has the notes.

From it this script writes, with every speaker note (<aside class="notes">) taken out:

    keynote_extended.html  every slide, reserves included
    keynote.html           the talk, without the robots noindex: the reserve slides (every <section> carrying
                           data-reserve) and the Reserves banner comments left out too

Run after every edit and commit the two outputs together:

    python3 keynote/_notes/build-keynote.py          # write both decks
    python3 keynote/_notes/build-keynote.py --check  # fail if either is stale

Each run also copies the source to keynote/.notes-backups/ (local only too; the newest 30 kept).
"""
import re
import shutil
import sys
import time
from pathlib import Path

KEYNOTE = Path(__file__).resolve().parent.parent
SRC = KEYNOTE / "keynote_notes.html"
EXTENDED = KEYNOTE / "keynote_extended.html"
TALK = KEYNOTE / "keynote.html"
BACKUPS = KEYNOTE / ".notes-backups"
KEEP = 30


def generated(name: str) -> str:
    return (
        f"<!-- GENERATED from keynote_notes.html by keynote/_notes/build-keynote.py, speaker notes removed.\n"
        f"     Do not edit {name}: edit the local keynote_notes.html and run the script. -->\n"
    )


def strip_notes(html: str) -> tuple[str, int]:
    # Only real elements: the file's comments, scripts and styles mention <aside class="notes">
    # as text, so they are kept whole and the strip runs on what lies between them. Notes never
    # nest, so the first </aside> after an opening tag closes it.
    # A note may itself hold a comment, so this walks the file: a comment, script or style
    # outside a note is skipped whole; a note is cut out with whatever it holds.
    token = re.compile(r"<!--|<script\b|<style\b|<aside class=\"notes\">")
    ends = {"<!--": "-->", "<script": "</script>", "<style": "</style>"}
    out, pos, n = [], 0, 0
    while (m := token.search(html, pos)):
        if m.group(0).startswith("<aside"):
            end = html.find("</aside>", m.end())
            if end < 0:
                sys.exit("build-keynote: a speaker note has no closing </aside>")
            start = m.start()
            while start > pos and html[start - 1] in " \t":
                start -= 1
            if start > pos and html[start - 1] == "\n":
                start -= 1
            out.append(html[pos:start])
            pos, n = end + len("</aside>"), n + 1
        else:
            end = html.find(ends[m.group(0)], m.end())
            end = len(html) if end < 0 else end + len(ends[m.group(0)])
            out.append(html[pos:end])
            pos = end
    out.append(html[pos:])
    html = "".join(out)
    if n == 0:
        sys.exit("build-keynote: found no speaker notes in keynote_notes.html; is it the right file?")
    markup = re.sub(r"<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>", "", html, flags=re.S)
    for marker in ('<aside class="notes"', 'class="say"', 'class="hits"'):
        if marker in markup:
            sys.exit(f"build-keynote: {marker} survived the strip; fix the script")
    return html, n


def drop_reserves(html: str) -> tuple[str, int]:
    # The banner comments that open the Reserves and the Template samples.
    html, n_banner = re.subn(
        r"\n[ \t]*<!-- =+\s*\n\s*(?:Reserves|Template samples) .*?-->[ \t]*\n", "\n", html, flags=re.S
    )
    # Every reserve slide. Sections do not nest in this deck, so the first </section>
    # after an opening tag closes it.
    pattern = re.compile(
        r"\n?[ \t]*<section\b[^>]*\bdata-reserve=\"[^\"]*\"[^>]*>.*?</section>[ \t]*\n", re.S
    )
    html, n_reserve = pattern.subn("\n", html)
    if n_banner != 2 or n_reserve == 0:
        sys.exit(f"build-keynote: expected the Reserves and Template samples banners and some reserve slides, "
                 f"found {n_banner} and {n_reserve}; the deck's layout changed, fix the script")
    if "data-reserve=" in re.sub(r"<script>.*?</script>|/\*.*?\*/|<!--.*?-->", "", html, flags=re.S):
        sys.exit("build-keynote: a data-reserve attribute survived outside the script")
    # Collapse the blank lines left where the reserves were.
    html = re.sub(r"\n{3,}(\s*</div>\s*\n\s*<div class=\"notes-panel\")", r"\n\n\1", html)
    return html, n_reserve


def findable(html: str) -> str:
    # The talk deck is linked from the blog post and /keynote (Jeremy, 2026-10-20: "drop
    # noindex"), so search engines may list it. keynote_extended.html keeps the source's noindex.
    html, n = re.subn(r"\n[ \t]*<meta name=\"robots\" content=\"noindex\" />[ \t]*(?=\n)", "", html, count=1)
    if n != 1:
        sys.exit("build-keynote: keynote_notes.html has no robots noindex line to drop from keynote.html")
    return html


def build(src: str) -> dict:
    bare, n_notes = strip_notes(src)
    talk, n_reserve = drop_reserves(bare)
    talk = findable(talk)
    head = "<!doctype html>\n"
    return {
        EXTENDED: bare.replace(head, head + generated(EXTENDED.name), 1),
        TALK: talk.replace(head, head + generated(TALK.name), 1),
        "n_notes": n_notes,
        "n_reserve": n_reserve,
    }


def count_slides(html: str) -> int:
    return len(re.findall(r'<section class="slide', re.sub(r"<!--.*?-->|/\*.*?\*/", "", html, flags=re.S)))


def backup() -> None:
    BACKUPS.mkdir(exist_ok=True)
    shutil.copy2(SRC, BACKUPS / f"keynote_notes-{time.strftime('%Y%m%d-%H%M%S')}.html")
    for old in sorted(BACKUPS.glob("keynote_notes-*.html"))[:-KEEP]:
        old.unlink()


def main() -> None:
    if not SRC.exists():
        sys.exit("build-keynote: keynote/keynote_notes.html is missing. It is local only and lives on the "
                 "machine that holds the speaker notes; it is not in git.")
    out = build(SRC.read_text(encoding="utf-8"))
    if "--check" in sys.argv[1:]:
        stale = [p.name for p in (EXTENDED, TALK) if not p.exists() or p.read_text(encoding="utf-8") != out[p]]
        if stale:
            sys.exit(f"build-keynote: {' and '.join(stale)} stale; run keynote/_notes/build-keynote.py")
        print("build-keynote: keynote_extended.html and keynote.html are up to date")
        return
    backup()
    for p in (EXTENDED, TALK):
        p.write_text(out[p], encoding="utf-8")
    print(f"build-keynote: {out['n_notes']} speaker notes removed; wrote {EXTENDED.name} "
          f"({count_slides(out[EXTENDED])} slides) and {TALK.name} ({count_slides(out[TALK])} slides, "
          f"{out['n_reserve']} reserve slides left out)")


if __name__ == "__main__":
    main()
