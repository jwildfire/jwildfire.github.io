<!-- STATUS: OUTLINE (not prose) — drafted 2026-07-17 for @jwildfire review. Jeremy writes the final prose; this is a fact-loaded scaffold. Do NOT publish as-is. -->
<!--
  ============================ OUTLINE NOTES ============================
  DELIVERABLE TYPE: outline — title options + verbatim lede + fact-loaded
  section beats + embedded gif. Jeremy writes the prose.

  TITLE OPTIONS (pick one; front matter below uses A):
    A. "R/Pharma Diary #7 — Jim's First Ask: A Composite Plot for Messy Baselines"
    B. "R/Pharma Diary #7 — Reading Liver Safety When the Baseline Is Already Abnormal"
    C. "R/Pharma Diary #7 — One Paper, One Session: hep-explorer Learns the FDA Composite Plot"

  LEDE: Jeremy's hook is reproduced VERBATIM below, with exactly two typo
  fixes flagged here for your review:
    (1) "Clinical lead" -> "clinical lead" (mid-sentence capitalization)
    (2) added the closing appositive comma after "Jim Buchanan"
  Revert either if you meant something else.

  TOKENS/$ (Section 4): FILLED — ~176M tokens (~97% prompt-cache reads), ~$143 API-equivalent, $0 out-of-pocket (Max subscription).
  MODEL CORRECTION: the build ran on Claude Opus 4.8, NOT Fable 5 — the --model claude-fable-5 spawn was overridden to Opus 4.8 (Fable 5 isn't selectable for background jobs). Verified from the job transcript.

  GIF: /assets/img/hep-explorer-composite.gif is recorded from the PR #69
  PREVIEW (https://jwildfire.github.io/safety.viz/pr/69/hep-explorer/index.html),
  which is TORN DOWN when the PR merges. Before publishing, re-point the figure
  link to the PRODUCTION URL: https://jwildfire.github.io/safety.viz/hep-explorer/
  (and, ideally, re-record the gif against production so it never 404s).

  CROSS-POST TO big.blog: keep front matter byte-identical; rewrite the image
  path from /assets/img/hep-explorer-composite.gif to
  /assets/images/2026-07-17/hep-explorer-composite.gif and copy the file into
  big.blog/assets/images/2026-07-17/. NOTE: big.blog currently only carries
  diary #1–#3; any {% post_url %} link to #4/#5/#6 will BREAK the big.blog build
  until those are cross-posted first.
  ======================================================================
-->
---
title: "R/Pharma Diary #7 — Jim's First Ask: A Composite Plot for Messy Baselines"
author: "Jeremy Wildfire"
excerpt: "I asked safetyGraphics' original clinical lead what he'd change, and his first idea turned into a working feature the same week: an FDA composite plot for reading liver safety in patients whose baseline labs are already abnormal. Here's the method, the build, and the receipts."
tags: RPharma AI Agents Autonomy OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 7
date: "2026-07-17"
---

<!-- LEDE — verbatim hook (two typo fixes noted in the outline comment above). Body MUST open with prose, never a heading. -->
I demoed safety.viz for safetyGraphics' clinical lead, Jim Buchanan, this week and asked if he had any improvements in mind from the last few years, and no surprise, he had several! The first is available now — an additional workflow in hep-explorer based on [this paper from Tesfaldet et al.](https://doi.org/10.1007/s40264-024-01425-5)

<!-- OPTIONAL BRIDGE BEAT (Jeremy's call): one sentence tying this to the running diary thread — "what can these tools do right now, and how much autonomously?" — and noting Jim's list had five ideas; this post is the first. The public roadmap report anonymizes the source as a "colleague to-do list (5 items)," so if you name Jim here keep it to your own first-person recollection, not a citation of the report. -->

## The workflow: an FDA composite plot for abnormal baselines

<!-- Goal of this section: explain the METHOD (the paper), so a reader gets why it exists before seeing the build. Beats: -->

- **The blind spot.** The standard eDISH plot (peak ALT vs. peak total bilirubin, each in multiples of the population upper limit of normal, ×ULN) is the workhorse for spotting drug-induced liver injury (DILI). But it assumes a roughly normal starting point. For patients who begin a trial with **already-abnormal liver tests** — chronic hepatitis, chronic liver disease — ×ULN eDISH does two bad things at once: it raises **false alarms** (people who started high look dangerous) and it **masks real change** (a drug that actually *improved* someone's labs still plots in a scary quadrant).
- **The fix, in one line.** Show the on-treatment values two ways at once — against the population norm (×ULN) *and* against **each subject's own baseline (×BLN)** — so you can see both absolute risk and the direction/size of change from where that person started.
- **The authors.** Tesfaldet, Patel, Chen, Pucino, Rosario, **Hayashi** (Paul "Skip" Hayashi), Navarro Almario — an **FDA** author group. *Drug Safety* 2024;47:699–710. DOI [10.1007/s40264-024-01425-5](https://doi.org/10.1007/s40264-024-01425-5). FDA also published **public-domain reference code** ([FDA/Composite-eDISH-Plot](https://github.com/FDA/Composite-eDISH-Plot), MIT / Zenodo DOI 10.5281/zenodo.10892050) — which matters a lot for Section 4.
- **Step 1 — Pretreatment eDISH (classify the baseline).** Log-log scatter of *baseline* BILI vs. ALT in ×ULN. Two cut-lines — **ALT > 3×ULN** (vertical) and **BILI > 2×ULN** (horizontal) — sort everyone into four quadrants, each given a persistent colored symbol:
  - Normal & Near-Normal → **green square**
  - Cholestasis (BILI high, ALT not) → **amber circle**
  - Temple's Corollary (ALT high, BILI not) → **blue plus/cross**
  - Hy's Law (both high) → **red triangle**
- **Step 2 — Peak on-treatment eDISH (show migration).** Same plot, now for *peak on-treatment* values — but every point **keeps its baseline color**. Color = where you started; position = where you ended. Movement between the two scatters *is* the migration. (Paper's example: a subject who was Hy's-Law at baseline migrates to Cholestasis on treatment as only bilirubin stays up.)
- **Step 3 — Four-panel ×Baseline shift plot (magnitude vs. your own baseline).** Split subjects into four panels by their baseline quadrant and re-plot peak ALT/BILI as multiples of **their own baseline** (×BLN = peak ÷ baseline), with **1× / 3× / 5×** reference lines. Left of 1× = ALT dropped; below 1× = bilirubin dropped. This is where **benefit** becomes visible: a treated patient whose labs fell below their own baseline lands in the "good" corner.
- **Plus a color-coded migration table.** A 4×4 baseline-vs-on-treatment count matrix, cells colored by level of concern: **red = migration of concern, yellow = potential concern, green = no concern / potential benefit, gray = no migration (the diagonal)**. Compare tables across arms to spot imbalance in harm *or* benefit.
- <!-- OPTIONAL clinical credibility beat: the paper illustrates on two real trials (a 6-month placebo-controlled chronic-liver-disease study, ~45/arm; and a 12-week chronic hepatitis C study). One vivid number if you want it: in the CHC study, ALT > baseline in 88% of placebo vs. 7% of study-drug subjects — the drug pulled labs *below* baseline, which ×ULN eDISH alone would never surface as benefit. -->
- **Full method write-up** lives in the roadmap report (Initiative 01) — link in the facts block below.

## The build: a new view in hep-explorer

<!-- Goal: what actually shipped, WITH the gif. Beats: -->

- **It's a new *view*, not a new tool.** hep-explorer already shipped in safety.viz (Diary #6). This adds a **View** toggle: `eDISH / mDISH scatter` ⇄ **`Composite plot (baseline-referenced)`**. Same module, same data model (standard ADaM BASE/ABLFL — **no new data domain**), same renderer shell; it just opens on the composite view with a trimmed control set.
- **Four linked panels on one screen** (the gif walks all four):
  1. **Pretreatment eDISH** (baseline ×ULN) — classifies each subject, sets the anchor color/shape.
  2. **Peak on-treatment eDISH** (peak ×ULN) — same points keep their baseline color, so migration reads across the two scatters.
  3. **Four-panel ×Baseline shift plot** — one panel per on-treatment quadrant, peak-vs-own-baseline with 1×/3×/5× reference lines (drawn by a new `referenceLinePlugin`).
  4. **Color-coded migration table + by-arm concern/benefit summary** — the 4×4 matrix plus a per-arm rollup of red/yellow/green/gray so you can compare concerning vs. potentially-beneficial change across treatment arms.

<figure style="margin:1.5em 0;">
  <a href="https://jwildfire.github.io/safety.viz/pr/69/hep-explorer/index.html"><img src="/assets/img/hep-explorer-composite.gif" alt="The hep-explorer composite plot: two baseline-colored eDISH scatters showing migration, a four-panel ×Baseline shift plot, and a color-coded migration table with a by-arm concern/benefit summary." style="width:100%; border:1px solid rgba(128,128,128,0.35); border-radius:8px;"></a>
  <figcaption style="font-size:0.8em; opacity:0.7; margin-top:4px;">The composite view, top to bottom: baseline &amp; on-treatment eDISH scatters (color carried from baseline so migration is visible), the four-panel ×Baseline shift plot, and the color-coded migration table + by-arm concern/benefit summary. <!-- PRE-PUBLISH: re-point this link + gif to the production URL https://jwildfire.github.io/safety.viz/hep-explorer/ once PR #69 merges (the pr/69 preview is torn down on merge). --></figcaption>
</figure>

- **It's a faithful port, not a re-derivation.** `src/hep-explorer/composite.js` ports the FDA reference R (`Composite_eDISH_Model.R`) directly — strict `> 3×ULN / > 2×ULN` cuts, peak taken as the max over **on-treatment records only** (baseline/screening excluded), per-analyte; the authoritative 4×4 concern matrix (5 red / 2 yellow / 5 green / 4 gray) copied from the source. Kept as pure, unit-testable functions.
- **New synthetic demo cohort.** Real pharmaverse ADaM data (xanomeline) has almost no abnormal baselines, so the composite view would look empty. A generator (`scripts/build-hep-composite-cohort.mjs`) injects a **deterministic, byte-reproducible** synthetic **chronic-liver-disease cohort — 64 subjects (32 "CLD: Study Drug" + 32 "CLD: Placebo")** with abnormal baselines, clearly labeled synthetic (USUBJID `CLD-*`, site "Hepatology Research Unit"), provenance in `docs/DATA_SOURCES.md`. In the live demo you can see the payoff: the CLD study-drug arm skews toward green (benefit) migrations vs. its placebo arm.
- **Tested, and green.** The composite feature adds **22 unit tests** (`composite.test.js`, hand-computed cases) **+ 5 browser/e2e tests** (opens on composite view; draws the panels, shift plot, legend, migration table, by-arm summary; View toggles; degrades gracefully to a note when no subject has usable baseline + on-treatment labs) — on top of hep-explorer's ~400-test suite. All green in CI. Coverage IDs `HEP-COMP-001..006`; a clinician-facing guide (`docs/guides/hep-explorer.md`) documents the DILI workflow the view completes.
- <!-- HONESTY BEAT (optional, on-brand): worth a footnote — the demo excludes 23 of 318 participants who lack a usable baseline + on-treatment ALT/bilirubin, and the view says so on screen ("295 of 318 shown"). The port also deliberately mirrors the paper's known limitation (no ALP-based cholestasis refinement) rather than papering over it. -->

## The process: one issue, one session, one PR

<!-- Goal: the "how it was made" receipts. Beats: -->

- **The pipeline.** Filed implementation issue **safety.viz#67** → **one ultracode session** (Claude Opus 4.8, `--effort high`: recon → design-locked → red-green TDD → adversarial review) → **draft PR safety.viz#69** (`Closes #67`), CI green, held for the merge+tag gate.
- **Roadmap-first.** #67 wasn't a vibe — it was scoped from Initiative 01 of the improvement assessment (the "colleague to-do list," sequenced hep-first because the FDA reference code was already in hand), then written up with the full data contract (ADaM BASE/ABLFL, no new domain), the synthetic-cohort requirement, and the TDD + evidence-baseline mandate before a line of code.
- **What the repo independently confirms:** issue + PR both attributed to *Claude Code using Fable 5*; the TDD/worktree mandate; the red-green-shaped 22-unit + 5-e2e composite tests; a single squashed feature commit + an evidence-baseline commit; green CI.
- **What it can't confirm — flag honestly:** the *single-session* framing, the exact `--effort high` setting, and the 6-finding adversarial-review-all-fixed step aren't recorded in the repo (no PR reviews, no findings artifacts). <!-- @jwildfire: these come from the session log, not the PR. Keep them only if the session record backs them; otherwise soften to "an adversarial review pass" without the count. -->
- **The metrics.** One ultracode session on **Claude Opus 4.8** (`--effort high`). Roughly **176M tokens** total — but ~**97%** (171M) were prompt-cache *reads*, billed at a tenth of input price; that's just what a long agentic session looks like, re-reading its whole context every turn. **API-equivalent ≈ $143** at list prices (Opus 4.8 is $5 / $25 per million input/output tokens, cache reads $0.50/M; a small slice ran on Fable-5 sub-agents). **What I actually paid: $0 marginal** — it ran inside the Claude Code Max subscription. *(Diary-#6-style stat card: `176M tokens · ~$143 API-equivalent · $0 out-of-pocket`.)*
- **Still in draft on purpose.** Per the release convention, Jeremy merges and tags. PR #69 is finished and green but deliberately unmerged — shipped-in-draft, awaiting the gate. <!-- Close the post by pointing forward: four more of Jim's ideas are queued behind this one. -->

<!-- REQUIRED before publish (site AGENTS.md): end the post with an [^ai] AI-collaboration footnote stating the REAL split for THIS post. Suggested, edit to match reality:
[^ai]: I wrote the prose. A background Claude session drafted this outline — reading the Tesfaldet paper, verifying the PR/issue/test facts against the repo, recording the demo gif, and matching the diary's format. The feature itself (issue #67 → PR #69) was built in a separate Fable 5 ultracode session. -->

---

## Facts & links (for drafting — not for publication)

**Paper (Section 2 source):** Tesfaldet B, Patel T, Chen M, Pucino F, Rosario L, Hayashi P, Navarro Almario E. "Composite Plot for Visualizing Aminotransferase and Bilirubin Changes in Clinical Trials of Subjects with Abnormal Baseline Values." *Drug Safety* 2024;47:699–710. DOI 10.1007/s40264-024-01425-5. FDA author group; Paul "Skip" Hayashi a co-author.
**FDA reference code:** https://github.com/FDA/Composite-eDISH-Plot (MIT; Zenodo DOI 10.5281/zenodo.10892050).
**Roadmap report (Initiative 01, full method write-up):** https://jwildfire.github.io/obot.roadmap/reports/safety-graphics-improvement-assessment-2026-07-17/ — "Safety Graphics — Improvement Requirements & Feasibility." Covers 5 ideas; hep-composite sequenced first. NOTE: report anonymizes the source as "colleague to-do list (5 items)"; it does **not** name Jim Buchanan.
**Implementation issue:** https://github.com/jwildfire/safety.viz/issues/67
**Pull request (draft, green, Closes #67, awaiting merge):** https://github.com/jwildfire/safety.viz/pull/69 — title "hepExplorer: composite plot for subjects with abnormal baseline liver tests (#67)".
**Live PR preview (source of the gif; torn down on merge):** https://jwildfire.github.io/safety.viz/pr/69/hep-explorer/index.html
**Production URL (use after merge):** https://jwildfire.github.io/safety.viz/hep-explorer/
**Prior diary posts to cross-link (Liquid):** hep-explorer intro — `{% post_url 2026-07-13-obot-v3-billion-tokens %}`; safety.viz intro — `{% post_url 2026-07-12-introducing-safety-viz %}`.

**Key numbers (verified against repo/paper — safe to cite):**
- eDISH cut-lines: ALT > 3×ULN, BILI > 2×ULN.
- Baseline-quadrant symbols: Normal & NN = green square; Cholestasis = amber circle; Temple's Corollary = blue plus; Hy's Law = red triangle.
- ×BLN shift-plot reference lines: 1× / 3× / 5×.
- Migration-table color code: red = concern, yellow = potential concern, green = no concern / potential benefit, gray = no migration (diagonal).
- Composite feature tests: **22 unit + 5 browser/e2e** (module suite ~400 unit). All green in CI.
- Synthetic demo cohort: **64 subjects** = 32 "CLD: Study Drug" + 32 "CLD: Placebo"; deterministic/reproducible; injected into `site/data/adbds.csv`.
- Demo composite view shows **295 of 318** participants (23 excluded for missing usable baseline/on-treatment labs).
- Model for the build: **Claude Opus 4.8** (`--effort high`), verified from the job transcript. NOTE: the #67/#69 attribution lines currently read *using Fable 5* — inaccurate (the background spawn requested Fable 5 but the runner used Opus 4.8); correct before publishing.

---

*This outline was drafted by Claude Code (Opus 4.8) — a background 👯🤖 session — and reviewed by @jwildfire.*
