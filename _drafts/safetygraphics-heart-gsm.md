---
title: "safetyGraphics ❤️ gsm"
author: "Jeremy Wildfire"
excerpt: "The first concrete demo idea for the R/Pharma keynote: modernizing safetyGraphics, borrowing from gsm, and trying to bridge monitoring and reporting."
tags: RPharma AI ClinicalTrials SafetyGraphics GSM DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 2
status: outline
---

{% comment %}
Draft status: outline only. This post should be fun and concrete: the demo idea, why it matters, and why AI agents make it feel newly possible.
{% endcomment %}

## Working title options

- safetyGraphics ❤️ gsm
- What If Safety Monitoring and Clinical Reporting Shared the Same Workflow?
- The Demo I Want to Build for R/Pharma

## Purpose

Introduce the concrete project idea behind the "what's next" part of the keynote: using AI-assisted development to revisit SafetyGraphics, apply `{gsm}` practices, and explore a bridge between study-conduct safety monitoring and clinical reporting.

## Notes to hit

- I've always wanted to upgrade SafetyGraphics.
- With AI agents, maybe this is finally feasible as a side project / open-source experiment.
- Keep the good stuff:
  - clinical safety review concepts,
  - interactive exploration,
  - open-source accessibility,
  - practical visualizations that medical/safety reviewers understand.
- Modernize the aging parts:
  - rewrite legacy renderers in modern JavaScript,
  - improve data contracts,
  - improve tests and documentation,
  - make rendered artifacts easier for agents and humans to validate.
- Use `{gsm}` best practices:
  - workflows with `{work}`,
  - test matrices with `{qcthat}`,
  - structured reporting patterns,
  - QC-first thinking.
- Make it better than a simple port:
  - static CSR-style outputs to PDF,
  - interactive CSR supplement to HTML,
  - tools that are useful during study conduct, not only after database lock.
- Big idea: bridge the gap between monitoring and reporting.

## Draft structure

### I've wanted to revisit SafetyGraphics for a long time

Explain the affection for the project and what it proved. Keep it personal: this is not just a technical refactor; it is a return to an old idea with new tools.

### What still feels worth keeping

List the durable ideas from SafetyGraphics:

- open clinical safety review,
- interactive exploration,
- reusable visual conventions,
- practical reviewer workflows.

### What needs to change

Describe the legacy renderer / testing / maintainability problem without making it sound like the old project failed. The point is that software ages.

### Why `{gsm}` changes the story

Describe `{gsm}` as a modern workflow and quality substrate: workflows, QC checks, test matrix, and report-ready thinking.

### The project: `gsm.safety`

Introduce `gsm.safety` as the experiment:

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

### The bigger goal

Close on the monitoring-to-reporting bridge. The project is not just modernization; it is a test of whether open clinical tooling plus agents can create a more continuous evidence workflow.

## Links / artifacts to add later

- SafetyGraphics repo or historical posts.
- `{gsm}` docs/repo.
- `gsm.safety` repo or PRs once public/ready.
- Screenshots of old vs new renderers.
- Example static PDF and interactive HTML supplement once available.

## AI collaboration note

Jeremy outlined the idea for this post. An AI model will help draft from Jeremy's notes and any dictated context; Jeremy will edit the final post before publication.

## Prompt / context notes

Potential footnote or collapsible context: include the original bullet outline for "Post 2 - Big Idea: safetyGraphics ❤️ gsm" if it helps readers see the planning process.
