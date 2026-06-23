---
title: "R/Pharma Diary #4 — safetyGraphics ❤️ gsm"
author: "Jeremy Wildfire"
excerpt: "The plan for safetyGraphics v2: keep what worked, modernize toward GxP by borrowing from gsm, and try to bridge clinical trial monitoring and reporting."
tags: RPharma AI ClinicalTrials SafetyGraphics GSM DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 4
status: outline
---

So, here's the plan for {safetyGraphics} v2.[^ai]

We'll keep the good stuff in {safetyGraphics}:

- expert clinical safety review workflows
- interactive exploration
- open-source accessibility
- practical visualizations that medical/safety reviewers understand

At the same time, we'll modernize the legacy framework and make it as close to GxP as we can:

- rewrite legacy renderers in modern JavaScript
- improve data contracts
- improve tests and documentation,
- make rendered artifacts easier for agents and humans to validate.

`{gsm}` was designed to be GxP from the start so we'll use those newly established best practices:

- workflows with `{work}`
- test matrices with `{qcthat}`
- structured reporting patterns
- QC-first thinking

Once thats done, let's see if we can make it better than a simple port. Why can't tools for monitoring a study translate directly into tools for reporting after database lock?

- data simulation framework for robust testing (link gsm.datasim)
- enterprise grade open source platform (link open.gismo)
- static CSR-style outputs to PDF
- interactive CSR supplement to HTML

```text
SafetyGraphics + gsm + AI agents
          |
          v
      gsm.safety
          |
          +-- interactive monitoring
          +-- static reporting
          +-- QC/test matrix
          +-- reproducible evidence trail
```

With AI agents, I genuinely think this is finally feasible without a huge team and millions of dollars. Let's see how much we can get set up by October. Next post starts in on the technical details with an intro of `{gsm.safety}`

[^ai]: **AI collaboration note** — I outlined the idea for this post and provided the source material. An AI model helped draft and organize it from my notes; I reviewed and edited the result before publication.

<!--
Links / artifacts to add later:
- SafetyGraphics repo or historical posts.
- {gsm} docs/repo.
- gsm.safety repo or PRs once public/ready.
- Screenshots of old vs new renderers.
- Example static PDF and interactive HTML supplement once available.
-->
