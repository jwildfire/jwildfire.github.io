<!-- STATUS: PROSE DRAFT (filled in from @jwildfire's outline), 2026-07-19, for @jwildfire review/edit. -->
<!--
  All facts below were re-verified live against the safety.viz / obot.roadmap repos on 2026-07-19
  (both PRs are merged, v1.4.0 is released, both demos are live — written in shipped tense, not
  draft tense). The token/cost stat cards for BOTH builds were computed fresh by summing usage
  across each build session's own transcript (main + every workflow subagent) — not carried over
  from an earlier draft. Still your call:

  - TITLE/EXCERPT: rewritten below to cover both prototypes (the old title only named the composite
    plot). Swap freely — this was the "R/Pharma Diary — Jim's First Ask" line before.
  - NUMBERING: "#7" was reserved for "Anatomy of a Session" (not yet written); this post is ready
    now. Recommend publishing this as #7 and renumbering Anatomy to #8. series_part left unset
    below pending your call.
  - CROSS-POST TO big.blog: keep front matter byte-identical; rewrite image paths to
    /assets/images/2026-07-17/... and copy the two gif files in. big.blog carries diary #1-#3
    only — any {% post_url %} to #4-#6 breaks its build until those are back-filled.
  - The "Facts & links" block at the very bottom is backing material for your edit pass — delete
    it before publishing, along with this comment and the [^ai] footnote's surrounding scaffolding
    if you rewrite it in your own voice.
-->
---
title: "R/Pharma Diary — Jim's List: Two Prototypes, One Evening"
author: "Jeremy Wildfire"
excerpt: "I asked safetyGraphics' original clinical lead what he'd change, and two of his ideas turned into working, tested prototypes the same night. This is the story of that conversation — and how far two agent sessions got with it."
tags: RPharma AI Agents Autonomy OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
# series_part: pending — see NUMBERING DECISION in the outline comment above
date: "2026-07-17"
---

I demoed safety.viz for safetyGraphics' clinical lead, Jim Buchanan, this week and asked if he had any improvements in mind, and no surprise, he had a few! Jim promptly sent a handful of references, which I passed along to Obot. A few hours later, two new prototypes are available — an additional workflow in hep-explorer based on [this paper from Tesfaldet et al.](https://doi.org/10.1007/s40264-024-01425-5) and a partial implementation of a new clinical pipeline for monitoring cardiac outcomes.

## Hepatic Explorer — Composite View

In Tesfaldet et al.'s ["Composite Plot for Visualizing Aminotransferase and Bilirubin Changes in Clinical Trials of Subjects with Abnormal Baseline Values"](https://doi.org/10.1007/s40264-024-01425-5) (*Drug Safety*, 2024), — an FDA team addresses a real gap in eDISH: it assumes patients start out normal, and a lot of liver-disease trial subjects don't. Their fix reads every on-treatment lab against two yardsticks at once — the population norm and the patient's own baseline — so a drug that's genuinely helping an already-abnormal patient shows up as a benefit instead of getting flagged as a false alarm. The FDA published its [reference implementation](https://github.com/FDA/Composite-eDISH-Plot) under the MIT license — a real thank-you is owed for that, and it's a big part of why this shipped in an afternoon instead of a month.

I sent Claude the paper and asked for an ultracode implementation. One Opus 4.8 session later — `176M tokens · ~$143 API-equivalent · $0 out-of-pocket` (Max subscription; ~97% of those tokens were prompt-cache reads, which is just what a long agent session looks like) — hep-explorer had a new composite view, faithfully ported from the FDA's own code, with 22 unit and 5 browser tests on top of the module's ~400-test suite, all green. It's [live now](https://jwildfire.github.io/safety.viz/hep-explorer/).

<figure style="margin:1.5em 0;">
  <a href="https://jwildfire.github.io/safety.viz/hep-explorer/"><img src="/assets/img/hep-explorer-composite.gif" alt="The hep-explorer composite plot: two baseline-colored eDISH scatters showing migration, a four-panel ×Baseline shift plot, and a color-coded migration table with a by-arm concern/benefit summary." style="width:100%; border:1px solid rgba(128,128,128,0.35); border-radius:8px;"></a>
  <figcaption style="font-size:0.8em; opacity:0.7; margin-top:4px;">The composite view, top to bottom: baseline &amp; on-treatment eDISH scatters (color carried from baseline so migration is visible), the four-panel ×Baseline shift plot, and the color-coded migration table + by-arm concern/benefit summary. <a href="https://jwildfire.github.io/safety.viz/hep-explorer/">Try it live →</a></figcaption>
</figure>

## QT Safety Explorer — Prototype

Jim's second reference wasn't a paper, it was two design documents behind the [SafetyGraphics/qtexplorer](https://github.com/SafetyGraphics/qtexplorer) tool: a CSRC-reviewed *Example QT Tool Display* mockup and an ICH E14 *Draft Clinical Workflow* (28 Apr 2025), both produced with the Cardiac Safety Research Consortium for non-TQT and TQT-waiver studies. QT/QTc prolongation screening is a required check for nearly every new drug, and safety.viz didn't have a cardiac-safety renderer yet — same open-source ISG working group behind hep-explorer's ancestor, this time with no existing Chart.js port to lean on.

Same shape, second session: I passed Claude the two documents and the demo data. `308M tokens · ~$241 API-equivalent · $0 out-of-pocket` bought a QT Safety Explorer prototype — central-tendency, outlier-scatter, and categorical views, on real ADEG data (254 subjects) — plus a pre-build design critique (three independent lenses caught 9 real issues before a line of code was written) and 431 unit and 145 e2e tests, all green. One more prompt and an [ICH-E14 clinical workflow guide](https://jwildfire.github.io/safety.viz/qt-explorer/guide.html) was live too. It ships marked **Experimental**: Phase 1 covers the two core screening displays the workflow leads with; the deeper investigation layer — individualized correction, per-subject drill-down, the QT-RR hysteresis plot, a guided evaluation mode — is written up as [six follow-up items](https://github.com/jwildfire/obot.roadmap/issues/37) Claude scoped out for Phase 2.

<figure style="margin:1.5em 0;">
  <a href="https://jwildfire.github.io/safety.viz/qt-explorer/"><img src="/assets/img/qt-explorer-demo.gif" alt="The QT Safety Explorer: the central-tendency Δ/ΔΔ view with a confidence band and ICH-E14 metric, the outlier scatter with absolute-QTc diagonals, and the by-arm categorical exceedance table." style="width:100%; border:1px solid rgba(128,128,128,0.35); border-radius:8px;"></a>
  <figcaption style="font-size:0.8em; opacity:0.7; margin-top:4px;">The three QT Safety Explorer views: central tendency (Δ / placebo-corrected ΔΔ with a 90% CI band), the flagship outlier scatter, and the by-arm categorical exceedance table. <a href="https://jwildfire.github.io/safety.viz/qt-explorer/">Try it live →</a></figcaption>
</figure>

## Wrapup

Back to the question this diary keeps circling: what can AI do today? Point it at a domain expert's reading list and it can turn two references into two tested, demoable prototypes in one evening — that's the "quickly expand the platform" half of the answer. The other half is what it still can't do: neither prototype ships for real until Jim and the other reviewers look at the plots and confirm they're right.

Up next: seeing how far a fully autonomous session can get without me in the loop at all.

[^ai]: I wrote the outline — the beats, the facts to check, the shape of the story. A background Claude Code session (Opus 4.8) turned it into this prose: reading the Tesfaldet paper and the QT design documents, verifying every PR/issue/test claim against the repos, and pulling the token and cost figures directly from each build session's own transcript. The two features themselves — hep-explorer's composite view (issue #67 → PR #69) and the QT Safety Explorer prototype (issue #68 → PR #70) — were each built in a separate Opus 4.8 agent session.

---

## Facts & links (BACKING for drafting — not for publication)

### Hepatic Explorer — Composite View

**Paper:** Tesfaldet B, Patel T, Chen M, Pucino F, Rosario L, Hayashi P, Navarro Almario E. "Composite Plot for Visualizing Aminotransferase and Bilirubin Changes in Clinical Trials of Subjects with Abnormal Baseline Values." *Drug Safety* 2024;47:699–710. DOI 10.1007/s40264-024-01425-5. FDA author group; Paul "Skip" Hayashi a co-author.
**FDA reference code:** https://github.com/FDA/Composite-eDISH-Plot (MIT; Zenodo DOI 10.5281/zenodo.10892050).
**Roadmap report (Initiative 01):** https://jwildfire.github.io/obot.roadmap/reports/safety-graphics-improvement-assessment-2026-07-17/ — anonymizes the source as "colleague to-do list (5 items)"; does **not** name Jim Buchanan.
**Implementation issue:** https://github.com/jwildfire/safety.viz/issues/67
**Pull request (MERGED 2026-07-18, in v1.4.0, Closes #67):** https://github.com/jwildfire/safety.viz/pull/69
**Production view:** https://jwildfire.github.io/safety.viz/hep-explorer/
**Tests:** 22 unit + 5 browser/e2e (module suite ~400 unit). Synthetic demo cohort: 64 subjects (32 "CLD: Study Drug" + 32 "CLD: Placebo").
**Tokens/cost (verified from job 758a52fa's own transcript, main + subagents):** 175,966,040 tokens, ~97% cache reads. API-equivalent ~$143 (Opus 4.8 ~$123 + a Fable-5 subagent slice ~$20). $0 out-of-pocket (Max subscription). Model: **Claude Opus 4.8** — the `claude-fable-5` bg spawn flag is silently overridden to Opus 4.8; only in-workflow agent() calls can actually select Fable 5.

### QT Safety Explorer — Prototype

**Source app:** [SafetyGraphics/qtexplorer](https://github.com/SafetyGraphics/qtexplorer) — R package from the ISG, MIT-licensed, ships 3 sample ECG datasets (Thorough QT / two phase-2b studies) with a hosted Shiny demo.
**Design docs (named, not publicly hosted):** *Example QT Tool Display v2* mockup + *Draft Clinical Workflow* (28 Apr 2025), both CSRC-reviewed. Referenced by name in obot.roadmap#36; no public URL found.
**Parent requirement:** https://github.com/jwildfire/obot.roadmap/issues/36 (Phase 1 + Phase 2 phasing decision)
**Phase-2 requirement (6 deferred items):** https://github.com/jwildfire/obot.roadmap/issues/37
**Implementation issue:** https://github.com/jwildfire/safety.viz/issues/68
**Pull request (MERGED 2026-07-18, in v1.4.0, Closes #68):** https://github.com/jwildfire/safety.viz/pull/70
**Production view:** https://jwildfire.github.io/safety.viz/qt-explorer/ (badge: Experimental) — also `/guide.html`, `/evidence.html`, `/api.html`, all live.
**Demo data:** pharmaverseadam `adeg.csv` (CDISC Pilot 01), 254 subjects, Placebo / Xanomeline Low / Xanomeline High. No PR/QRS or moxifloxacin arm in the pilot data (expected, noted in-app).
**Tests:** 431 unit + 145 e2e, all green (per qt-explorer-workstream memory, final ship state).
**Design critique (pre-build, verified from job 4826ced7's workflow transcripts):** 3 independent lenses (clinical-stats fidelity, CSRC-mockup fidelity, codebase-reuse architecture) reviewed the design doc against the two source documents and the existing renderers; synthesized into a punch-list of blockers/majors/minors, applied before coding started.
**Adversarial review (post-build):** 9 confirmed correctness/robustness findings, all fixed, 3 regression tests added (per session log, PR #70).
**Tokens/cost (computed fresh, 2026-07-19, by summing job 4826ced7's own transcript, main + all subagents incl. the two design-critique/review workflows):** 307,553,785 tokens, ~98% cache reads. API-equivalent ~$241 (Opus 4.8 ~$180 + a Fable-5 subagent slice ~$61, same pattern as hep-explorer). $0 out-of-pocket (Max subscription). Model: Claude Opus 4.8 for the main build; the design-critique and adversarial-review workflow stages explicitly selected Fable 5 for those judgment-heavy lenses.
**Pricing basis:** Opus 4.8 $5/$25/$6.25cw/$0.50cr per M tokens; Fable 5 $10/$50/$12.5/$1.00 per M tokens (input/output/cache-write/cache-read).

**Prior diary posts to cross-link (Liquid):** hep-explorer intro — `{% post_url 2026-07-13-obot-v3-billion-tokens %}`; safety.viz intro — `{% post_url 2026-07-12-introducing-safety-viz %}`.

---

*This post was drafted by Claude Code (Opus 4.8) — a background 👯🤖 session, prose filled in from @jwildfire's outline — and reviewed by @jwildfire.*
