#!/usr/bin/env python3
"""Write the three public decks from keynote/keynote_notes.html, the local-only source.

keynote_notes.html is the one file to edit: every slide, reserves included, with the speaker
notes. It is LOCAL ONLY (listed in the repository's .git/info/exclude): never commit it,
push it or publish it. Present from it, so the presenter window (P) has the notes.

From it this script writes, with every speaker note (<aside class="notes">) taken out:

    keynote_extended.html  every slide, reserves included
    keynote.html           the talk, without the robots noindex: the reserve slides (every <section> carrying
                           data-reserve) and the Reserves banner comments left out too

and, with public notes in place of the speaker notes (Jeremy, 2026-10-21: "_notes version should
have bullets on top and then the text from the blog below"):

    keynote_annotated.html the talk, each slide's notes = its bullets (<ul class="hits">) and then
                           its text from the annotated blog post (POST, converted with kramdown as
                           Jekyll does); the notes panel opens below the slide

Run after every edit (and after editing the post) and commit the three outputs together:

    python3 keynote/_notes/build-keynote.py          # write all three decks
    python3 keynote/_notes/build-keynote.py --check  # fail if any is stale

Each run also copies the source to keynote/.notes-backups/ (local only too; the newest 30 kept).
"""
import html as htmlmod
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

KEYNOTE = Path(__file__).resolve().parent.parent
SRC = KEYNOTE / "keynote_notes.html"
EXTENDED = KEYNOTE / "keynote_extended.html"
TALK = KEYNOTE / "keynote.html"
ANNOTATED = KEYNOTE / "keynote_annotated.html"
POST = KEYNOTE.parent / "_posts" / "2026-10-21-rpharma-2026-keynote-annotated.md"
POST_URL = "/2026/10/21/rpharma-2026-keynote-annotated.html"
BACKUPS = KEYNOTE / ".notes-backups"
KEEP = 30


