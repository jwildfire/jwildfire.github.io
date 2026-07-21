---
title: "R/Pharma Diary #7 — Papers → Prompts → Prototypes"
author: "Jeremy Wildfire"
excerpt: "I asked safetyGraphics' original clinical lead what he'd change, and two of his ideas turned into working, tested prototypes the same night."
tags: RPharma AI Agents Autonomy OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 7
date: "2026-07-17"
---

I demoed safety.viz for safetyGraphics' clinical lead, Jim Buchanan, this week and asked if he had any improvements in mind, and no surprise, he had a few! Jim promptly sent a handful of references, which I passed along to Obot. A few hours later, two new prototypes are available — an additional workflow in hep-explorer based on [this paper from Tesfaldet et al.](https://doi.org/10.1007/s40264-024-01425-5) and a partial implementation of a new clinical pipeline for monitoring cardiac outcomes.[^ai]

## Hepatic Explorer — Composite View

Tesfaldet et al.'s ["Composite Plot for Visualizing Aminotransferase and Bilirubin Changes in Clinical Trials of Subjects with Abnormal Baseline Values"](https://doi.org/10.1007/s40264-024-01425-5) (*Drug Safety*, 2024) updates eDISH best practice to compare labs against both the population norm and the patient's own baseline. The FDA published a [reference implementation](https://github.com/FDA/Composite-eDISH-Plot) under the permissive MIT license.

I sent Claude the paper and reference code and asked for an ultracode implementation in `safety.viz`. One Opus 4.8 session later (176M tokens, ~$143 API-equivalent)[^max], hep-explorer had a new composite view, ported from the FDA's own code, and [robust test evidence](https://jwildfire.github.io/safety.viz/hep-explorer/evidence.html). It's [live now](https://jwildfire.github.io/safety.viz/hep-explorer/) and shown below.

<figure style="margin:1.5em 0;">
  <a href="https://jwildfire.github.io/safety.viz/hep-explorer/"><img src="/assets/img/hep-explorer-composite.gif" alt="The hep-explorer composite plot: two baseline-colored eDISH scatters showing migration, a four-panel ×Baseline shift plot, and a color-coded migration table with a by-arm concern/benefit summary." style="width:100%; border:1px solid rgba(128,128,128,0.35); border-radius:8px;"></a>
  <figcaption style="font-size:0.8em; opacity:0.7; margin-top:4px;">The composite view, top to bottom: baseline &amp; on-treatment eDISH scatters (color carried from baseline so migration is visible), the four-panel ×Baseline shift plot, and the color-coded migration table + by-arm concern/benefit summary. <a href="https://jwildfire.github.io/safety.viz/hep-explorer/">Try it live →</a></figcaption>
</figure>

## QT Safety Explorer — Prototype

The second prototype adds a `safety.viz` module based on design work done in partnership with the Cardiac Safety Research Consortium (CSRC). The safety graphics team created a prototype [SafetyGraphics/qtexplorer](https://github.com/SafetyGraphics/qtexplorer) tool a few years back, and there is also an [ICH E14](https://www.fda.gov/media/71379/download) *Draft Clinical Workflow* (28 Apr 2025). QT/QTc prolongation screening is a required check for nearly every new drug, and safety.viz didn't have a cardiac-safety renderer ... until now!

I passed Claude the two documents and the demo data in a parallel ultracode session, and about four hours later (308M tokens, ~$241 API-equivalent) the QT Safety Explorer prototype was live ([demo](https://jwildfire.github.io/safety.viz/qt-explorer/), [test evidence](https://jwildfire.github.io/safety.viz/qt-explorer/evidence.html)). The tool includes central-tendency, outlier-scatter, and categorical views, on standard CDISC ADEG data[^adeg]. One more prompt and an [ICH-E14 clinical workflow guide](https://jwildfire.github.io/safety.viz/qt-explorer/guide.html) was live too.

<figure style="margin:1.5em 0;">
  <a href="https://jwildfire.github.io/safety.viz/qt-explorer/"><img src="/assets/img/qt-explorer-demo.gif" alt="The QT Safety Explorer: the central-tendency Δ/ΔΔ view with a confidence band and ICH-E14 metric, the outlier scatter with absolute-QTc diagonals, and the by-arm categorical exceedance table." style="width:100%; border:1px solid rgba(128,128,128,0.35); border-radius:8px;"></a>
  <figcaption style="font-size:0.8em; opacity:0.7; margin-top:4px;">The three QT Safety Explorer views: central tendency (Δ / placebo-corrected ΔΔ with a 90% CI band), the flagship outlier scatter, and the by-arm categorical exceedance table. <a href="https://jwildfire.github.io/safety.viz/qt-explorer/">Try it live →</a></figcaption>
</figure>

The QT Explorer module is marked **Experimental**: Phase 1 covers the three screening displays above; the deeper investigation layer — individualized correction, per-subject drill-down, the QT-RR hysteresis plot, a guided evaluation mode — is written up as [six follow-up items](https://github.com/jwildfire/obot.roadmap/issues/37) for a planned phase 2 after Jim and others have a look at the initial prototype.

## Wrapup

So, back to our central question, what can AI do today? We already demonstrated that we can modernize legacy code ([diary #5]({% post_url 2026-07-12-introducing-safety-viz %}) and [#6]({% post_url 2026-07-13-obot-v3-billion-tokens %})). Now we see that it can also expand the platform. Provided with robust clinical workflows, it independently implemented prototypes bringing hepatotoxicity monitoring closer to current best practice and adding the first tool for cardiovascular safety in one evening.

Up next: seeing how far a fully autonomous session can get without me in the loop at all.

[^max]: API-equivalent, not out-of-pocket — this all ran on my $200/month Claude Max subscription, so the marginal cost of both sessions was $0. The dollar figures are what the same token usage would have cost at API list prices. Roughly 97% of those tokens were prompt-cache reads, which is just what a long agent session looks like.

[^adeg]: The demo runs on `adeg.csv` — the ECG analysis dataset from [pharmaverseadam](https://pharmaverse.github.io/pharmaverseadam/), derived from CDISC's Pilot 01 study: 254 subjects across Placebo, Xanomeline Low, and Xanomeline High arms. It's standards-conformant CDISC ADaM data rather than a hand-built fixture, though the pilot carries no PR/QRS measurements and no moxifloxacin positive-control arm — both noted in the app.

[^ai]: **AI collaboration note** — I wrote an outline and a background Claude Code session (Opus 4.8) filled in details, verified every issue/PR/link claim against the repos, and pulled the token and cost figures directly from each build session's own transcript. I then did a substantial re-write, and Claude did a final cleanup pass — links, footnotes, and a fact-check — before publication. The two features themselves — hep-explorer's composite view (issue #67 → PR #69) and the QT Safety Explorer prototype (issue #68 → PR #70) — were each built in a separate Opus 4.8 agent session.
