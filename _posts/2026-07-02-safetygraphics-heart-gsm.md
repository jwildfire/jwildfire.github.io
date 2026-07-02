---
title: "R/Pharma Diary #4 — safetyGraphics ❤️ gsm"
author: "Jeremy Wildfire"
excerpt: "The plan for safetyGraphics v2: keep what worked, modernize toward GxP by borrowing from gsm, and try to bridge clinical trial monitoring and reporting."
tags: RPharma AI ClinicalTrials SafetyGraphics GSM DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 4
date: "2026-07-02"
---

So, here's the plan for [`{safetyGraphics}`](https://github.com/SafetyGraphics/safetyGraphics) v2.[^ai]

In the [last post]({% post_url 2026-06-16-reintroducing-safetygraphics %}), I said that doing `{safetyGraphics}` justice always felt like it needed a big team and budget. With AI agents, I'm not sure that's true anymore. Let's see what we can do: keep what worked, modernize what didn't, and then — if things go well — push past what the original ever did.

## Keep the Good Stuff

The best parts of `{safetyGraphics}` were never really about the code. They came from years of clinicians and data scientists working side by side, and v2 keeps all of it:

- **Expert clinical safety review workflows** — the tools encode how experienced safety monitors actually review a trial, not just generic data exploration. 
- **Interactive exploration** — click on a point, see the patient. A handful of webpages beats a 200-page PDF.
- **Open-source accessibility** — free tools that anyone can use, inspect, and extend.
- **Practical visualizations** — charts that medical and safety reviewers already understand, like [eDISH](https://safetygraphics.github.io/hep-explorer/).

## Modernize the Framework

Much of the `{safetyGraphics}` JavaScript dates back nearly a decade. Our primary charting engine is [D3](https://d3js.org/) v3 — D3 is now on v7.9. I suspect modernizing the framework is exactly the kind of task agents can handle semi-independently, so let's see if we can:

- rewrite the legacy renderers in modern JavaScript
- improve the data contracts between R and the charts
- improve tests and documentation
- make rendered artifacts easier for agents and humans to validate

That last item wasn't on anyone's list in 2019, but it matters now. If an agent is going to help maintain these tools, the outputs need to be checkable — by a person, by a test suite, and by another agent.

## Borrow from `{gsm}`

The `{gsm}` framework takes a lot of inspiration from `{safetyGraphics}`, but there is one huge difference. Unlike `{safetyGraphics}`, [`{gsm}`](https://gilead-biostats.github.io/gsm.core/) was designed for GxP from the start, so v2 gets to borrow best practices that the OpenRBQM team has spent years establishing:

- workflows with [`{workr}`](https://gilead-biostats.github.io/workr/)
- test and traceability matrices with [`{qcthat}`](https://gilead-biostats.github.io/qcthat/)
- structured reporting and data patterns

Instead of inventing a new quality framework, we plug the safety graphics into a quality framework that already exists.

## Beyond a Port

Once that's done, let's see if we can make this better than a simple port. Here's the question that I keep coming back to: why can't tools for monitoring a study translate directly into tools for reporting after database lock? It's the same data[^cdisc] and largely the same charts — one just arrives incrementally with a dashboard, and the other lands all at once in a document. My stretch goal is static CSR-style outputs rendered to PDF alongside interactive charts built in HTML.

A few ingredients from the broader `{gsm}` ecosystem make the bridge plausible:

- a data simulation framework for robust testing ([`{gsm.datasim}`](https://github.com/Gilead-BioStats/gsm.datasim))
- a work-in-progress, enterprise-grade open-source analytics platform ([`{open.gismo}`](https://github.com/Gilead-BioStats/open.gismo))

## Can We Actually Do This?

With AI agents, I genuinely think it's feasible. That's the bet, anyway, and the whole point of this diary is to test it in public. Let's see how much we can get set up by October.

Next post starts in on the technical details with an introduction to `{gsm.safety}`.

[^ai]: **AI collaboration note** — I outlined this post in June. Claude Code (using Fable 5) expanded my outline into a draft, and I reviewed and edited the result before publication.

[^cdisc]: While it's the same clinical data, I am very aware that the data pipelines/lifecycles are complicated and that different CDISC standards are available at different time points in the study life-cycle. I actually think that speeding up SDTM availability (for example) is an area where AI could bring a lot of value ... More on that in future posts and in the talk.
