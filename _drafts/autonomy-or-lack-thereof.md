---
title: "Autonomy, or Lack Thereof"
author: "Jeremy Wildfire"
excerpt: "The first OBot setup was exciting, but useful autonomy turned out to require supervision, heartbeats, agent roles, and a control plane."
tags: RPharma AI Agents Autonomy Paperclip OBot DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 4
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

## Purpose

Explain the first gap between the dream of autonomous AI workers and the reality of agentic development. Use the story of getting busy, losing momentum, and building OBot v2 / Paperclip as the diary frame.

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

End with the frontier moving again. Keep this playful rather than exhaustive: just as the workflow seemed close, a new model/tool release changed what seemed worth trying next.

## Links / artifacts to add later

- OBot/OpenClaw autonomy notes.
- Paperclip report or repo if public.
- Heartbeat logs/screenshots if safe.
- Example PM/Dev/Testing issue flow.
- Fable 5 notes once the experiment is documented.

## AI collaboration note

Jeremy outlined this post from the OBot v2 / Paperclip work. An AI model will help draft from Jeremy's notes or dictation, and Jeremy will edit the final post before publication.

## Prompt / context notes

Potential footnote or collapsible context: include a sanitized version of the prompt or planning notes used while working through the autonomy problem with GPT-5.5.
