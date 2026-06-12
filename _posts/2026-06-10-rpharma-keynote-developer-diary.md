---
title: "R/Pharma Diary #1 — What Can We Actually Do With AI Agents Right Now?"
author: "Jeremy Wildfire"
excerpt: "Kicking off a developer diary for my R/Pharma keynote on using agentic AI to build open-source tools for clinical trials."
tags: RPharma AI ClinicalTrials DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 1
date: "2026-06-10"
---

I'm giving a keynote at [R/Pharma](https://rinpharma.com/) in October! I'll be talking about open-source tools and agentic AI in clinical trials. It's wild. I'm excited, and slightly terrified. Expand the section below to see the abstract I submitted.

<details markdown="1">
<summary><strong>Abstract</strong></summary>

**AI in the Loop: How Agentic Workflows Are Reshaping Clinical Trial Analytics**

Agentic AI is transforming how software is built, but pharma's regulated environment demands more than raw capability. It demands scaffolding that makes AI behavior repeatable, auditable, and governed by the humans who remain responsible for every line of code.

This keynote offers a practical framework for deploying agentic workflows in GxP settings, grounded in years of building and deploying open-source tools for clinical trials using R.

We begin with the landscape: what agentic tools are (and aren't), how models, scaffolding, and context interact, and why "AI in the loop" — agents operating within human-governed workflows with explicit approval gates — is the right paradigm for regulated work.

We then get concrete, showing how our team uses agentic workflows to accelerate the `{gsm}` family of R packages for monitoring active trials: `{gsm.agent}` drives a red-green TDD cycle from failing test to merged PR; `{gsm.roadmap}` decomposes requirements with AI-assisted planning using GitHub workflows; and `{qcthat}` generates audit-ready traceability matrices as a byproduct of normal development. We share real results and honest limitations.

We close by looking forward, from package development into clinical operations, where the same approach extends to study-level operations, CDISC data generation, and CSR creation using Pharmaverse packages and other tools.

</details>

That's the official version. Honestly, the reality is messier. I wrote that abstract almost two months ago, and [Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) came out today, so who knows what things will look like in October.

So here's the plan: over the next few months, I'm going to put on my open-source experimentation hat and try to figure out what these agents are good at right now.[^sw] I'm not going to be on the absolute cutting edge, but I'll try to stay close behind. In the spirit of open source, I'll do the work in public and write about it here. Then I'll talk about what I learn in the keynote.

## Today: AI in the Loop

To start the talk, I'll introduce the two biggest open-source projects I've worked on: [`{safetyGraphics}`](https://github.com/SafetyGraphics/safetyGraphics) and [`{gsm}`](https://gilead-biostats.github.io/gsm.core/). I've still got a million ideas for these projects — some big, some small — so I'm going to try some things out. Mostly, I want to answer the recurring question for this series: what can we do with these tools right now? How can we use them to create medicines faster and more efficiently? It's a hard question to pin down when the tools keep changing this quickly.

As I write this on June 10, 2026, my team uses agentic AI, mostly via [GitHub Copilot](https://github.com/features/copilot), to create open-source R packages for GxP processes related to risk-based quality monitoring. I'd describe our current approach as "AI in the loop": we use AI heavily, but it's not autonomous. Humans own the process and all deliverables. Our main active project is [`{gsm.core}`](https://gilead-biostats.github.io/gsm.core/), and we lead a PHUSE working group called [OpenRBQM](https://openrbqm.github.io/).

We use the `{gsm}` tools to monitor actual studies. We wrote a [paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC11335794/) and have given a [bunch](https://gilead-biostats.github.io/workr/slides/#/title-slide) of [presentations](https://gilead-biostats.github.io/qcthat/slides/introduction.html#/title-slide) about our work. We need a better home page.

I've been following LLMs for years. It's widely agreed that their programming capabilities took a [huge step forward](https://simonwillison.net/2026/Jan/4/inflection/) with the release of Opus 4.5 and ChatGPT 5.2 in late 2025. My team officially started adopting agentic AI in January 2026 ("Everyone should be experimenting with this as part of your job, just to see what works.") and started formalizing our approach in the following months ("Everyone should be using this every day. Who knows how skills work?") — a process that is still very much ongoing.

Our rate of releases has gone up by roughly 50% compared to last year. The number of issues, both opened and closed, has roughly doubled. Same with PRs. That's not a controlled productivity study — lots of other things changed too — but the activity pattern is real. Humans still own every step of the process: product management, design, coding, code review, qualification, and everything else. But we use AI as a power tool throughout the work. I'll share as much as I can about our best practices and lessons learned here and as part of the talk.

## What's Next?

I also want to talk about what's next. GitHub Copilot is powerful, but it's not the cutting edge. Agents' ability to work autonomously continues to [improve exponentially](https://theaidigest.org/time-horizons). What happens when we have "agentic workers"? What does that even mean? Highly autonomous agents via [OpenClaw](https://openclaw.ai/) and other platforms already exist.

OpenAI hired OpenClaw's creator, [Peter Steinberger](https://www.computerworld.com/article/4132725/openai-hires-openclaw-founder-as-ai-agent-race-intensifies.html), and Anthropic CEO Dario Amodei talks about a ["country of geniuses in a datacenter"](https://darioamodei.com/essay/machines-of-loving-grace).

What can we actually do with more advanced AI harnesses right now? How can they fit into clinical trial workflows in the coming months and years? I'm not comfortable using those highly autonomous tools for GxP use cases right now, but the capabilities are coming, and I want to understand them.

The next few posts will talk about what I've done so far. My plan has changed at least three times since I found out about the keynote last month, and I'm figuring this out as I go - just like everyone else. I'll try to post regularly right up until the keynote. My next post will introduce `obot`: a semi-autonomous, open-source coding agent created with OpenClaw![^ai]

[^sw]: My thinking on this topic is very much influenced by [Simon Willison](https://simonwillison.net/), who writes my favorite blog about AI. He does an excellent job providing concrete examples and use cases. His series on [Agentic Engineering](https://simonwillison.net/tags/agentic-engineering/) in particular is worth a read. I hope that this series and the associated talk can provide a similar perspective for AI usage in clinical trials.

[^ai]: **AI collaboration note** — I use AI all the time now, but I'll always try to tell you how I use it. I wrote the original draft of this post myself. AI provided feedback on the initial outline, did a final copy edit, and helped identify a few places where the framing needed to be clearer. I reviewed and edited the result before publication.
