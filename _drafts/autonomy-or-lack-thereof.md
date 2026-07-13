---
title: "R/Pharma Diary #6 — Obot v3: How I Used a Billion Tokens in a Weekend"
author: "Jeremy Wildfire"
excerpt: "The dream: hand an agent a goal and come back to useful progress. Obot v2 tried to get there with heartbeats, agent roles, and a control plane. Obot v3 threw most of that out — and kept the parts that were actually load-bearing."
tags: RPharma AI Agents Autonomy OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 6
status: outline
---

{% comment %}
OUTLINE ONLY — Jeremy writes the prose. date: set on publish.
This is the "Obot v3" transition post: OpenClaw/obot-claw era → the Claude Code scaffold.
Per the 07-12 reframe: publishes after #5 ("Introducing safety.viz"); the overnight-run
deep dive moves to #7 (the obot.agent work-patterns case study) — only teased here.
Every date/number below was verified against the hub diary
(https://jwildfire.github.io/obot.roadmap/) on 2026-07-13.
{% endcomment %}

### Opening

I introduced Obot 🍊😺  [a few posts back]({% post_url 2026-06-12-setting-up-obot-openclaw %}) and described how I set it up with OpenClaw and Telegram.[^paperclip] My original readout,"51% fun / 49% frustrating" still stands. That's clearly not good enough, and I wasn't making progress on the things I actually wanted to build, like [safety.viz]({% post_url 2026-07-12-introducing-safety-viz %}).  So when [Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) was announced I decided to give it a try. My goal remains the same, answer the questions: "What are these tools good at right now? How much can they do autonomously?" The answer: quite a lot.

[^paperclip]: Before the full reboot there was an "Obot 2.5" that never shipped: a much more structured framework with a PM agent to own issues, scope, and handoffs, a Dev agent for implementation and PRs, and a Testing agent for browser checks and regression evidence — OpenClaw heartbeats for liveness, all tied together by a local control-plane layer I called Paperclip. I spent a few days working the problem with GPT-5.5 and it genuinely felt close: the roles made sense, the heartbeats beat, and I could squint and see the loop closing. Then the frontier moved, as it always does, and it suddenly made more sense to try the whole problem inside Claude Code than on my own scaffolding. Paperclip never got a proper retirement — it was simply abandoned mid-prototype. {% comment %} Jeremy: optional line of day-to-day color on what Paperclip actually did while it lived; per 07-13 decision, no v2 artifacts linked. {% endcomment %}

### One weekend, One billion tokens

I used Claude code to take `safety.viz` from a single renderer prototype to a 7 renderer framework this weekend. I had several prompts that triggered multiple hours of work and delivered outputs that were ready to ship after a short review. For example, "/spawn an ultracode session to add the safetyGraphics/hep-explorer to safety.viz" worked for just under two hours, used roughly 80 million tokens (estimated API cost of ~$140) and the result was [this renderer](https://jwildfire.github.io/safety.viz/hep-explorer/) along with [robust test evidence](https://jwildfire.github.io/safety.viz/hep-explorer/evidence.html) and a list of follow-up tasks. All told, I spent roughly 10 hours[footnote: It wasn't all active work - 3 hours overlapped with watching Argentina in the world cup.] working on this across 5 sessions. All of the work was done on a $200/month claude max plan. I used just over 1 billion tokens. Equivalent API cost was roughly $1,270. Slightly more detailed metrics below:

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

 I run the [Claude Code](https://claude.com/claude-code) CLI in [Ghostty](https://ghostty.org). I heavily use the `claude agents` view, and have 3 or 4 agents running at a time. I mostly review Claude's work in Chrome, either via PRs that have pushed previews to [GitHub Pages](https://pages.github.com) or via html artifacts that it creates locally and opens in Chrome. If I want to write something myself[footnote: like this blog post right now!], I have Claude open files for me to edit in [VS Code](https://code.visualstudio.com). I'll occasionally dictate long prompts, but mostly still type everything.

#### The Scaffold

There are 2 code GitHub repos that claude is constantly updating:

- **[obot.roadmap](https://github.com/jwildfire/obot.roadmap) = the plan and the memory.** This is the project roadmap. It sets the direction moving forward and provides memory about what has been done. At it's core the roadmap captures requirements and tasks as issues and keeps track of a requirement lifecycle: Backlog → Requirement Gathering → Design → Development → Review → Released, mirrored on a GitHub Project board. Public site with [roadmap](https://jwildfire.github.io/obot.roadmap/roadmap.html), [news feed](https://jwildfire.github.io/obot.roadmap/news.html), design docs, reports, and the continuing dev diary. 
- **[obot.agent](https://github.com/jwildfire/obot.agent) = the playbook.** Conventions + skills every session loads. This provides a reusable session structure (See below for overview) and is still evolving.

Feel free to poke around. The obot.roadmap news feed in particular gives tons of additional detail about how this work is being done. Both of those repos probably deserve a longer post. The last big part of the scaffold is an Obot Github App that provides an identity for the work Claude is doing autonomously[footnote: this helps to separate the work the bot does autonomously vs the work I do myself]

- **obotclaw = the identity.** GitHub App ([requirement #3](https://github.com/jwildfire/obot.roadmap/issues/3), [design doc](https://jwildfire.github.io/obot.roadmap/requirements/design/3_design.html)); registered 07-04, installed on exactly five whitelisted repos; agents mint one-hour installation tokens; agent commits/PRs authored by obotclaw[bot], keeping my work and the agent's distinguishable in the audit trail ([diary 07-04](https://jwildfire.github.io/obot.roadmap/diary/2026-07-04.html)).

#### The Session Framework

I tend to work on this project in "sessions" - basically sessions starts when I sit down to work and ends when I close claude. `obot.agent` provides several skills and commands to support this: 

- **`/session-init`** opens a session: subagents sweep the roadmap issues, open PRs, the project board, and recent diary entries, and I get back a prioritized todo list split into "agent can start now" vs "waiting on me".
- **`/session-note`**, **`/session-update`**, and **`/session-todo`** maintain a running scratchpad during the session — observations worth remembering, new tasks as they surface, and the live checklist.
- **`/session-dashboard`** opens a live HTML dashboard in Chrome showing every running agent and what it's doing.
- **`/session-wrapup`** closes the loop: it inventories what actually happened across all agents, files loose ends back onto the roadmap as issues, updates the project board, and writes the public [diary entry](https://jwildfire.github.io/obot.roadmap/) — which is exactly what the next session's `/session-init` reads.

I run several different agents - basically claude code tabs each sessions, and have start to differentiate between roles for the agents: 

- 😺🤖 - The session manager orchestration agent: opens and closes the session, keeps the todo list honest, spawns and monitors the other agents, and packages their work up for my review. Exactly one per session.
- 👯🤖 - A sibling agent working on a specific well defined task - generally defined in an `obot.roadmap` requirement. Runs in its own git worktree and typically ends by opening a draft PR for my review.
- ⚡️🤖 - Autonomous workers. Long-running ultracode agents that orchestrate whole fleets of subagents through a scripted workflow - these are the ones I leave running overnight.

This weekend I ran 5 primary sessions which initialized 16 named agents (plus dozens of throwaway subagents), here's a summary of the work:

- 😺🤖 7/10 Friday night - safety.viz v0.1.0 released end to end: docs site, three-tier Pages publishing, staging-review fixes - [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-10.html)
- 😺🤖 7/11 Session 1 - obot.agent renamed, audited, designed, and implemented to the review gate - [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11.html)
  - 👯🤖 ultraplan - the entire safety.viz v1.0 push: binning fix, five new renderers, docs-site rebuild, all delivered as draft PRs
- 😺🤖 7/11 Session 2 - three releases shipped in one evening, orchestrating four siblings - [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11-2.html)
  - 👯🤖 sv-v1 - safety.viz [v1.0.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.0.0) release train (three stacked merges, each approved live), then [v1.1.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.1.0) with real pharmaverse demo data
  - 👯🤖 oa-v0.1 - [obot.agent v0.1.0](https://github.com/jwildfire/obot.agent/releases/tag/v0.1.0): the session framework itself, released
  - 👯🤖 session-hub - the live agent dashboard designed and prototyped
  - 👯🤖 audit - a roadmap-usage audit that caught the public roadmap flatlining on shipping day; corrections applied the same night
- 😺🤖 7/11 → 7/12 Overnight - the lead session watched two autonomous stretch jobs run while I slept; both landed clean with zero intervention, and a morning digest was waiting when I woke up - [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12.html)
  - ⚡️🤖 hep-explorer - the eDISH port described above ([draft PR](https://github.com/jwildfire/safety.viz/pull/44) by morning)
  - ⚡️🤖 open.gismo - a v1.0 plan plus a working Phase-0 prototype ([draft PR](https://github.com/jwildfire/open.gismo/pull/1) + [deployed design report](https://jwildfire.github.io/obot.roadmap/reports/open-gismo-v1-plan-2026-07-12/))
- 😺🤖 7/12 Session 2 - release day: five lanes converged - [diary](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12-2.html)
  - 👯🤖 edish - [safety.viz v1.2.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.2.0) shipped: eDISH merged with its done-gate evidence verified live
  - 👯🤖 guide-port - a 19-figure clinical eDISH guide adapted from the DIA-ASA working group's workflow manual
  - 👯🤖 blog - [R/Pharma Diary #5]({% post_url 2026-07-12-introducing-safety-viz %}) published
  - ⚡️🤖 RC1 - gsm.safety v1.0.0 release candidate staged with full qualification evidence ([draft PR](https://github.com/jwildfire/gsm.safety/pull/39))

### Wrapup

This weekend was fairly eye-opening, I'd heard about developers with 6-figure token budgets, but didn't really understand how that worked until now. Using the process above  under API billing rules for 8 hours a day would almost certainly cost thousands of dollars per person per month. So, was it worth it? That depends on the framing. I think the work I did this weekend would've taken a team of experts several months of work without AI. Let's say 6 months for 3 people. So while spending a thousand dollars[footnote: again, theoretically. I spent some fraction of the $200/month Max plan] on a side project in a weekend seems crazy, delivering a 6 month project for less than $2k seems like an amazing deal. To be clear, this isn't ready for production use, but I'm not sure it's that far off. Next step is to get some feedback on the charts from the safetyGraphics team (if you have thoughts, let me know!) and work on the R package that makes this easier to use in practice. More on that in the next post. 

## Material to pull in

- Prior-post callbacks: [#2 Introducing Obot]({% post_url 2026-06-12-setting-up-obot-openclaw %}) (scorecard + promise), [#4 safetyGraphics ❤️ gsm]({% post_url 2026-07-02-safetygraphics-heart-gsm %}) ("With AI agents, I'm not sure that's true anymore"), [#5 Introducing safety.viz]({% post_url 2026-07-12-introducing-safety-viz %}) (closing teaser names Obot v3).
- Hub diary entries (published): [07-02](https://jwildfire.github.io/obot.roadmap/diary/2026-07-02.html) hub scaffold + migration · [07-03](https://jwildfire.github.io/obot.roadmap/diary/2026-07-03.html) site live · [07-04](https://jwildfire.github.io/obot.roadmap/diary/2026-07-04.html) obotclaw app live · [07-11](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11.html) + [07-11-2](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11-2.html) rename, v0.1.0, three releases · [07-12](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12.html) + [07-12-2](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12-2.html) overnight jobs, v1.2.0, RC1.
- Hub issues/docs: [#1](https://github.com/jwildfire/obot.roadmap/issues/1) (closed — bookend), [#3](https://github.com/jwildfire/obot.roadmap/issues/3) + [3_design.html](https://jwildfire.github.io/obot.roadmap/requirements/design/3_design.html) (App), [#7](https://github.com/jwildfire/obot.roadmap/issues/7) (hub migration), [#17](https://github.com/jwildfire/obot.roadmap/issues/17) (obot.agent overlay), [#22](https://github.com/jwildfire/obot.roadmap/issues/22) (this blog series).
- Releases: safety.viz [v1.0.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.0.0) / [v1.1.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.1.0) / [v1.2.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.2.0); [obot.agent v0.1.0](https://github.com/jwildfire/obot.agent/releases/tag/v0.1.0); [obot.roadmap v0.1](https://github.com/jwildfire/obot.roadmap/releases/tag/v0.1).
- Candidate figure: screenshot of the roadmap board/site for `/assets/img/` (matching #5's screenshot pattern) — roadmap.html, news feed, or a diary entry.

## Open questions for Jeremy

- Paperclip footnote: an optional line of day-to-day color — a hidden comment gap is waiting inside the footnote.
- Version-numbering nit: post #2's interview has obot calling itself "the second bot of the name, following obot v1 / obot-prime" — reconcile (footnote?) with the v2/v2.5/v3 framing here.
- Include a roadmap-site screenshot, or keep this one image-free?
- Candidate closer, if wanted here rather than #7: "It took two frameworks, three agent roles, a control plane, and a model release to get one good night of sleep. Worth it."
- The inline [footnote: …] placeholders are yours to expand — left untouched.

## AI collaboration footnote (plan)

- Same pattern as #4/#5: "I outlined this post; Claude Code (using Fable 5) helped assemble the outline from my notes and the [project diary](https://jwildfire.github.io/obot.roadmap/); I wrote and edited the final text." — adjust once prose exists.