def generated(name: str, what: str = "speaker notes removed") -> str:
    return (
        f"<!-- GENERATED from keynote_notes.html by keynote/_notes/build-keynote.py, {what}.\n"
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


def post_by_slide() -> dict:
    # The post, as Jekyll renders it (kramdown, GFM input), cut at each slide image: the text
    # after slide N's image, up to the next one, is slide N's. The intro before slide 1 stays in
    # the post. The animation figures (GIFs and videos of the slides) are left out; the
    # footnote's text joins the last slide's.
    if not POST.exists():
        sys.exit(f"build-keynote: {POST} is missing; keynote_annotated.html is built from it")
    md = POST.read_text(encoding="utf-8").split("\n---\n", 1)[1]
    try:
        body = subprocess.run(
            ["ruby", "-e", 'require "kramdown"; require "kramdown-parser-gfm"; '
             'print Kramdown::Document.new(STDIN.read, input: "GFM", hard_wrap: false).to_html'],
            input=md, capture_output=True, text=True, check=True).stdout
    except (OSError, subprocess.CalledProcessError) as e:
        sys.exit(f"build-keynote: kramdown (the gem Jekyll uses) failed: {e}")
    body = re.sub(r"\s*<figure class=\"kn-anim\">.*?</figure>", "", body, flags=re.S)
    body = re.sub(r"<sup id=\"fnref:[^\"]*\"[^>]*>.*?</sup>", "", body, flags=re.S)
    foot = ""
    m = re.search(r"<div class=\"footnotes\"[^>]*>.*?<li[^>]*>(.*?)</li>.*?</div>\s*$", body, re.S)
    if m:
        foot = re.sub(r"\s*<a href=\"#fnref:[^\"]*\"[^>]*>.*?</a>", "", m.group(1), flags=re.S).strip()
        body = body[:m.start()]
    img = re.compile(r"<p><a href=\"https://jwildfire\.github\.io/keynote/keynote\.html#(\d+)\"><img [^>]*/?></a></p>")
    cuts = list(img.finditer(body))
    if not cuts:
        sys.exit("build-keynote: found no slide images in the post; its layout changed, fix the script")
    out = {}
    for k, c in enumerate(cuts):
        end = cuts[k + 1].start() if k + 1 < len(cuts) else len(body)
        out[int(c.group(1))] = body[c.end():end].strip()
    if foot:
        last = int(cuts[-1].group(1))
        out[last] += "\n" + foot
    return out


def annotate(talk_notes: str) -> str:
    # talk_notes: the talk (reserves dropped) with its speaker notes still in. Each slide's
    # aside becomes its bullets, then its text from the post. The spoken notes and the
    # background notes stay out.
    text = post_by_slide()
    token = re.compile(r"<!--|<script\b|<style\b|<section class=\"slide|<aside class=\"notes\">")
    ends = {"<!--": "-->", "<script": "</script>", "<style": "</style>"}
    out, pos, n, used = [], 0, 0, set()
    while (m := token.search(talk_notes, pos)):
        t = m.group(0)
        if t.startswith("<section"):
            n += 1
            out.append(talk_notes[pos:m.end()])
            pos = m.end()
        elif t.startswith("<aside"):
            end = talk_notes.find("</aside>", m.end())
            inner = talk_notes[m.end():end]
            hits = re.search(r"<ul class=\"hits\">.*?</ul>", inner, re.S)
            parts = [hits.group(0)] if hits and re.search(r"<li>\s*\S", hits.group(0)) else []
            if n in text and text[n]:
                parts.append(f'<div class="say post">\n{text[n]}\n</div>')
                used.add(n)
            if n == 1:
                parts.append(f'<p class="from">From <a href="{POST_URL}">the keynote, annotated</a> (R/Pharma Diary #10).</p>')
            out.append(talk_notes[pos:m.start()] + '<aside class="notes">\n' + "\n".join(parts) + "\n      </aside>")
            pos = end + len("</aside>")
        else:
            end = talk_notes.find(ends[t], m.end())
            end = len(talk_notes) if end < 0 else end + len(ends[t])
            out.append(talk_notes[pos:end])
            pos = end
    out.append(talk_notes[pos:])
    html = "".join(out)
    missing = sorted(set(text) - used)
    if missing:
        sys.exit(f"build-keynote: the post has text for slides {missing} that no slide in the talk took")
    # The notes start open, below the slide; N closes and reopens them, and the slide refits.
    fit_old = "var s = Math.min(window.innerWidth / 1600, window.innerHeight / 900);"
    if html.count(fit_old) != 1:
        sys.exit("build-keynote: the deck's fit() changed; fix annotate()")
    html = html.replace(fit_old, "var s = Math.min(window.innerWidth / 1600, window.innerHeight * notesRoom() / 900);")
    head_add = """  <style>
    /* keynote_annotated.html: the notes sit below the slide, not over it. */
    body.show-notes:not(.overview):not(.presenter) .deck { bottom: 40vh; }
    body:not(.presenter) .notes-panel { height: 40vh; max-height: 40vh; padding: 18px max(28px, calc((100vw - 1040px) / 2)); background: #1f2328; }
    .notes-panel .post { font-size: 17px; line-height: 1.6; color: #dfe2dc; }
    .notes-panel .post p, .notes-panel .post ul, .notes-panel .post ol { margin: 0 0 12px; }
    .notes-panel .post ul, .notes-panel .post ol { padding-left: 1.3em; }
    .notes-panel .post blockquote { margin: 0 0 12px; padding-left: 14px; border-left: 3px solid rgba(243, 244, 241, 0.3); color: #b9beb6; }
    .notes-panel .post code, .notes-panel .post pre { font-family: var(--mono); font-size: 0.9em; }
    .notes-panel .post pre { white-space: pre-wrap; background: rgba(243, 244, 241, 0.08); padding: 10px 12px; border-radius: 6px; }
    .notes-panel a { color: #9ecbff; }
    .notes-panel .from { font-family: var(--mono); font-size: 13px; color: #8d938c; margin: 4px 0 0; }
    body:not(.presenter) .notes-panel ul.hits { border-bottom: 1px solid rgba(243, 244, 241, 0.25); padding-bottom: 12px; }
    /* The deck sets p and li at 38px for slides; in the notes they take the panel's size. */
    body:not(.presenter) .notes-panel p, body:not(.presenter) .notes-panel li { font-size: inherit; line-height: inherit; }
    body:not(.presenter) .notes-panel ul.hits { font-size: 19px; }
    body.show-notes:not(.presenter) .hint { display: none; }
    @media (max-width: 700px) { body:not(.presenter) .notes-panel { padding: 14px 16px; } .notes-panel .post { font-size: 16px; } }
    /* Portrait screens: the slide keeps its width at the top, and the notes take the rest. */
    @media (max-aspect-ratio: 1/1) {
      body.show-notes:not(.overview):not(.presenter) .deck { bottom: auto; height: calc(56.25vw + 16px); }
      body.show-notes:not(.presenter) .notes-panel { top: calc(56.25vw + 16px); height: auto; max-height: none; }
    }
  </style>
  <script>
    function notesRoom() {
      var b = document.body.classList;
      return b.contains('show-notes') && !b.contains('overview') && !b.contains('presenter') ? 0.6 : 1;
    }
  </script>
</head>"""
    if html.count("</head>") != 1 or html.count("<body>") != 1:
        sys.exit("build-keynote: expected one </head> and one <body>; fix annotate()")
    html = html.replace("</head>", head_add, 1)
    html = html.replace("<body>", '<body class="show-notes">', 1)
    body_add = """  <script>
    // N toggles the notes: refit the slide to the room left.
    new MutationObserver(function () { window.dispatchEvent(new Event('resize')); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  </script>
</body>"""
    html = html[: html.rindex("</body>")] + body_add + html[html.rindex("</body>") + len("</body>"):]
    title = re.search(r"<title>(.*?)</title>", html)
    if title:
        html = html.replace(title.group(0), f"<title>{title.group(1)} · annotated</title>", 1)
    return html


def build(src: str) -> dict:
    bare, n_notes = strip_notes(src)
    talk, n_reserve = drop_reserves(bare)
    talk = findable(talk)
    notes_talk, _ = drop_reserves(src)
    annotated = annotate(findable(notes_talk))
    head = "<!doctype html>\n"
    return {
        EXTENDED: bare.replace(head, head + generated(EXTENDED.name), 1),
        TALK: talk.replace(head, head + generated(TALK.name), 1),
        ANNOTATED: annotated.replace(head, head + generated(
            ANNOTATED.name, "speaker notes replaced by its bullets and the annotated post's text"), 1),
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
        stale = [p.name for p in (EXTENDED, TALK, ANNOTATED) if not p.exists() or p.read_text(encoding="utf-8") != out[p]]
        if stale:
            sys.exit(f"build-keynote: {' and '.join(stale)} stale; run keynote/_notes/build-keynote.py")
        print("build-keynote: keynote_extended.html, keynote.html and keynote_annotated.html are up to date")
        return
    backup()
    for p in (EXTENDED, TALK, ANNOTATED):
        p.write_text(out[p], encoding="utf-8")
    print(f"build-keynote: {out['n_notes']} speaker notes removed; wrote {EXTENDED.name} "
          f"({count_slides(out[EXTENDED])} slides) and {TALK.name} ({count_slides(out[TALK])} slides, "
          f"{out['n_reserve']} reserve slides left out) and {ANNOTATED.name} (the talk with public notes)")


if __name__ == "__main__":
    main()
