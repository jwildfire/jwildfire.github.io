---
title: "R/Pharma Diary #5 — Autonomy, or Lack Thereof"
author: "Jeremy Wildfire"
excerpt: "The dream: hand an agent a goal at bedtime and wake up to useful progress. The reality: autonomy is a supervision problem — heartbeats, review gates, a control plane — and one night in July the loop finally closed while I slept."
tags: RPharma AI Agents Autonomy Paperclip OBot DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 5
---

{% comment %} date: set on publish — proposed slot is ahead of the ultracode post, which becomes #6 {% endcomment %}

Back in June, I closed [the Obot post]({% post_url 2026-06-12-setting-up-obot-openclaw %}) with a scorecard — 51% fun, 49% frustrating — and a promise: I was "strongly leaning towards moving on to experiment with other tools. More on that in a future post."[^ai]

This is that post. It took a month to write, and the reason it took a month is the story.

A quick note on sequencing: [the last post]({% post_url 2026-07-02-safetygraphics-heart-gsm %}) promised an introduction to `{gsm.safety}` next. That post is still coming — this one jumped the queue.

## The Dream

What I wanted from Obot was always simple to state:

> Give the agent a goal, go do the day job, and come back to useful progress.

That's the whole dream. Not a chatbot, not fancy autocomplete — a coworker that keeps moving while I'm in meetings.

## The Reality

It didn't happen. Work got busy, my attention drifted, and Obot did not magically keep advancing the project in the background. Every time I checked in, it was right where I'd left it: perfectly capable, patiently idle. The project moved exactly as fast as my attention did — which was the one thing the whole setup was supposed to fix.

The humbling part is that the agent was never the problem. Give it a bounded task — fix this bug, draft this doc, clean up these issues — and it did fine. Autonomy is different. Autonomy is a systems problem, not a model capability. For "come back to useful progress" to work, the system around the agent needs:

- durable memory, so context survives between sessions
- scoped permissions, so it can act without me hovering
- a task queue, so it always knows what's next
- heartbeat/liveness checks, so silence means "working," not "dead"
- status reporting, so I can see progress without interrogating it
- review gates, so nothing ships without a human
- recovery paths, so stuck work gets unstuck instead of quietly dying

None of that is glamorous. All of it, I now think, is the actual product. The boring stuff *is* the autonomy.

## OBot v2

So I started building the boring stuff. OBot v2 was a much more structured framework: a PM agent to own issues, scope, prioritization, and handoffs; a Dev agent for implementation and PRs; a Testing agent for browser checks, visual validation, and regression evidence. OpenClaw heartbeats gave me liveness — a pulse I could check instead of wondering whether anything was actually happening. And a local control-plane layer, Paperclip, to tie the pieces together.

I spent a few days working the problem with GPT-5.5, and it genuinely felt like it was getting close. The roles made sense, the heartbeats beat, and I could squint and see the loop closing.

{% comment %} TODO (Jeremy): a sentence or two of color here — what the GPT-5.5 sessions were like, what Paperclip actually did day-to-day, and whether any of it (repo, report, heartbeat logs) is safe to link. {% endcomment %}

## Then Fable 5 Happened

You can guess what happened next, because it's what always happens in this field: the frontier moved. Just as my homegrown supervision stack felt close, Anthropic shipped Fable 5, and it suddenly seemed worth trying the whole problem inside Claude Code instead of on my own scaffolding. So in early July, the Obot of the June post was formally retired: the always-on OpenClaw runtime shut down, the obot-claw machine account archived — and no more heartbeats, because nothing needs to stay alive anymore. The ideas survived the retirement even though the implementation didn't: the public [roadmap repo](https://github.com/jwildfire/obot.roadmap) became the memory and the task queue, sessions report status as they run, and every piece of work lands as a pull request behind a review gate. I didn't abandon the supervision problem — I just stopped hand-building the plumbing and started configuring it.

## Last Night

Which brings me to why I can finally finish this post.

On the night of July 11–12, I ran the first honest test of the dream. A little after midnight, I launched two overnight agent jobs, both deliberately ambitious stretch goals, with a monitor watching each one for stalls — a direct descendant of those OpenClaw heartbeats, checking job state on a timer and flagging anything silent for more than forty minutes. Then I went to sleep.

Both jobs landed clean in about two and a quarter hours — roughly 1.4 million tokens between them, zero human intervention — and the morning digest was waiting when I woke up:

- A full port of hep-explorer — `{safetyGraphics}`'s [eDISH](https://safetygraphics.github.io/hep-explorer/) liver-safety chart, coordinated participant drill-down and all — to [`safety.viz`](https://github.com/jwildfire/safety.viz), as [draft PR #44](https://github.com/jwildfire/safety.viz/pull/44): +8,487/−32 across 41 files, 307 unit tests and 15 end-to-end tests, CI green, with a [live preview](https://jwildfire.github.io/safety.viz/pr/44/hep-explorer/) I could click around in the browser.
- A v1.0 plan for `{open.gismo}` with a working Phase-0 prototype, as [draft PR #1](https://github.com/jwildfire/open.gismo/pull/1): +7,243/−69 across 103 files, 640 passing R tests, plus a [deployed design report](https://jwildfire.github.io/obot.roadmap/reports/open-gismo-v1-plan-2026-07-12/) laying out the plan and its open decisions.

The detail I care about most: both landed as *draft* pull requests. Neither agent merged anything, released anything, or declared victory — they published previews and a plan for me to read, but nothing shipped. The work rolled up to the review gate and stopped there, waiting for a human.

And the morning review had actual judgment in it. The eDISH port looked great — that one's now the high-priority lane. The `{open.gismo}` plan was thorough, and I disagreed with one of its headline design decisions (roughly: how central GitHub should be to the platform). So that decision is now an [open discussion on the roadmap](https://github.com/jwildfire/obot.roadmap/issues/34) instead of an assumption baked into merged code. That disagreement is the review gate doing its job: autonomy between the gates, judgment at them.

## What I Learned

The hard part is not getting an agent to write code. The hard part is making the work observable, reviewable, and recoverable.

Or shorter: the bottleneck was never intelligence. The bottleneck was supervision.

Look back at the list in The Reality section. That night, every item on it was accounted for: the roadmap was the queue, memory carried context into the jobs, the monitor was the heartbeat, the digest was the status report, scoped permissions let the jobs build, test, and open PRs without waking me, and two draft PRs were the review gates. Recovery was the one item that went untested — the stall alarm was armed but never fired, because nothing stalled. The autonomy that finally worked isn't an agent that never sleeps. It's an agent I can hand a goal at bedtime — because the plumbing around it holds until morning.

It took two frameworks, three agent roles, a control plane, and a model release to get one good night of sleep. Worth it.

Next post: the anatomy of one of these multi-agent sessions from the inside — what ran, what broke, and the bill.

---

[^ai]: **AI collaboration note** — I outlined this post; Claude Code (using Fable 5) drafted it from my outline and the overnight session logs, and I reviewed and edited the result before publication.
