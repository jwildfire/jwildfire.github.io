---
title: "R/Pharma Keynote — What Can We Actually Do With AI Agents Right Now?"
author: "Jeremy Wildfire"
excerpt: "Kicking off a developer diary for my R/Pharma keynote on open-source tools, agentic AI, clinical trials, and what we can actually build with agents right now."
tags: RPharma AI ClinicalTrials DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 1
status: draft
---

## TODOs before publishing

- Add the final submitted keynote abstract in the collapsed abstract section below.
- Confirm the exact R/Pharma conference URL to link from the first sentence.
- Add the best link for Fable 5 if there is an official Anthropic announcement; current link points to AWS coverage of Claude Fable 5 availability.
- Add three presentation links for the `{gsm.core}` / OpenRBQM work.
- Confirm whether to keep the release/issue/PR metrics as rounded claims or link to GitHub Insights pages once the numbers are finalized.
- Decide whether to include the original prompt/dictation context as a footnote, collapsible note, or not at all.

# R/Pharma Keynote — What Can We Actually Do With AI Agents Right Now?

I'm giving a keynote at [R/Pharma](https://rinpharma.com/) in October! Talking about open-source tools and agentic AI in clinical trials. It's truly wild. I am excited and honored and slightly terrified.

Expand the section below to see the abstract I submitted. Honestly though, I wrote that two months ago and [Fable 5](https://www.aboutamazon.com/news/aws/claude-fable-5-anthropic-available-amazon-bedrock) came out today, so who knows how much of that will still apply in October.

<details>
<summary>Abstract</summary>

TODO: Add abstract here.

</details>

Here's the plan. I want to talk a little bit about the various open-source projects I've worked on — especially [`{safetyGraphics}`](https://github.com/SafetyGraphics/safetyGraphics) and [`{gsm}`](https://gilead-biostats.github.io/gsm.core/). Mostly, I want to talk about what agentic AI is good at right now. That is a shockingly hard question to answer.

As of today (June 10), my team uses agentic AI, mostly via [GitHub Copilot](https://github.com/features/copilot), to create open-source R packages for use in GxP processes related to risk-based quality monitoring. The main package is called [`{gsm.core}`](https://gilead-biostats.github.io/gsm.core/) and we lead a PHUSE working group called [OpenRBQM](https://openrbqm.github.io/). We wrote a [paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC11335794/) and have done a bunch of presentations (TODO: add three links). We need a better home page.

My team officially started adopting agentic AI in January 2026 ("Everyone should be playing with this to see what works") and started formalizing our processes a few months later ("Everyone should be using this every day"). Our rate of releases has gone up by roughly 50% compared to last year. The number of issues, both opened and closed, has roughly doubled this year. Same with PRs. Humans still own every step of the process — PM, design, coding, code review, qualification, etc. — but we use AI as a power tool in all aspects of the work.

I also want to talk about what's next. GitHub Copilot is powerful, but it's not cutting edge. Agents' ability to work autonomously continues to improve exponentially ([Moore's law for AI](https://openai.com/research/ai-and-compute) is an imperfect analogy, but it gets the point across), so what happens when we have "agentic workers"? Honestly, I don't think that is far away. Maybe it won't be common by this October, but the capabilities aren't far off.

Highly autonomous agents via [OpenClaw](https://openclaw.ai/) and other platforms already exist. OpenAI hired OpenClaw's creator, [Peter Steinberger](https://www.computerworld.com/article/4132725/openai-hires-openclaw-founder-as-ai-agent-race-intensifies.html), and Anthropic CEO Dario Amodei talks about a ["country of geniuses in a datacenter"](https://darioamodei.com/essay/machines-of-loving-grace). How does that future fit into a GxP framework? I'm not at all comfortable using those tools for GxP use cases right now, but the capabilities are coming, and I want to understand them.

So over the next few months I'm going to put my open-source experimentation hat on and try to figure out what we can do with agents right now. I'm not going to be on the absolute cutting edge, but I'll try to stay close behind. I'll do my best to write about it here. And then I'll talk about it as part of the keynote.

The next few posts will talk about what I've done so far — my plan has changed about four times in the last month. I'll try to post regularly right up until the keynote happens.

---

## AI collaboration note

I use AI all the time now, but I'll always try to tell you how I use it. I actually pretty much wrote this whole post! AI provided feedback on both my initial outline and the near-final draft. Most of the time, I'll probably dictate a draft/outline and then have AI write the post, which I'll heavily edit.
