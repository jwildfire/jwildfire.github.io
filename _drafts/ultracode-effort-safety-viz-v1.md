---
title: "R/Pharma Diary #6 — Ultracode: Five Renderers Before Lunch"
author: "Jeremy Wildfire"
excerpt: "One morning, twelve agents, two workstreams, one session-limit outage — an honest accounting of the multi-agent session that built the safety.viz v1.0 release candidate, including the bill."
tags: RPharma AI Agents SafetyGraphics DeveloperDiary Ultracode
series: "R/Pharma 2026 developer diary"
series_part: 6  # proposed slot: after #5 "Autonomy, or Lack Thereof" (now drafted) — Jeremy's call
date: "2026-07-11"  # set to the actual publish date (and match the _posts/ filename) when publishing
---

At 9:17 on the morning of July 11th, [`safety.viz`](https://github.com/jwildfire/safety.viz) — the Chart.js library that's replacing the old `{safetyGraphics}` renderers — had one working chart. By 11:40, a release-candidate PR was open with six: histogram, four new lab renderers, and a stretch-goal adverse-event timeline that needed a whole new data domain. 247 unit tests and 92 browser tests, all green. I sent about six messages the entire time.[^ai]

This series has promised an honest accounting of what agentic development actually costs, so this post is that: what ran, what broke, what I actually did, and the bill.

## The Shape of the Morning

The plan was something I've started calling an "ultracode" session: instead of one agent grinding through a task list, an orchestrator runs multiple workstreams in parallel and I supervise from a distance.

Two workstreams launched together:

- **A website agent** — a single agent doing a full overhaul of the docs site: gallery, evidence pages, API reference.
- **A scripted workflow** — and this is the interesting part — a piece of deterministic orchestration *code*, not a model improvising a plan. The script defined the stages: fix two gating defects, then fan out five renderer builders in parallel, then integrate. Every step journaled to disk with a run ID.

That distinction matters more than I expected. When things went wrong (they did — see below), the scripted workflow resumed from its journal like nothing happened. The improvising agent did not.

## Gates Before Fan-Out

The sequencing insight of the day: two fixes ran *before* the fan-out, because the five new renderers were all going to clone the histogram module's pattern. Ship a defect in the template and you ship it five times.

**Gate one** was a histogram binning bug (#19) with a genuinely fun diagnosis. The new Chart.js histogram didn't match the 2017-era original. To find out why, the agent cloned the original renderer, actually *executed* its d3-v3 source, and pinned it down: Webcharts used a quantile scale for binning, and a quantile scale over a two-point domain degenerates to uniform bins. Nine-year-old behavior, reproduced from primary sources rather than guessed at. The fix went up as its own small PR and was green in about an hour.

**Gate two** generalized the evidence pipeline — the machinery that produces the screenshots and requirement-coverage reports we treat as validation evidence — from "works for one module" to "works for N modules," with CI stamping provenance on every evidence set.

Then the fan-out: five renderer builders in parallel git worktrees on parameterized ports, each doing red-green TDD against requirement matrices harvested from the original `{safetyGraphics}` charts. All five shipped, including the adverse-event-timelines stretch goal, which needed a newly vendored ADAE dataset. Between them: 139 new unit tests, 68 new browser tests, and — importantly — requirement rows that *didn't* make the cut were descoped honestly and documented per module, not quietly dropped.

## Picking Models Like Picking Staff

Mid-session I sent one piece of guidance: "pick the best model, don't have to use fable for everything." The orchestrator split the work accordingly — Claude Fable 5 for the judgment-heavy jobs (the two gates, the stretch renderer, integration, website design, conflict reconciliation) and Claude Opus 4.8 for the four lab-renderer builders, which were following an established template.

The mechanics of the reallocation were the striking part. The workflow script is a persisted artifact, so the orchestrator edited the model assignments in the script and resumed from the run ID. Completed steps replayed from cache; only new work ran on the new models. Editing a config file mid-flight and resuming is the most boring possible description of that, which is exactly the point — boring is what you want from orchestration.

## What Broke

Honesty section. Four things went wrong, and they're the most instructive part of the morning.

**The session limit killed everything, 13 minutes in.** I run this on a Claude subscription plan with rolling session limits, and at 9:30 the ceiling landed on both workstreams at once. The scripted workflow shrugged — journal on disk, resumed cleanly when I said "continue." The website agent was another story. Its ~1,060 lines of uncommitted work on disk survived fine, and a successor agent triaged all of it and kept everything. But its design-review catalog — the analysis of what needed fixing across the site — lived only in the dead agent's transcript and had to be redone from scratch. Lesson, now written in the project memory: **transcript-only deliverables die with the session. Commit working notes.**

**The permission classifier refused to let the orchestrator merge.** Even after I'd approved a PR, the agent's attempt to merge it was blocked. Annoying in the moment, correct on reflection: this workspace has a hard "never merge without Jeremy's explicit approval" rule, and the classifier can't see into a conversation to verify approval happened. So the boundary holds mechanically and the human clicks merge. I'll take a guardrail that's occasionally overcautious over one that's occasionally absent.

**Large binary pushes died on HTTP/2** with a git error message that pointed everywhere except the actual problem. Not an agent failure — just ordinary infrastructure friction that agents hit exactly the way we do, and then have to debug through the same misleading error text.

**All four Opus builders independently made the identical one-line framework fix.** Same defect, same file, same fix, four times, in four isolated worktrees. Convergent evolution is a nice validation signal — four independent agents agreed on the diagnosis — but integration had to notice and dedupe it. Parallel agents don't just divide work; they occasionally quadruplicate it.

## Review Gates as Pull Requests

My other mid-session redirect: no giant release-candidate dump. Instead, three staged PRs, each with a live GitHub Pages preview I could open in a browser:

1. **#23** — the binning fix. Small, reviewable, green in about an hour.
2. **#22** — the docs-site overhaul. Approved the same morning; my entire review comment was "website looks great!"
3. **#28** — the RC itself: five renderers plus framework changes, superseding the other two.

This is the "autonomy with review gates" thesis from the last post, made concrete. The agents ran autonomously *between* the gates; the gates were PRs with rendered previews, sized so a human could actually review them.

Integration deserves a line of its own. Five branches merged, with every shared-file conflict reconciled rather than force-resolved — including one where two agents had independently re-vendored the same CSV and the reconciler verified the files value-identical, row for row, before picking one. Final battery: 247 unit tests, 92 Playwright tests, 6 evidence sets with CI provenance, and an authorship audit showing all 46 commits correctly attributed to the `obotclaw[bot]` app identity.

## What the Human Actually Did

My complete contribution, reconstructed from the transcript: the kickoff message, the model-allocation guidance, two "continue"s after the outage, the staged-PR redirect, and the website approval. Six short messages, maybe ten minutes of typing, plus the PR reviews themselves. The reviews were the real work, and they were the *right* work — that's where the judgment belongs.

## The Bill

The numbers, as promised.

**Wall clock:** kickoff 09:17 ET, RC PR open ~11:40 ET. About 2 hours 20 minutes, including the 15-minute session-limit outage.

**Agents:** 1 orchestrator plus 12 subagent spawns — 10 completed, 1 killed mid-work by the usage limit, 1 that died instantly on the same limit. The scripted workflow alone ran 8 agents through 918 tool calls over 98 minutes, reporting 1,973,684 subagent tokens. The successor website agent: 190,341 tokens across 105 tool calls in 32 minutes. The reconciliation agent: 72,178 tokens, 33 tool calls, six and a half minutes. The aborted first workflow run burned 136,069 tokens before dying. Total reported subagent tokens: about **2.37 million** (the orchestrator's own overhead isn't in these counters).

**Cost, two ways:**

*Plan-adjusted:* I run this on a subscription plan, so the day's marginal dollar cost was **$0**. The real cost was hitting the session ceiling 13 minutes in and spending 15 minutes waiting and recovering. On a subscription, the scarce resource isn't dollars — it's the rolling limit, and multi-agent fan-out eats it fast.

*Raw API-equivalent (rough estimate):* at current list prices — Fable 5 at $50 per million output tokens, Opus 4.8 at $25 — the ~2.37M reported tokens would be somewhere around **$60–$120 in output tokens** depending on how the Fable/Opus split shakes out (my best guess with the day's allocation: roughly $90). Big caveat: these counters are output-weighted and don't capture input or cache-read traffic, which on agentic work is substantial. A defensible order-of-magnitude for the full morning is **low hundreds of dollars** — call it $150–$400 — and I wouldn't quote it tighter than that.[^pricing]

For a morning that produced a six-renderer release candidate with 339 passing tests and full evidence trails, either framing seems like a bargain. For a morning that produced the *wrong* six renderers, it would be an expensive way to generate review work. The gates are what keep it the first thing.

## What This Means for October

The keynote thesis this diary keeps circling: the interesting question isn't whether agents can write the code — the morning confirmed, again, that they can — it's whether the surrounding system makes the work observable, reviewable, and recoverable. The morning's evidence, point by point: the scripted workflow was recoverable (journal, run ID, resume) where the improvising agent was not; the work was observable (evidence sets, provenance, authorship audit); and the review gates were real PRs a human could approve between coffee refills.

The failures all landed in the same place, too. Nothing broke because a model wasn't smart enough. Things broke where state lived in the wrong place (a transcript instead of a file), where infrastructure hiccupped (HTTP/2), and where parallel workers lacked a shared view (four identical fixes). The bottleneck still isn't intelligence. It's plumbing.

Next up: getting these renderers wired into `{gsm.safety}` as htmlwidgets, so R users can actually call them.

{% comment %} OPTIONAL postscript — keep or cut, Jeremy's call. Facts: RC landed; v1.0.0 + v1.1.0 both released 2026-07-12; hep-explorer/eDISH port opened as safety.viz PR #44 from the first overnight ultracode run. {% endcomment %}
*Postscript (July 12): The release candidate landed, and [v1.0.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.0.0) and [v1.1.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.1.0) both shipped within a day. A seventh chart — a port of the hep-explorer eDISH display — is already in review as [PR #44](https://github.com/jwildfire/safety.viz/pull/44), from an overnight run.*

---

[^ai]: **AI collaboration note** — this post was drafted by Claude Code (using Fable 5) from the session logs and my notes, and reviewed and edited by me before publication. Fittingly, the draft was itself produced by a subagent.

[^pricing]: Output rates from Anthropic's published pricing as of 2026-07-11: Claude Fable 5 at $10/$50 per million input/output tokens, Claude Opus 4.8 at $5/$25. The reported counters undercount total traffic (no input/cache figures), so treat the dollar range as an order-of-magnitude estimate, not an invoice.
