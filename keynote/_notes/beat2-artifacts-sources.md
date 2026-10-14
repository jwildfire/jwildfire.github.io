# Beat 2 artifacts wall: sources

Draft of 2026-10-05 for the slide in `beat2-artifacts-draft.html` ("The artifact is what a person reviews"). Not in the deck yet. Every word on the slide is draft wording for Jeremy to replace; this file is the record of which pages are pictured, where they came from, and what was left out.

## Which source was used, and why

- The slide is built from obot.roadmap, the public hub of Jeremy's side project. It is not built from the team's gsm.roadmap.
- gsm.roadmap was the first choice, because it is beat 2's own subject. It is not publicly reachable. Checked on 2026-10-05 with plain `curl`, no login and no token:
  - `https://gilead-biostats.github.io/gsm.roadmap/` redirects to `https://github.com/login?return_to=…/pages/auth…` (a GitHub Pages site restricted to signed-in members)
  - `https://github.com/Gilead-BioStats/gsm.roadmap` returns 404
  - `https://api.github.com/repos/Gilead-BioStats/gsm.roadmap` returns 404
  - `https://raw.githubusercontent.com/Gilead-BioStats/gsm.roadmap/main/README.md` returns 404
- Nothing was taken from the old local clone of gsm.roadmap, and nothing on the slide or in its notes describes what a gsm.roadmap page contains.
- The slide's caption line says so in the room: "Examples from my side project, standing in for the team's".
- Side finding for the deck as a whole: `https://api.github.com/repos/Gilead-BioStats/gsm.agent` also returns 404 without a login, while gsm.kri returns 200 and qcthat returns a 301 to its current home. The comment at the top of beat 2 in `slides.html` lists gsm.agent and gsm.roadmap among its "public sources", and slide 20's kicker and notes and slide 23's notes cite them. Worth Jeremy's check before the deck is called public-sourced.

## Was there ever an artifacts slide?

- No. `git log -S"artifact" -- keynote/slides.html` finds one commit, 74d54c1 ("beat 2 refined around plan → build → run"), and the word arrives there only in the speaker notes of "Agents draft; people approve" (now slide 20). No slide in any version has shown an artifact.
- What that commit removed is the nearest thing to a demotion. The first two drafts of beat 2 (4cba5b2 and e4ff945) had a slide "Requirements before work" that put the parts of a requirement on screen: "Business requirement, Overview, Data requirement, Design", "Filled in one stage at a time, with a sign-off from the business user before design." In 74d54c1 it became the six-stage chain, where each artifact is a grey two-word line under a hex.
- The outline's only other mention is Jeremy's own, in the close of beat 3: "Design: artifacts are amazing; .md → .html". It is listed among the callout candidates as not placed. The draft's callout ("Designing pages!") uses it.
- No earlier wording existed to reuse for the slide itself.

## The ten pages on the slide

All ten are from obot.roadmap (repo `jwildfire/obot.roadmap`, site `https://jwildfire.github.io/obot.roadmap/`). Each returned 200 without a login on 2026-10-05. Images are in `keynote/assets/artifacts/`, 640 × 450 PNG, 61 to 136 KB each, about 1.0 MB together.

| # | Label on the slide | File | Page | Part of the page shown |
|---|---|---|---|---|
| 1 | Migration assessment | `assessment-nepexplorer-migration.png` | https://jwildfire.github.io/obot.roadmap/reports/nepexplorer-migration-assessment-2026-07-15/ | Top of the page |
| 2 | Data requirement | `data-requirement-nepexplorer.png` | https://jwildfire.github.io/obot.roadmap/requirements/design/35_design.html#data | Section 5, "Data requirement", about 5,600 px down |
| 3 | Design document | `design-basic-app.png` | https://jwildfire.github.io/obot.roadmap/requirements/design/352_design.html | Top of the page |
| 4 | Layout options | `options-safety-viz-homepage.png` | https://jwildfire.github.io/obot.roadmap/reports/safety-viz-homepage-options-2026-07-11/ | Option A, "Baseline", about 420 px down |
| 5 | Roadmap plan | `plan-requirement-sessions.png` | https://jwildfire.github.io/obot.roadmap/reports/goal-sessions-plan-2026-09-10/ | Top of the page |
| 6 | Decision record | `decision-safetycensus-stay-or-go.png` | https://jwildfire.github.io/obot.roadmap/reports/decisions/2026-08-17-safetycensus-stay-or-go/ | Top of the page |
| 7 | Release demo | `release-demo-safety-viz-v1.8.png` | https://jwildfire.github.io/obot.roadmap/reports/sv-v1.8-demo/#app | "The demo app" section, about 660 px down |
| 8 | Qualification evidence | `qualification-evidence-gsm-safety-v1.0-rc1.png` | https://jwildfire.github.io/obot.roadmap/reports/gsm-safety-v1.0.0-rc1/ | Top of the page |
| 9 | Release review guide | `review-guide-release-plan.png` | https://jwildfire.github.io/obot.roadmap/reports/release-review-plan-2026-09-12/ | Top of the page |
| 10 | Org chart | `org-chart.png` | https://jwildfire.github.io/obot.roadmap/reports/org-chart/ | "Who answers to whom, and who wakes whom", about 790 px down |

