<!-- STATUS: OUTLINE (not prose) — REWRITE v2, 2026-07-18, for @jwildfire review. Jeremy writes the final prose; this is a story-shaped, fact-loaded scaffold. Do NOT publish as-is. -->
<!--
  ============================ OUTLINE NOTES (v2 rewrite) ============================
  WHAT CHANGED FROM v1 (per @jwildfire's 2026-07-17 direction):
    - Reframed from a technical-spec outline into a FIRST-PERSON DEV-DIARY STORY:
      the spine is now the Jim Buchanan conversation and the one-session
      collaboration arc, not the FDA method.
    - The dense composite-method beats are COMPRESSED to a short, higher-altitude
      "what the plot does and why it matters" — the full method moved to the
      Facts & links block as BACKING, not body.
    - Shorter overall; each section is 3-5 beats, not an exhaustive bullet dump.
    - PRESERVED unchanged: the verbatim lede (2 typo fixes), the embedded gif,
      the filled tokens/$ card, and the Opus-4.8 model correction.
    - Gif figure link RE-POINTED to production (PR #69 merged in v1.4.0;
      the pr/69 preview is torn down). See the GIF note below.

  DELIVERABLE TYPE: outline — Jeremy writes the prose. Beats + notes only.

  TITLE OPTIONS (front matter uses A):
    A. "R/Pharma Diary — Jim's First Ask: A Composite Plot for Messy Baselines"
    B. "R/Pharma Diary — I Asked What to Fix. The First Answer Shipped That Week."
    C. "R/Pharma Diary — One Conversation, One Session, One Feature"

  ⚠ NUMBERING DECISION (@jwildfire): "#7" was reserved for the "Anatomy of a
  Session" post, which isn't written yet. This post IS ready (PR #69 merged,
  v1.4.0 shipped). RECOMMENDATION: publish this as #7 now and renumber
  "Anatomy of a Session" to #8 — ship what's ready. Front matter below is left
  WITHOUT a hard series_part number pending your call (set series_part: 7 to
  take that slot, or 8 to keep #7 for Anatomy). Your editorial call.

  LEDE: reproduced VERBATIM below with exactly two typo fixes flagged:
    (1) "Clinical lead" -> "clinical lead"  (2) closing appositive comma after "Jim Buchanan"

  TOKENS/$ (receipts): ~176M tokens (~97% prompt-cache reads), ~$143 API-equivalent, $0 out-of-pocket (Max subscription).
  MODEL: the build ran on Claude Opus 4.8, NOT Fable 5 (the --model claude-fable-5 spawn was overridden — Fable 5 isn't selectable for background jobs). Verified from the job transcript.

  GIF: /assets/img/hep-explorer-composite.gif — the figure link now points to
  PRODUCTION (https://jwildfire.github.io/safety.viz/hep-explorer/), live as of
  v1.4.0. The gif itself was recorded from the identical composite view; re-record
  against production only if you want the address bar in-frame to read the prod URL.

  CROSS-POST TO big.blog: keep front matter byte-identical; rewrite the image path
  to /assets/images/2026-07-17/hep-explorer-composite.gif and copy the file in.
  NOTE: big.blog carries diary #1-#3 only; any {% post_url %} to #4/#5/#6 breaks
  its build until those are back-filled first.
  ======================================================================
-->
---
title: "R/Pharma Diary — Jim's First Ask: A Composite Plot for Messy Baselines"
author: "Jeremy Wildfire"
excerpt: "I asked safetyGraphics' original clinical lead what he'd change, and his very first idea was a working feature the same week. This is the story of that one conversation — and how far a single agent session got with it."
tags: RPharma AI Agents Autonomy OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
# series_part: pending — see NUMBERING DECISION in the outline comment above
date: "2026-07-17"
---

<!-- LEDE — verbatim hook (two typo fixes noted above). Body MUST open with prose, never a heading. -->
I demoed safety.viz for safetyGraphics' clinical lead, Jim Buchanan, this week and asked if he had any improvements in mind from the last few years, and no surprise, he had several! The first is available now — an additional workflow in hep-explorer based on [this paper from Tesfaldet et al.](https://doi.org/10.1007/s40264-024-01425-5)

## The ask

<!-- Goal: establish the STORY — a person, a question, and a fast turnaround. Higher altitude, not technical yet. Beats: -->
- The running thread of this diary has been one question: *what can these agent tools actually do right now, and how much of it without me in the loop?* This week I got to point that question at a real domain expert.
- Jim Buchanan was the clinical lead on safetyGraphics — he's spent years looking at the plots the field actually uses to catch drug-induced liver injury. So when the demo ended I asked the obvious thing: *what would you change?*
- He had a **list** — five ideas, none of them small. This post is about the **first** one, because it went from "here's a paper you should read" to a shipped, tested feature in **hep-explorer** inside the same week. The other four are queued behind it.
- <!-- Jeremy's call on tone: this is the collaboration-arc beat. The point isn't the plot yet — it's that an offhand expert suggestion became working software in days, with the build itself run by an agent. Note for honesty: the public roadmap report anonymizes the source as a "colleague to-do list (5 items)"; naming Jim here is your own first-person recollection, not a citation of that report. -->

## The idea: reading liver safety when the baseline is already a mess

<!-- Goal: COMPRESSED method — why the plot exists, in a few sentences. The full mechanics live in Facts & links as backing. Keep this high-altitude. Beats: -->
- The standard plot for liver safety — **eDISH** — assumes patients start roughly normal. Jim's point: a lot of them don't. In chronic hepatitis or chronic liver disease, the labs are *already* abnormal at day one, and eDISH does two bad things at once — it **cries wolf** on people who started high, and it **hides real change**, including a drug that genuinely made someone *better*.
- The fix Jim pointed me to is an **FDA composite plot** (Tesfaldet et al., *Drug Safety* 2024): show each on-treatment value against **two** yardsticks at once — the population norm *and* the patient's **own baseline**. Absolute risk and direction-of-change, side by side.
- One number makes it vivid (from the paper's chronic-hepatitis-C example): labs rose above baseline in **88% of placebo vs. 7% of study-drug** subjects — the drug pulled people *below* their own baseline. Classic eDISH would never show that as a benefit. <!-- optional, but it's the whole argument in one stat. -->
- That's the altitude for the body. The four-panel mechanics, the exact cut-lines, and the color-coded migration table are in the Facts block — pull them up only if a passage needs them.

## What shipped

<!-- Goal: the feature, WITH the gif. Higher altitude than v1 — what it is and what it feels like to use, not an implementation inventory. Beats: -->
- It landed as a **new view inside hep-explorer**, not a separate tool — a **View** toggle between the familiar eDISH scatter and the new **composite (baseline-referenced)** view. Same data you already load (standard ADaM baseline fields, no new domain), one extra way to read it.
- The composite view puts four linked panels on one screen: the baseline classification, the on-treatment migration (every point keeps its baseline color, so you *watch* people move), a shift plot against each patient's own baseline, and a color-coded migration table with a per-arm concern/benefit summary.

<figure style="margin:1.5em 0;">
  <a href="https://jwildfire.github.io/safety.viz/hep-explorer/"><img src="/assets/img/hep-explorer-composite.gif" alt="The hep-explorer composite plot: two baseline-colored eDISH scatters showing migration, a four-panel ×Baseline shift plot, and a color-coded migration table with a by-arm concern/benefit summary." style="width:100%; border:1px solid rgba(128,128,128,0.35); border-radius:8px;"></a>
  <figcaption style="font-size:0.8em; opacity:0.7; margin-top:4px;">The composite view, top to bottom: baseline &amp; on-treatment eDISH scatters (color carried from baseline so migration is visible), the four-panel ×Baseline shift plot, and the color-coded migration table + by-arm concern/benefit summary. <a href="https://jwildfire.github.io/safety.viz/hep-explorer/">Try it live →</a></figcaption>
</figure>

- It's a **faithful port, not a re-derivation** — the logic follows the FDA's own public-domain reference code, kept as small unit-tested functions rather than reinvented.
- Because real demo data (xanomeline) has almost no abnormal baselines, the view would look empty — so the build injects a clearly-labeled **synthetic chronic-liver-disease cohort** (64 subjects, study-drug vs. placebo) so you can actually see the payoff: the treated arm skews toward the "benefit" corner. <!-- honesty beat, optional: the demo also says on screen "295 of 318 shown" — it excludes participants lacking usable baseline+on-treatment labs rather than hiding the gap. -->

## The receipts: one conversation, one session, one PR

<!-- Goal: the "how it was made" proof, tightened. Beats: -->
- The pipeline, end to end: **one implementation issue** (safety.viz#67, scoped from the roadmap assessment, not a vibe) → **one agent session** (Claude Opus 4.8, `--effort high`: recon → design → red-green TDD → adversarial review) → **one draft PR** (#69, `Closes #67`), green in CI, shipped in **v1.4.0**.
- What the repo independently backs: the issue and PR, the TDD/worktree discipline, the red-green-shaped composite tests (22 unit + 5 browser) on top of hep-explorer's ~400-test suite, green CI. <!-- @jwildfire: the "single session" and "adversarial-review-all-fixed" framing come from the session log, not the PR — keep them because you have the log; soften if you'd rather cite only what a reader can verify in the repo. -->
- **The metrics.** One Opus 4.8 session, roughly **176M tokens** — but ~**97%** of that was prompt-cache *reads* (a tenth of input price), which is just what a long agentic session looks like re-reading its own context every turn. **API-equivalent ≈ $143** at list prices; **actual marginal cost: $0**, inside the Max subscription. *(Stat card, Diary-#6 style: `176M tokens · ~$143 API-equivalent · $0 out-of-pocket`.)*
- **Still shipped-in-draft on purpose** until the merge+tag gate — the human stays on the release button even when the agent does the build. <!-- Close forward: this was idea #1 of Jim's five. -->

<!-- REQUIRED before publish (site AGENTS.md): end with an [^ai] AI-collaboration footnote stating the REAL split for THIS post. Suggested:
[^ai]: I wrote the prose. A background Claude session drafted this outline — reading the Tesfaldet paper, verifying the PR/issue/test facts against the repo, and matching the diary format. The feature itself (issue #67 → PR #69) was built in a separate Opus 4.8 agent session. -->

---

## Facts & links (BACKING for drafting — not for publication)

**Paper (the method):** Tesfaldet B, Patel T, Chen M, Pucino F, Rosario L, Hayashi P, Navarro Almario E. "Composite Plot for Visualizing Aminotransferase and Bilirubin Changes in Clinical Trials of Subjects with Abnormal Baseline Values." *Drug Safety* 2024;47:699–710. DOI 10.1007/s40264-024-01425-5. FDA author group; Paul "Skip" Hayashi a co-author.
**FDA reference code:** https://github.com/FDA/Composite-eDISH-Plot (MIT; Zenodo DOI 10.5281/zenodo.10892050).
**Roadmap report (Initiative 01, full method write-up):** https://jwildfire.github.io/obot.roadmap/reports/safety-graphics-improvement-assessment-2026-07-17/ — anonymizes the source as "colleague to-do list (5 items)"; does **not** name Jim Buchanan.
**Implementation issue:** https://github.com/jwildfire/safety.viz/issues/67
**Pull request (merged in v1.4.0, Closes #67):** https://github.com/jwildfire/safety.viz/pull/69
**Production view (live):** https://jwildfire.github.io/safety.viz/hep-explorer/
**Release:** https://github.com/jwildfire/safety.viz/releases/tag/v1.4.0
**Prior diary posts to cross-link (Liquid):** hep-explorer intro — `{% post_url 2026-07-13-obot-v3-billion-tokens %}`; safety.viz intro — `{% post_url 2026-07-12-introducing-safety-viz %}`.

**The full method (compressed out of the body — pull up only as needed):**
- eDISH cut-lines: ALT > 3×ULN, BILI > 2×ULN. Baseline-quadrant symbols: Normal/Near-Normal = green square; Cholestasis = amber circle; Temple's Corollary = blue plus; Hy's Law = red triangle.
- Step 1 pretreatment eDISH classifies baseline; Step 2 peak on-treatment eDISH shows migration (points keep baseline color); Step 3 four-panel ×Baseline shift plot (peak ÷ own baseline, 1×/3×/5× reference lines) makes benefit visible.
- Migration table: 4×4 baseline-vs-on-treatment counts; red = concern, yellow = potential concern, green = no concern / potential benefit, gray = no migration (diagonal). Compare across arms for imbalance in harm *or* benefit.

**Key numbers (verified — safe to cite):**
- Composite feature tests: **22 unit + 5 browser/e2e** (module suite ~400 unit). All green in CI; coverage IDs HEP-COMP-001..006 (007 added for participant cross-linking).
- Synthetic demo cohort: **64 subjects** = 32 "CLD: Study Drug" + 32 "CLD: Placebo"; deterministic/reproducible; injected into `site/data/adbds.csv`.
- Demo composite view shows **295 of 318** participants (23 excluded for missing usable baseline/on-treatment labs).
- CHC benefit stat (paper): ALT > baseline in **88% placebo vs. 7% study-drug**.
- Model for the build: **Claude Opus 4.8** (`--effort high`), verified from the transcript. (The #67/#69 attribution lines were corrected from "Fable 5" to Opus 4.8 on 2026-07-17.)

---

*This outline was drafted by Claude Code (Opus 4.8) — a background 👯🤖 session — and reviewed by @jwildfire.*
