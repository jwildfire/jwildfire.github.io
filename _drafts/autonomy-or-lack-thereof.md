---
title: "R/Pharma Diary #6 — Autonomy, or Lack Thereof"
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

## Title options

- Autonomy, or Lack Thereof *(current front-matter title; carried from the original outline)*
- Obot v3: The Great Simplification
- Build the Robot, Then Retire It

## Purpose / framing

- The obot-claw → Claude Code transition story: v2's supervision machinery, the Fable 5 pivot, the July 2 simplification, and the three-part scaffold that replaced the runtime.
- Fulfills two standing promises: post #2's "More on that in a future post" and post #5's closer ("The next post describes how I moved… to Obot v3 — a Claude Code scaffold built around a public roadmap and an agent playbook").
- Core thesis: autonomy is a supervision problem, not a model-capability problem — and the durable supervision parts (requirements, review gates, audit trail) turn out to be things GitHub already does.
- Keep it diary-like and concrete; results stay light (post #5 covered them), mechanics deep-dive deferred to #7.

## Section beats

### Opening

- Callback to [diary #2]({% post_url 2026-06-12-setting-up-obot-openclaw %}) (published 06-12): the 51% fun / 49% frustrating scorecard, and "strongly leaning towards moving on to experiment with other tools. More on that in a future post."
- "This is that post" beat — it took a month, and the month is the story.
- Hook from [#5]({% post_url 2026-07-12-introducing-safety-viz %}): how did safety.viz go from one modernized chart to seven in a weekend? Answer: Obot got rebuilt. Twice.
- AI-collaboration footnote marker goes on this paragraph (see bottom).

### The Dream

- The one-liner (keep as a blockquote): "Give the agent a goal, go do the day job, and come back to useful progress."
- Not a chatbot, not autocomplete — a coworker that keeps moving while I'm in meetings.

### The Reality

- It didn't happen: work got busy, attention drifted, the project moved exactly as fast as my attention did — the one thing the setup was supposed to fix.
- The agent was never the problem — bounded tasks were fine; autonomy is a *systems* problem.
- The supervision checklist (load-bearing — the Checklist Revisited section maps back to it item by item): durable memory · task queue · scoped permissions · heartbeat/liveness · status reporting · review gates · recovery paths.
- Candidate line: "The boring stuff *is* the autonomy."

### Obot v2

- The structured framework layered on the June OpenClaw setup: PM agent (issues/scope/handoffs), Dev agent (implementation/PRs), Testing agent (browser checks, visual validation, regression evidence).
- OpenClaw heartbeats for liveness; Paperclip as the local control-plane layer tying it together.
- A few days working the problem with GPT-5.5; it genuinely felt close — roles made sense, heartbeats beat, the loop looked like it was closing. *(Jeremy: personal color needed here — what those sessions were like, what Paperclip did day-to-day, whether any artifact is safe to link. Not covered in the hub diaries.)*

### Then Fable 5 Happened

- The frontier moved, as it always does: Anthropic shipped Fable 5 just as the homegrown stack felt close — suddenly worth trying the whole problem inside Claude Code instead of on my own scaffolding.
- Keep playful, not exhaustive (per original outline note).

### Obot v3: the July 2 migration (verified facts)

- 2026-07-02: OpenClaw always-on runtime shut down; obot-claw machine account retired, its repos archived read-only; active projects consolidated under `jwildfire/`.
- Same day: `obot.roadmap` scaffolded as the new hub; the open requirements migrated as issues [#1](https://github.com/jwildfire/obot.roadmap/issues/1) (consolidated safety.viz library), #2 (histogram pilot), #3 (GitHub App); 32 hub diary entries migrated in ([diary 07-02](https://jwildfire.github.io/obot.roadmap/diary/2026-07-02.html)).
- 2026-07-03: hub site live at [jwildfire.github.io/obot.roadmap](https://jwildfire.github.io/obot.roadmap/) + [v0.1 release](https://github.com/jwildfire/obot.roadmap/releases/tag/v0.1) "Roadmap hub established" ([diary 07-03](https://jwildfire.github.io/obot.roadmap/diary/2026-07-03.html)).
- Punch: no more heartbeats, because nothing needs to stay alive anymore.

### The new scaffold — three parts, none of them a server

- **[obot.roadmap](https://github.com/jwildfire/obot.roadmap) = the plan and the memory.** Requirement lifecycle borrowed from the gsm ecosystem's [gsm.roadmap](https://github.com/Gilead-BioStats/gsm.roadmap): Backlog → Requirement Gathering → Design → Development → Review → Released, mirrored on a GitHub Project board. Public site with [roadmap](https://jwildfire.github.io/obot.roadmap/roadmap.html), [news feed](https://jwildfire.github.io/obot.roadmap/news.html), design docs, reports, and the continuing dev diary.
- **[obot.agent](https://github.com/jwildfire/obot.agent) = the playbook.** Conventions + skills every session loads: session bookends (init = read the roadmap, propose a prioritized plan; wrapup = file loose ends, write the diary entry), drafting/review conventions, approval gates. Thin overlay on the gsm.agent harness (hub requirement [#17](https://github.com/jwildfire/obot.roadmap/issues/17)); renamed from safety.agent and shipped as [v0.1.0 on 07-11](https://github.com/jwildfire/obot.agent/releases/tag/v0.1.0).
- **obotclaw = the identity.** GitHub App instead of a machine account + PAT ([requirement #3](https://github.com/jwildfire/obot.roadmap/issues/3), [design doc](https://jwildfire.github.io/obot.roadmap/requirements/design/3_design.html)); registered 07-04, installed on exactly five whitelisted repos; agents mint one-hour installation tokens; agent commits/PRs authored by obotclaw[bot], keeping my work and the agent's distinguishable in the audit trail ([diary 07-04](https://jwildfire.github.io/obot.roadmap/diary/2026-07-04.html)).

### The Checklist, Revisited

- Map each Reality-section item to its v3 home (the satisfying symmetry — every item survived, the implementations got boring in the good way):
  - durable memory → the roadmap repo (requirements, designs, decisions, diary — versioned on GitHub, not memory files on a dedicated laptop)
  - task queue → the lifecycle + project board (sessions open by reading it, close by updating it)
  - scoped permissions → one-hour app tokens on five repos
  - heartbeats → exist only while something runs (background jobs get a stall monitor; nothing stays alive between sessions)
  - status reporting → the diary + a live session dashboard when multiple agents run at once
  - review gates → everything lands as a draft PR; nothing merges without explicit approval
  - recovery → session wrapup files loose ends back onto the roadmap (stuck work becomes a tracked issue, not a dead chat thread)
- Candidate lines: "Obot v2 tried to supervise a robot employee. Obot v3 admits the durable parts were never the runtime — they were the requirements, the review gates, and the audit trail. GitHub already does those." / "I didn't abandon the supervision problem. I stopped hand-building the plumbing and started configuring it." / "The bottleneck was never intelligence. The bottleneck was supervision."

### Did It Work? (light — #5 covered results; verified numbers)

- Ten days from migration to: safety.viz one chart → seven; three releases in one evening on 07-11 ([safety.viz v1.0.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.0.0), [v1.1.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.1.0), [obot.agent v0.1.0](https://github.com/jwildfire/obot.agent/releases/tag/v0.1.0) — [diary 07-11 session 2](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11-2.html)); [v1.2.0 the next evening](https://github.com/jwildfire/safety.viz/releases/tag/v1.2.0) with eDISH + the 19-figure clinical guide; `{gsm.safety}` v1.0.0 RC staged at the review gate ([draft PR #39](https://github.com/jwildfire/gsm.safety/pull/39)) ([diary 07-12 session 2](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12-2.html)).
- Roadmap symmetry: [hub #1](https://github.com/jwildfire/obot.roadmap/issues/1) — the first requirement filed on 07-02 — closed as delivered on 07-12.
- Tease only (detail moves to #7): the *how* was orchestrated multi-agent sessions — a lead session spawning parallel workers — including two overnight jobs (~2¼ hours, ~1.4M tokens, zero human intervention) that left draft PRs at the review gate by morning ([diary 07-12](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12.html)).
- Candidate closer: "It took two frameworks, three agent roles, a control plane, and a model release to get one good night of sleep. Worth it." *(or hold for #7 with the overnight story)*

### Closer / next-post teaser

- Next post (#7): anatomy of one of these multi-agent sessions from the inside — what ran, what broke, and the bill.

## Material to pull in

- Prior-post callbacks: [#2 Introducing Obot]({% post_url 2026-06-12-setting-up-obot-openclaw %}) (scorecard + promise), [#4 safetyGraphics ❤️ gsm]({% post_url 2026-07-02-safetygraphics-heart-gsm %}) ("With AI agents, I'm not sure that's true anymore"), [#5 Introducing safety.viz]({% post_url 2026-07-12-introducing-safety-viz %}) (closing teaser names Obot v3).
- Hub diary entries (published): [07-02](https://jwildfire.github.io/obot.roadmap/diary/2026-07-02.html) hub scaffold + migration · [07-03](https://jwildfire.github.io/obot.roadmap/diary/2026-07-03.html) site live · [07-04](https://jwildfire.github.io/obot.roadmap/diary/2026-07-04.html) obotclaw app live · [07-11](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11.html) + [07-11-2](https://jwildfire.github.io/obot.roadmap/diary/2026-07-11-2.html) rename, v0.1.0, three releases · [07-12](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12.html) + [07-12-2](https://jwildfire.github.io/obot.roadmap/diary/2026-07-12-2.html) overnight jobs, v1.2.0, RC1.
- Hub issues/docs: [#1](https://github.com/jwildfire/obot.roadmap/issues/1) (closed — bookend), [#3](https://github.com/jwildfire/obot.roadmap/issues/3) + [3_design.html](https://jwildfire.github.io/obot.roadmap/requirements/design/3_design.html) (App), [#7](https://github.com/jwildfire/obot.roadmap/issues/7) (hub migration), [#17](https://github.com/jwildfire/obot.roadmap/issues/17) (obot.agent overlay), [#22](https://github.com/jwildfire/obot.roadmap/issues/22) (this blog series).
- Releases: safety.viz [v1.0.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.0.0) / [v1.1.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.1.0) / [v1.2.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.2.0); [obot.agent v0.1.0](https://github.com/jwildfire/obot.agent/releases/tag/v0.1.0); [obot.roadmap v0.1](https://github.com/jwildfire/obot.roadmap/releases/tag/v0.1).
- Candidate figure: screenshot of the roadmap board/site for `/assets/img/` (matching #5's screenshot pattern) — roadmap.html, news feed, or a diary entry.
- Obot v2 artifacts (Paperclip repo/report, heartbeat logs, PM/Dev/Testing issue flow) — Jeremy to decide what's safe/worth linking; not in the hub diaries.

## Open questions for Jeremy

- Title pick (three options above).
- How much GPT-5.5 / Paperclip color, and which v2 artifacts (if any) to link.
- Version-numbering nit: post #2's interview has obot calling itself "the second bot of the name, following obot v1 / obot-prime" — reconcile (footnote?) with the v2/v3 framing here.
- Include a roadmap-site screenshot, or keep this one image-free?
- Where the "one good night of sleep" closer lives — here or saved for #7.

## AI collaboration footnote (plan)

- Same pattern as #4/#5: "I outlined this post; Claude Code (using Fable 5) helped assemble the outline from my notes and the [project diary](https://jwildfire.github.io/obot.roadmap/); I wrote and edited the final text." — adjust once prose exists.
