---
title: "Autonomy, or Lack Thereof"
author: "Jeremy Wildfire"
excerpt: "The first OBot setup was exciting, but useful autonomy turned out to require supervision, heartbeats, agent roles, and a control plane — and then OBot v3 threw most of that out."
tags: RPharma AI Agents Autonomy Paperclip OBot DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 5
status: outline
---

{% comment %}
Draft status: outline only. This post should stay diary-like while introducing the harder coordination problem behind agentic work.
{% endcomment %}

## Working title options

- Autonomy, or Lack Thereof
- When the Agent Needed a Manager
- Paperclip, Heartbeats, and the Hard Part of AI Workers
- The Boring Stuff Is the Autonomy
- Build the Robot, Then Retire It

## Purpose

Explain the first gap between the dream of autonomous AI workers and the reality of agentic development. Use the story of getting busy, losing momentum, and building OBot v2 / Paperclip as the diary frame. End with the OBot v3 migration (July 2026): after all that supervision infrastructure, the fix was to simplify — retire the always-on runtime and the machine account, and let GitHub itself be the memory and control plane.

## Notes to hit

- Work got busy.
- Got distracted.
- The initial agent setup did not magically keep advancing the project in the background.
- This revealed the harder problem: autonomy needs supervision and infrastructure.
- Development of OBot v2 / a more autonomous framework:
  - OpenClaw heartbeats,
  - PM / Dev / Testing agents,
  - Paperclip,
  - durable memory,
  - status reporting,
  - recovery paths.
- Spent a few days working the problem with GPT-5.5.
- Felt like it was getting close.
- Then Fable 5 was released and it seemed worth trying.
- OBot v3 (July 2, 2026): the simplification.
  - Retired the obot-claw GitHub user account (OBot's machine identity) and the OpenClaw always-on runtime — the operational overhead wasn't paying for itself.
  - New requirements hub: `jwildfire/obot.roadmap`, modeled on Gilead-BioStats/gsm.roadmap — a 6-stage requirement lifecycle (Backlog → Requirement Gathering → Design → Development → Review → Released) mirrored by a GitHub Project board.
  - The roadmap repo replaces the obot-claw.github.io hub as the project's "memory"; hub content (homepage, dashboard, AI diary, artifacts framework) migrates in a pinned follow-up requirement.
  - Portfolio consolidated under `jwildfire/`: safety-agent transferred and renamed to `safety.agent`, plus `gsm.safety` and `RPharma2026-AIKeynote`; the safety-histogram Chart.js pilot lives on as the `dev` branch of `jwildfire/safety-histogram`.
  - The 11 remaining obot-claw repos archived read-only.
  - OBot's future identity: a GitHub App instead of a machine account + PAT — short-lived installation tokens for agents on whitelisted repos, token minting for GitHub Actions, and eventually scheduled agentic runs (e.g., a daily diary).

## Draft structure

### The dream

Describe the desired loop:

> Give the agent a goal, go do the day job, and come back to useful progress.

### The reality

Explain that agents are good at bounded tasks, but autonomy is harder. The system needs:

- durable memory,
- scoped permissions,
- a task queue,
- heartbeat/liveness checks,
- status reporting,
- review gates,
- recovery when work gets stuck.

### OBot v2

Introduce the more structured framework:

- PM agent for issues, scope, prioritization, and handoffs.
- Dev agent for implementation and PRs.
- Testing agent for browser checks, visual validation, and regression evidence.
- OpenClaw heartbeats for liveness.
- Paperclip as a local/control-plane layer.

### What I learned

Potential core line:

> The hard part is not getting an agent to write code. The hard part is making the work observable, reviewable, and recoverable.

Or:

> The bottleneck was not intelligence. The bottleneck was supervision.

### Then Fable 5 happened

The frontier moves again. Keep this playful rather than exhaustive: just as the workflow seemed close, a new model/tool release changed what seemed worth trying next.

### OBot v3: the great simplification

The twist ending. After building all that supervision machinery, the July 2026 migration went the other way — less infrastructure, not more:

- Retired the always-on OpenClaw runtime and the obot-claw machine account. No more heartbeats because there's nothing that needs to stay alive.
- OBot's "memory" is now a requirements hub (`obot.roadmap`), borrowing the gsm.roadmap lifecycle: every piece of work is a requirement that moves Backlog → Requirement Gathering → Design → Development → Review → Released, tracked on a GitHub Project board.
- Everything OBot built now lives under my own account: `safety.agent`, `gsm.safety`, `RPharma2026-AIKeynote`, and the safety-histogram pilot branch. The rest of the machine account's repos are archived.
- Next identity: a GitHub App. Short-lived, per-repo tokens for agents instead of a user account with a PAT — and a path back to scheduled autonomous runs (daily diary) on much safer footing.

Possible framing: v2 tried to supervise a robot employee; v3 admits the durable parts were never the runtime — they were the requirements, the review gates, and the audit trail, and GitHub already does those.

### What's next (Phase 2)

Open questions to end on, diary-style:

- Does OBot get its own computer?
- How much more autonomy is worth the supervision cost?
- Dev containers so the whole setup is portable?

## Links / artifacts to add later

- OBot/OpenClaw autonomy notes.
- Paperclip report or repo if public.
- Heartbeat logs/screenshots if safe.
- Example PM/Dev/Testing issue flow.
- Fable 5 notes once the experiment is documented.
- `jwildfire/obot.roadmap` and its GitHub Project board (once the repo is public).
- The GitHub App requirement and the hub-migration requirement as examples of the new lifecycle in action.
- Example requirement moving through the six stages.

## AI collaboration note

Jeremy outlined this post from the OBot v2 / Paperclip work; the OBot v3 migration sections were added from the July 2026 wind-down session. An AI model will help draft from Jeremy's notes or dictation, and Jeremy will edit the final post before publication.

## Prompt / context notes

Potential footnote or collapsible context: include a sanitized version of the prompt or planning notes used while working through the autonomy problem with GPT-5.5.
