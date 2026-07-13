---
title: "R/Pharma Diary #6 — Obot v3: How I Used a Billion Tokens in a Weekend"
author: "Jeremy Wildfire"
excerpt: "The dream: hand an agent a goal and come back to useful progress. Obot v2 tried to get there with heartbeats, agent roles, and a control plane. Obot v3 threw most of that out — and kept the parts that were actually load-bearing."
tags: RPharma AI Agents Autonomy OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 6
status: draft
---

### Opening

I introduced Obot 🍊😺 [a few posts back]({% post_url 2026-06-12-setting-up-obot-openclaw %}) and described how I set it up with OpenClaw and Telegram.[^paperclip] My original readout — "51% fun / 49% frustrating" — still stands. That's clearly not good enough, and I wasn't making progress on the things I actually wanted to build, like [safety.viz](https://github.com/jwildfire/safety.viz). So when [Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) was announced, I decided to give it a try. [My goal remains the same]({% post_url 2026-06-10-rpharma-keynote-developer-diary %}) — answer the questions: "What are these tools good at right now? How much can they do autonomously?" The answer: quite a lot.

### One weekend, one billion tokens

[My last post]({% post_url 2026-07-12-introducing-safety-viz %}) introduced safety.viz — this post explains how I used Claude Code to take safety.viz from a single-renderer prototype to a seven-renderer framework this past weekend. Several prompts each triggered multiple hours of work and delivered outputs that were ready to ship after a short review. For example, "/spawn an ultracode session to add the safetyGraphics/hep-explorer to safety.viz" worked for just under two hours, used roughly 50 million tokens (estimated API cost of ~$55), and the result was [this renderer](https://jwildfire.github.io/safety.viz/hep-explorer/) along with [robust test evidence](https://jwildfire.github.io/safety.viz/hep-explorer/evidence.html) and a list of follow-up tasks.

A follow-up session ported the PDF clinical guide for eDISH evaluation to HTML (44M/$33), giving the renderer a step-by-step companion:

<div style="display:flex; gap:12px; flex-wrap:wrap; margin:1.5em 0;">
  <figure style="flex:1 1 300px; margin:0;">
    <a href="https://jwildfire.github.io/safety.viz/hep-explorer/"><img src="/assets/img/hep-explorer-edish.png" alt="The rebuilt Hepatic Safety Explorer (eDISH) in safety.viz" style="width:100%; border:1px solid rgba(128,128,128,0.35); border-radius:8px;"></a>
    <figcaption style="font-size:0.8em; opacity:0.7; margin-top:4px;">The hep-explorer example — eDISH scatter with editable Hy's-Law quadrants and participant drill-down (<a href="https://safetygraphics.github.io/hep-explorer/test-page/">original for comparison</a>).</figcaption>
  </figure>
  <figure style="flex:1 1 300px; margin:0;">
    <a href="https://jwildfire.github.io/safety.viz/hep-explorer/guide.html"><img src="/assets/img/hep-explorer-guide.png" alt="The eDISH clinical guide, ported from PDF to HTML" style="width:100%; border:1px solid rgba(128,128,128,0.35); border-radius:8px;"></a>
    <figcaption style="font-size:0.8em; opacity:0.7; margin-top:4px;">The clinical guide — the 19-figure DIA-ASA eDISH workflow manual, now a live Guide tab with embedded charts.</figcaption>
  </figure>
</div>

That overnight port wasn't a pixel-for-pixel copy — it's a rebuild on the new framework: the eDISH scatter with editable Hy's-Law quadrants, eDISH/mDISH display modes, R-Ratio and timing controls, and a coordinated participant drill-down, running against real pharmaverse ADaM data. The job even filed its own roadmap on the way out: [a stack of follow-up issues](https://github.com/jwildfire/safety.viz/issues?q=is%3Aissue+is%3Aopen+hepExplorer) covering draggable Hy's-Law cut-lines, study-day animation with a play control, marginal distributions, and an exposure track.

All told, I spent roughly 10 hours[^hours] working on this across 5 sessions. All of the work was done on a $200/month Claude Max plan. I used just over 1 billion tokens. The equivalent API cost was roughly $1,270. Slightly more detailed metrics below:

<div style="display:flex; gap:12px; flex-wrap:wrap; margin:1.5em 0;">
  <div style="flex:1 1 170px; border:1px solid rgba(128,128,128,0.35); border-radius:8px; padding:14px 16px;">
    <div style="font-size:0.75em; letter-spacing:0.02em; opacity:0.65;">Tokens</div>
    <div style="font-size:2em; font-weight:600; line-height:1.3;">1.0B</div>
    <div style="font-size:0.8em; opacity:0.75;">5,749 API calls · 97% cache reads</div>
  </div>
  <div style="flex:1 1 170px; border:1px solid rgba(128,128,128,0.35); border-radius:8px; padding:14px 16px;">
    <div style="font-size:0.75em; letter-spacing:0.02em; opacity:0.65;">API-equivalent cost</div>
    <div style="font-size:2em; font-weight:600; line-height:1.3;">$1,273</div>
    <div style="font-size:0.8em; opacity:0.75;">Fable 5 $971 · Opus 4.8 $299 · peak day Saturday $662</div>
  </div>
  <div style="flex:1 1 170px; border:1px solid rgba(128,128,128,0.35); border-radius:8px; padding:14px 16px;">
    <div style="font-size:0.75em; letter-spacing:0.02em; opacity:0.65;">What I actually paid</div>
    <div style="font-size:2em; font-weight:600; line-height:1.3;">$200<span style="font-size:0.5em; font-weight:400;">/mo</span></div>
    <div style="font-size:0.8em; opacity:0.75;">Claude Max subscription · marginal weekend cost $0</div>
  </div>
</div>
<p style="font-size:0.8em; opacity:0.65; margin-top:-0.5em;">Fri Jul 10 – Sun Jul 12, computed from local session logs, priced at public API rates.</p>


### How it works

#### My environment

I run the [Claude Code](https://claude.com/claude-code) CLI in [Ghostty](https://ghostty.org). I heavily use the `claude agents` view and usually have three or four agents running at a time. I mostly review Claude's work in Chrome, either via PRs that push previews to [GitHub Pages](https://pages.github.com) or via HTML artifacts that it creates locally and opens in Chrome. If I want to write something myself,[^writing] I have Claude open files for me to edit in [VS Code](https://code.visualstudio.com). I'll occasionally dictate long prompts, but mostly still type everything.

#### The Scaffold

There are two GitHub repos that Claude is constantly updating:

- **[obot.roadmap](https://github.com/jwildfire/obot.roadmap) = the plan and the memory.** This is the project roadmap. It sets the direction moving forward and provides memory about what has been done. At its core, the roadmap captures requirements and tasks as issues and keeps track of a requirement lifecycle — Backlog → Requirement Gathering → Design → Development → Review → Released — mirrored on a GitHub Project board. There's a public site with the [roadmap](https://jwildfire.github.io/obot.roadmap/roadmap.html), a [news feed](https://jwildfire.github.io/obot.roadmap/news.html), design docs, reports, and the continuing dev diary.
- **[obot.agent](https://github.com/jwildfire/obot.agent) = the playbook.** Conventions and skills that every session loads. This provides a reusable session structure (see below for an overview) and is still evolving.

Feel free to poke around. The obot.roadmap news feed in particular gives tons of additional detail about how this work is being done. Both of those repos probably deserve a longer post. The last big part of the scaffold is an Obot GitHub App that provides an identity for the work Claude does autonomously:[^identity]

- **obotclaw = the identity.** A GitHub App ([requirement #3](https://github.com/jwildfire/obot.roadmap/issues/3), [design doc](https://jwildfire.github.io/obot.roadmap/requirements/design/3_design.html)) registered on July 4 and installed on exactly five whitelisted repos. Agents mint one-hour installation tokens, and agent commits and PRs are authored by obotclaw[bot] — keeping my work and the agent's distinguishable in the audit trail ([diary 07-04](https://jwildfire.github.io/obot.roadmap/diary/2026-07-04.html)).

#### The Session Framework

I tend to work on this project in "sessions" — a session starts when I sit down to work and ends when I close Claude. `obot.agent` provides several skills and commands to support this:

- **`/session-init`** opens a session: subagents sweep the roadmap issues, open PRs, the project board, and recent diary entries, and I get back a prioritized todo list split into "agent can start now" vs "waiting on me".
- **`/session-note`**, **`/session-update`**, and **`/session-todo`** maintain a running scratchpad during the session — observations worth remembering, new tasks as they surface, and the live checklist.
- **`/session-dashboard`** opens a live HTML dashboard in Chrome showing every running agent and what it's doing.
- **`/session-wrapup`** closes the loop: it inventories what actually happened across all agents, files loose ends back onto the roadmap as issues, updates the project board, and writes the public [diary entry](https://jwildfire.github.io/obot.roadmap/) — which is exactly what the next session's `/session-init` reads.

Each session I run several different agents — basically Claude Code tabs — and I've started to differentiate between roles:

- 😺🤖 — The session manager: opens and closes the session, keeps the todo list honest, spawns and monitors the other agents, and packages their work up for my review. Exactly one per session.
- 👯🤖 — A sibling agent working on a specific, well-defined task — generally scoped by an `obot.roadmap` requirement. Runs in its own git worktree and typically ends by opening a draft PR for my review.
- ⚡️🤖 — Autonomous workers: long-running ultracode agents that orchestrate whole fleets of subagents through a scripted workflow. These are the ones I leave running overnight.

This weekend I ran 5 primary sessions which initialized 16 named agents (plus dozens of throwaway subagents). Here's a summary of the work:

- 😺🤖 7/10 Friday night — safety.viz v0.1.0 released end to end: docs site, three-tier Pages publishing, staging-review fixes (12M/$20) — [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-10.html)
- 😺🤖 7/11 Session 1 — obot.agent renamed, audited, designed, and implemented to the review gate (280M/$370) — [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11.html)
  - 👯🤖 ultraplan — the entire safety.viz v1.0 push: binning fix, five new renderers, docs-site rebuild, all delivered as draft PRs (175M/$190)
- 😺🤖 7/11 Session 2 — three releases shipped in one evening, orchestrating four siblings (320M/$410) — [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11-2.html)
  - 👯🤖 sv-v1 — safety.viz [v1.0.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.0.0) release train (three stacked merges, each approved live), then [v1.1.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.1.0) with real pharmaverse demo data
  - 👯🤖 oa-v0.1 — [obot.agent v0.1.0](https://github.com/jwildfire/obot.agent/releases/tag/v0.1.0): the session framework itself, released
  - 👯🤖 session-hub — the live agent dashboard designed and prototyped
  - 👯🤖 audit — a roadmap-usage audit that caught the public roadmap flatlining on shipping day; corrections applied the same night
- 😺🤖 7/11 → 7/12 Overnight — the lead session watched two autonomous stretch jobs run while I slept; both landed clean with zero intervention, and a morning digest was waiting when I woke up (140M/$200) — [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12.html)
  - ⚡️🤖 hep-explorer — the eDISH port described above ([draft PR](https://github.com/jwildfire/safety.viz/pull/44) by morning) (50M/$55)
  - ⚡️🤖 open.gismo — a v1.0 plan plus a working Phase-0 prototype ([draft PR](https://github.com/jwildfire/open.gismo/pull/1) + [deployed design report](https://jwildfire.github.io/obot.roadmap/reports/open-gismo-v1-plan-2026-07-12/)) (80M/$120)
- 😺🤖 7/12 Session 2 — release day: five lanes converged (250M/$275) — [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12-2.html)
  - 👯🤖 edish — [safety.viz v1.2.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.2.0) shipped: eDISH merged with its done-gate evidence verified live
  - 👯🤖 guide-port — a 19-figure clinical eDISH guide adapted from the DIA-ASA working group's workflow manual (44M/$33)
  - 👯🤖 blog — [R/Pharma Diary #5]({% post_url 2026-07-12-introducing-safety-viz %}) published
  - ⚡️🤖 RC1 — gsm.safety v1.0.0 release candidate staged with full qualification evidence ([draft PR](https://github.com/jwildfire/gsm.safety/pull/39))

### Wrapup

This weekend was fairly eye-opening. I'd heard about developers with six-figure token budgets, but I didn't really understand how that worked until now. Using the process above under API billing rules for 8 hours a day would almost certainly cost thousands of dollars per person per month. So, was it worth it? That depends on the framing. I think the work I did this weekend would've taken a team of experts several months without AI — let's say 6 months for 3 people. So while spending a thousand dollars[^cost] on a side project in a weekend seems crazy, delivering a 6-month project for less than $2k seems like an amazing deal. To be clear, this isn't ready for production use, but I'm not sure it's that far off. The next step is to get feedback on the charts from the safetyGraphics team (if you have thoughts, let me know!) and to work on the R package that makes this easier to use in practice. More on that in the next post.

[^paperclip]: Before the full reboot there was an "Obot 2.5" that never shipped: a much more structured framework with a PM agent to own issues, scope, and handoffs, a Dev agent for implementation and PRs, and a Testing agent for browser checks and regression evidence — OpenClaw heartbeats for liveness, all tied together with [Paperclip](https://paperclip.ing/) as the control plane. I spent a few days working the problem with GPT-5.5 and it genuinely felt close: the roles made sense, the heartbeats beat, and I could squint and see the loop closing. Then the frontier moved, as it always does, and it suddenly made more sense to try the whole problem inside Claude Code than on my own scaffolding. Obot 2.5 never got a proper retirement — the prototype was simply abandoned. {% comment %} Jeremy: optional line of day-to-day color on the Obot 2.5 setup. {% endcomment %}

[^hours]: It wasn't all active work — three of those hours overlapped with watching Argentina in the World Cup.

[^writing]: Like this blog post, right now!

[^identity]: This helps separate the work the bot does autonomously from the work I do myself.

[^cost]: Again, theoretically — I actually spent some fraction of my $200/month Max plan.
