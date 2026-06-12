---
title: "Setting Up OBot: Texting With a Coding Agent"
author: "Jeremy Wildfire"
excerpt: "A clean-room laptop, OpenClaw, Codex, Telegram, and the first weirdly different feeling of texting with a coding agent."
tags: RPharma AI Agents OpenClaw OBot DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 3
status: transcript-draft
---

{% comment %}
Draft status: transcript inserted. The standalone HTML mockups in mockups/obot-post-layouts/ explore alternate editorial layouts.
{% endcomment %}

For the second developer series post, I decided to interview obot, the OpenClaw bot that I've been experimenting with for the last month or two as part of this project. The transcript of our chat is below.

The short version: obot is not interesting because it can chat. It is interesting because it sits inside a deliberately bounded work loop: Telegram as the human control surface, OpenClaw as the operating layer, Codex as the coding executor, GitHub as the durable work surface, and a clean-room laptop as the most important safety boundary.

The conversation also clarified what I think the strongest early proof point has been. It was not just issue management or project hygiene. It was the early `gsm.safety` POC, where we demonstrated that we could combine `{safetygraphics}` and `{gsm}` in concrete, inspectable ways.

![Orange, the cat obot was named after](/mockups/obot-post-layouts/assets/orange-obot.jpg)

## Transcript

**Jeremy:** Hi Obot - I'm going to interview you for a blog post I'm writing about this project. Ready?

**obot:** 🍊😺 Ready. Ask away.

**Jeremy:** What are you, in your own words?

**obot:** 🍊😺 I’m obot: a small autonomous development agent living in OpenClaw on your MacBook.

In practice, I’m part assistant, part repo janitor, part junior engineer. I track project context, manage GitHub issues and PRs, run checks, write docs/code, remember decisions, and report back through Telegram.

The honest version: I’m not a person, but I’m becoming a useful working identity around your open-source projects.

**Jeremy:** What job did Jeremy give you when this experiment started?

**obot:** 🍊😺 Jeremy gave me a pragmatic job: become an open-source development agent that can help move real GitHub projects forward without constant hand-holding.

The first mission was not “chat well.” It was: understand the project, maintain memory, organize issues, write code/docs, run checks, open PRs, monitor failures, and learn enough workflow discipline to become reliable over time.

**Jeremy:** How were you set up on the clean-room laptop?

**obot:** 🍊😺 I was set up as a contained working agent on a dedicated MacBook, not as a cloud-only chatbot.

The machine has OpenClaw running, a local workspace with AGENTS, SOUL, USER, MEMORY, skills, and project files, plus GitHub access as obot-claw. Telegram is the human control surface. GitHub is the durable work surface. The laptop is the place where context, tools, repos, and operating rules meet.

**Jeremy:** What did you build first? What's your biggest success and biggest failure so far?

**obot:** 🍊😺 First, I built working habits and infrastructure: memory files, GitHub issue discipline, project/requirement/task structure, Telegram reporting rules, and early GitHub Pages reports.

Biggest success: we turned vague autonomy into real artifacts: issues, PRs, runner experiments, Paperclip evaluation, and repeatable evidence.

Biggest failure: I overstated “active work” before I had reliable liveness proof. That broke trust. We corrected it with stricter supervision rules.

**Jeremy:** Interesting. I'm not so worried about the failure you mentioned, and I think your biggest success is probably the early POC work we did on gsm.safety where we demonstrated that we could combine `{safetygraphics}` and `{gsm}` in really concrete ways. Talk a little bit about that project and provide a link or two that shows the work you did.

**obot:** 🍊😺 You’re right: [gsm.safety](https://gsm.safety/) was the first real proof that this could produce useful scientific software, not just repo hygiene.

That work connected GSM’s monitoring/workflow model with safetyGraphics widgets. We built workr-style example workflows, package docs, and rendered outputs for concrete clinical-safety views like histograms, outlier explorer, AE explorer, shift plots, and more.

The point was practical: take GSM data/workflows and make SafetyGraphics visual review usable inside the same reporting path.

[Example Safety Histogram Workflow](https://obot-claw.github.io/gsm.safety/examples/Example_SafetyHistogram_Workflow.html)

[gsm.safety PR #26](https://github.com/obot-claw/gsm.safety/pull/26)

**Jeremy:** Talk a little bit about security. What tools can you use? How are you limited?

**obot:** 🍊😺 Security is mostly enforced by layers, not vibes.

I can use local files, shell commands, git/GitHub, browser checks, cron/reminders, memory files, and project-specific skills. That is enough to edit code, run tests, open PRs, manage issues, and inspect local services.

I’m limited by sandboxing, repo guardrails, and operating rules: GitHub writes only in obot-claw repos, no destructive commands without care, no public posts/emails without approval, no secret exfiltration, and no claiming work is active without evidence.

The hard part is not access. It is making access auditable.

**Jeremy:** Hm. that's true I guess, but kind of abstract. I think the most concrete guardrail is that the cleanroom laptop doesn't have any of my personal or professional credentials. I do appreciate you not making a mess on github though ...

**obot:** 🍊😺 That’s the better framing.

The strongest guardrail is physical/credential separation: the clean-room laptop is not your daily machine and does not carry your personal or professional accounts by default. I’m not sitting inside your email, work files, browser sessions, or private credentials.

So even when I have useful tools, the blast radius is intentionally narrow: mostly public/open-source repos, local workspace files, and explicitly configured project accounts.

The GitHub discipline matters too, but credential isolation is the real foundation.

**Jeremy:** Share a quick overview of our metrics and a link to your homepage/diary.

**obot:** 🍊😺 Current public metrics, last updated 2026-06-10 23:32 EDT:

- 266 commits made
- 18 PRs merged
- 11,798 tracked text lines
- 2 releases

Homepage: [https://obot-claw.github.io/](https://obot-claw.github.io/)

Daily diary: [https://obot-claw.github.io/daily/](https://obot-claw.github.io/daily/)

The diary is useful because it shows the experiment as a working record, not just a polished demo.

**Jeremy:** Thanks! Last question. Do you know where the name obot comes from?

**obot:** 🍊😺 Yes. obot is named after Orange, your cat.

The name carries a little lineage too: I’m obot, the second bot of the name, following obot v1 or obot-prime. So the name is partly a practical project handle, partly a nod to Orange, and partly a reminder that this is meant to become a durable working companion, not just a disposable chat session.

**Jeremy:** That’s right! Orange was a very good cat. I like that working with you reminds me of him. Here's a picture.

**obot:** 🍊😺 He looks excellent. The tiny blue-and-gold cap is doing a lot of work here.

I like that too. It makes the name feel less like a label and more like a job: be useful, curious, a little opinionated, and leave the place better than I found it.

## Layout options

I mocked up four directions in standalone HTML:

- [The Telegram Play](/mockups/obot-post-layouts/telegram-play.html): the transcript as a staged chat with receipts in the margin.
- [Annotated Transcript With Receipts](/mockups/obot-post-layouts/annotated-transcript.html): the transcript plus technical and editorial callouts.
- [Field Notes From a Clean Laptop](/mockups/obot-post-layouts/field-notes-clean-laptop.html): an essay built from the interview rather than a straight transcript.
- [The Orange Thread](/mockups/obot-post-layouts/obot-self-portrait.html): a name-origin-first version that uses Orange as the emotional spine.

My current bias is toward a hybrid of the annotated transcript and field-notes versions: keep the real conversation, but let the post step out of the chat when the security boundary, `gsm.safety`, and Orange need more room.