How they were captured:

- Headless Chrome, 2026-10-05, from the deployed site (not from the local clone), window 1280 px wide, light colour scheme forced (`--blink-settings=preferredColorScheme=1`; this Mac is in dark mode and several pages follow it, and the light versions sit better on the deck's paper background).
- Pages shown from the top were captured at 1280 × 900. Pages shown part-way down were captured as one tall image and a 1280 × 900 window was cut from it at the offset in the table. Nothing was retouched.
- Shrunk to 640 px wide with `sips -Z 640`.

## What a reader can make out, for vetting

At the size on the slide (248 px wide) only page titles are readable. The files themselves are 640 px wide and sit in a public repo, where the body text can be read, so each was checked at that size.

- People: the only handle or name that appears in any of the ten is `@jwildfire` / "Jeremy". A search of the ten pages' source for other `@` handles found none.
- Employer: a search of the ten pages' source for "Gilead" found nothing.
- Thumbnail 7 shows a scatter plot from the demo app on its bundled demo study (aggregate points, with counts such as "318 of 364 participants shown"). The deck already shows this demo study on slides in beat 3. No single participant's record is in the frame.
- Thumbnail 9 names the side project's other repositories in small print (open.csr, gsm.safety, safety.viz, obot.agent, open.gismo, demo-301) and quotes two of Jeremy's recorded decisions.
- Thumbnail 5 opens with "The autonomous prototype is shut down" and quotes Jeremy; that is beat 3's story arriving a beat early, if anyone zooms.
- Thumbnails 1 and 2 name the public originals they migrate from (SafetyGraphics, RhoInc) and the public demo data package (pharmaverseadam).

## Left out, and why

- Every gsm.roadmap page: not public (above).
- `reports/participant-profile-v2-mockup-2026-07-24/` (an interactive mockup, and the best-looking candidate): its first screen shows one participant's row from the demo study (an ID, sex, race, treatment arm, site). The data is the public demo set, but the brief said to leave out anything in doubt. If Jeremy is comfortable with it, it would replace thumbnail 4 or 9 with the label "Interactive mockup".
- `reports/decisions/2026-08-21-clinical-priorities/` (a decision page): its questions are about pushing "towards open.gismo v1.0" and a "competitor survey". Swapped for the SafetyCensus decision page, which is about one function in his own package.
- `reports/biomarker-v0.1-demo/`, `reports/biomarker-v0.2-demo/` and `requirements/design/353_design.html`: left out under a standing instruction from Jeremy about how that workstream is described in public. Not opened for this slide.
- `reports/og-*` (six pages), `reports/open-gismo-*` and `reports/gsm-qtl-report-module-audit-2026-07-29/`: about packages in the team's own ecosystem, so too close to the day job to use as "side project" examples without his say.
- `reports/hep-explorer-backlog-and-guide-2026-07-12/`, `reports/legacy-tracker-migration-2026-08-24/` and `requirements/design/43_design.html`: likely to carry other people's names (issue authors, paper authors). Not checked further.
- `reports/blog-drafts-2026-07-12/`: drafts of his own prose.
- Captured and looked at, then not needed (nothing wrong found at a glance; not vetted line by line): `requirements/design/9_design.html`, `161_design.html`, `75_design.html`; `reports/fda-stf-static-displays-plan-2026-07-21/`, `executive-overview-2026-07-21/`, `gs-v1.3-demo/`, `app-dashboard-design-2026-07-28/`, `merge-view-design-2026-08-20/`, `open-csr-data-framework-2026-08-26/`, `safety-graphics-improvement-assessment-2026-07-17/`, `sv-v1.5-release-plan/`, and the decisions index. Their captures are not in the repo.

## Could not verify

- Whether any gsm.roadmap artifact may be shown in public. Only Jeremy can say, and only he can open them.
- Whether the ten obot.roadmap pages are acceptable on a keynote slide. They are public already; that is not the same as chosen for a stage.
- How the slide looks on the venue's projector. At 1600 × 900 the smallest text is 18 px (the callout's question); labels and the caption line are 21 px.

## Open for Jeremy

- Vet the ten pages (the links are on the slide and in its notes).
- Supply or approve real gsm.roadmap artifacts, if any can be shown; they would replace these and the caption line would go.
- Confirm the caption wording, which tells the room these are not the team's pages.
- Keep or drop the callout ("Designing pages!"); slide 20, just before, already carries two.
- Headline is a placeholder. Others considered: "A page to review at every gate"; "Every stage leaves a page a person can read"; "The artifacts: a web page at every stage".

---

Drafted by Claude Code using Opus 5.5 on 2026-10-05; not yet reviewed by @jwildfire.
