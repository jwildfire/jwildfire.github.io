---
title: "What Can We Actually Do With AI Agents Right Now? My R/Pharma 2026 keynote, annotated"
author: "Jeremy Wildfire"
excerpt: "The slides from my R/Pharma 2026 keynote, with notes: Orange the cat, ten years of open-source safety graphics, and a summer letting AI agents rebuild them."
tags: RPharma AI Agents OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 10
date: "2026-10-20"
---

<!--
OUTLINE, NOT A DRAFT. Jeremy writes the prose. Everything below the front matter is beats.
Pattern: Simon Willison's annotated talks (simonwillison.net/tags/annotated-talks/).
  - Short intro: where and when, link to the slides (and the video, once there is one).
  - Then slide image, commentary, slide image, commentary. No section headings in the body.
  - Joke or title slides get one line. Most slides get 2-4 sentences. A few get a paragraph.
  - Links inline on key phrases; alt text on each image = the slide's visible text.
  - Ends on the last slide plus one parenthetical line.
26 of the 55 slides are picked. [core] = the high points; [optional] = cut if it runs long.
Images: assets/img/rpharma-2026-keynote/slide-NN.jpg, rendered from keynote.html with
Orange's callouts showing (NN = the slide's number in the talk deck).
Site gotcha: the body must NOT start with a heading (titles-from-headings takes it as the title).

Title options:
  1. What Can We Actually Do With AI Agents Right Now? My R/Pharma 2026 keynote, annotated
  2. R/Pharma Diary #10 — The keynote, annotated
  3. Orange, obot and a summer of agents: my R/Pharma 2026 keynote
Open choices for Jeremy:
  - Diary #10 in the series, or a stand-alone post (front matter assumes #10).
  - Tense: posted before the talk, so "the talk I'm giving Wednesday morning". Add the
    video link after the talk, Simon-style ("Here's the video").
  - Link the slides: keynote.html (the talk) and/or keynote_extended.html (with reserves).
    keynote_extended is orphaned on purpose today; linking it is your call.
-->

INTRO (2-3 sentences, before the first slide)

- I'm giving the opening keynote at R/Pharma 2026 on Wednesday 21 October: "Building open-source clinical trial tools with agentic AI". 40 minutes.
- This is the annotated version, after Simon Willison's [annotated talks](https://simonwillison.net/tags/annotated-talks/): the key slides, with what I'll say about each.
- Full deck: [jwildfire.github.io/keynote/keynote.html](https://jwildfire.github.io/keynote/keynote.html) (arrow keys; N shows notes). The whole story is in the [developer diary](https://jwildfire.github.io/keynote/) this post closes out.

![Building open-source clinical trial tools with agentic AI. Jeremy Wildfire, 21 October 2026](/assets/img/rpharma-2026-keynote/slide-01.jpg)

SLIDE 1 [core] Title

- One line: the title, and that the talk is a status report from a year of using agents on real open-source clinical tools.

![Introducing Orange. He was a very good cat.](/assets/img/rpharma-2026-keynote/slide-02.jpg)

SLIDE 2 [core] Introducing Orange

- Orange: Chilean street cat, survived a fall from a 7th-story window, sat with me while I worked.
- He's the thread through the talk: a different Orange shows up on every section slide, and the agent is named after him.
- Disclaimer from the slide: I work in Gilead's Biostat Innovation Group; these are my opinions.

![The question: What can we actually do with AI agents right now?](/assets/img/rpharma-2026-keynote/slide-03.jpg)

SLIDE 3 [core] The question

- The one question the talk tries to answer. Same wording as [diary #1](https://jwildfire.github.io/2026/06/10/rpharma-keynote-developer-diary.html) back in June.
- Set up the payoff: the answer keeps changing, and we come back to it on slide 52.

![By working in public: the nine developer diary posts, June to September](/assets/img/rpharma-2026-keynote/slide-04.jpg)

SLIDE 4 [optional] By working in public

- How I tried to answer it: nine diary posts, 10 June to 6 September. Link the [series page](https://jwildfire.github.io/keynote/).
- One line: this post is the tenth.

![2012: Why can't I do this for work? Interactive graphics in the New York Times](/assets/img/rpharma-2026-keynote/slide-06.jpg)

SLIDE 6 [optional] Why can't I do this for work?

- 2012, the NYT "512 Paths to the White House". Interactive graphics everywhere except clinical trials.
- Then: we could (slide 7, the Rho Graphics wall), and a standard AE table is 18 pages (slide 8). Fold both into this paragraph rather than showing them.

![safetyGraphics, and the people who built it: the Safety Explorer Suite](/assets/img/rpharma-2026-keynote/slide-10.jpg)

SLIDE 10 [core] safetyGraphics, and the people who built it

- ASA–DIA Safety Working Group: clinicians and data scientists, dozens of companies, five years. Papers, conferences, the FDA.
- Out of it came one open-source R package: a Shiny app for exploring a trial's safety data in the browser.
- Name the people (from the notes): Jim Buchanan, Susan Mayo, Xiao Ni, Melvin Munsaka, Frank Harrell; Agustin Calatroni, Herman Mitchell, Russ Helms and the Rho Graphics Group.
- Links: the [2018 TIRS paper](https://doi.org/10.1177/2168479018754846), the [safetyGraphics v2.0 talk at R/Pharma 2020](https://www.youtube.com/watch?v=2Ykw1jwSw5M), [diary #3](https://jwildfire.github.io/2026/06/16/reintroducing-safetygraphics.html).
- Slide 11 (the hepatic explorer and its 9-step clinical workflow) can be one sentence here: the best thing we built.

![Introducing Inspector Orange. What evidence do you have? Written requirements and a manual test script for every chart. But is it validated? Not really. It's exploratory.](/assets/img/rpharma-2026-keynote/slide-12.jpg)

SLIDE 12 [core] Inspector Orange: what evidence do you have?

- The first question at every pharma talk. Our honest answer then: requirements and test scripts, but not validated. Exploratory.
- Plant it: Inspector Orange asks again on slide 48, and the answer changes shape.

![OpenRBQM: an ecosystem of packages](/assets/img/rpharma-2026-keynote/slide-15.jpg)

SLIDE 15 [core] OpenRBQM: an ecosystem of packages

- 2021–2025: [{gsm}](https://gilead-public.github.io/gsm.core/) and the [OpenRBQM](https://openrbqm.github.io/) packages. Risk-based quality monitoring, as software, with quality built in.
- Quality at scale with [qcthat](https://gilead-public.github.io/qcthat/) (slides 17–18): the issue number goes in the test name; 76 qualified releases across 9 packages.
- Why it matters for the rest of the talk: this is the standard development lifecycle agents had to fit into.

![Levels of AI usage: how much do you hand over? From 0 spicy autocomplete to 5 the dark software factory](/assets/img/rpharma-2026-keynote/slide-21.jpg)

SLIDE 21 [core] Levels of AI usage

- Dan Shapiro's [five levels](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/), via [Simon Willison's write-up](https://simonwillison.net/2026/Jan/28/the-five-levels/). Credit both.
- The day job sits at levels 2–3. This ladder comes back on every obot version slide.

![Same lifecycle; Directly Responsible Humans](/assets/img/rpharma-2026-keynote/slide-22.jpg)

SLIDE 22 [core] Same lifecycle; Directly Responsible Humans

- AI in the loop, Q4 2025 on: agents write code, a named person owns every step.
- Quote from [diary #1](https://jwildfire.github.io/2026/06/10/rpharma-keynote-developer-diary.html): we use AI heavily, but it's not autonomous; humans own the process and all deliverables.
- Optional one-liners for slides 24–25: agents help a lot upstream (planning artifacts) and downstream (one repo per study, one hub to run them).

![Where that leaves us: We're having great success at level 2.5!](/assets/img/rpharma-2026-keynote/slide-26.jpg)

SLIDE 26 [core] Level 2.5

- Efficiency gains, same process. People own every requirement, review and release.
- The hand-off line: but what's next? That question is the summer project.

![The goal: Modernize safetyGraphics, using the gsm framework. 10 original charts, 25,400 lines of JavaScript, all on D3 v3](/assets/img/rpharma-2026-keynote/slide-29.jpg)

SLIDE 29 [core] The goal

- 10 original charts, idle for years (last commits 2019–2022), 25,400 lines of JavaScript, all on D3 v3.
- I'd put it off because I thought it needed a team and about a year. Open source ftw: it was all MIT-licensed and sitting there.
- Slide 28 (Hacker Orange: only one way to find out) can be the lead-in sentence.

![A summer down the AI rabbit hole, with obot: v1 to v5.5](/assets/img/rpharma-2026-keynote/slide-30.jpg)

SLIDE 30 [optional] A summer down the AI rabbit hole

- The map for the next section: six versions of obot, May to October. Each one changed because something broke or a model shipped.
- If cut, put the version list in a sentence under slide 35.

![obot v3, 11–12 July: The first renderer took a few weeks; the next six took a weekend. 1.0 billion tokens, $1,273 at API prices, $200 a month actually paid, about 10 hours of me](/assets/img/rpharma-2026-keynote/slide-35.jpg)

SLIDE 35 [core] The first renderer took a few weeks; the next six took a weekend

- v1 (local assistant) and v2 (OpenClaw, "so many config files") are one sentence each before this; link [diary #2](https://jwildfire.github.io/2026/06/12/setting-up-obot-openclaw.html).
- v3 = Claude Code on Fable 5. Saturday 8 am: one chart. Saturday 10:30 pm: five more. Sunday 10 pm: the hepatic explorer and its clinical guide.
- 1.0 billion tokens, $1,273 at API prices, on a $200 plan, about 10 hours of me. Link [diary #6](https://jwildfire.github.io/2026/07/13/obot-v3-billion-tokens.html) and [#5](https://jwildfire.github.io/2026/07/12/introducing-safety-viz.html).
- What worked: porting old code. Slide 36 adds papers to prototypes in an evening ([diary #7](https://jwildfire.github.io/2026/07/17/papers-prompts-prototypes.html)).

![obot v4: Four roles, and a timer script](/assets/img/rpharma-2026-keynote/slide-38.jpg)

SLIDE 38 [core] Four roles, and a timer script

- v4 asked how far it could get without me in the loop at all: concierge, operating officer, workers, a fleet manager, all driven by a 5-minute timer script.
- The punchline from obot's own [second interview](https://jwildfire.github.io/2026/08/20/obot-v4-second-interview.html): most of the engineering went into watching itself, and the dumb timer script was the only part with a clean record.
- Orange's line: I thought we were building stuff.

![obot v5, September: One requirement at a time. On 10 September I shut v4 down. 468 files of scaffolding went; seven stayed.](/assets/img/rpharma-2026-keynote/slide-39.jpg)

SLIDE 39 [core] Shut it down: one requirement at a time

- 10 September: shut v4 down. 468 files of scaffolding went; seven stayed. In your own words (the slide notes flag this as yours to tell).
- v5: a tree of GitHub issues, one session per requirement, each with a definition of done. Me driving, not reviewing. Back to level 4 with a human at the wheel.
- Link the [obot.roadmap hub](https://jwildfire.github.io/obot.roadmap/) for the tree (slides 41–42).

![obot v5.5, 2–4 October: One orchestrator, one brief, one weekend. 52 agents, 40 of them reviewers, 3.9 billion tokens, 6 releases](/assets/img/rpharma-2026-keynote/slide-44.jpg)

SLIDE 44 [core] One orchestrator, one brief, one weekend

- Opus 5.5. In: one brief of about 800 words, about 22 messages from me, Claude Code as shipped.
- Out: 52 agents (40 reviewers), 3.9 billion tokens ($1,640 at API rates), 6 releases: six biomarker charts in bio.viz and their R twins in gsm.bio.
- What worked: reviewing its own work. What didn't: it still waits on me.

![What we built, May to October 2026: 20 interactive charts, 3 apps, 7 clinical guides; 599 pull requests, 43 releases, 345,000 lines, 5,500 tests](/assets/img/rpharma-2026-keynote/slide-45.jpg)

SLIDE 45 [core] What we built

- Clinical tools: 20 interactive charts (14 safety, 6 biomarker), 3 apps, 7 clinical guides (about 19,000 words on how to read a chart).
- Technical: 599 PRs, 43 releases, about 345,000 lines (43% tests), about 5,500 tests. Counted 13 October over 15 repositories; recount the morning of the post if anything ships.

![The safety.viz demo: your own files, nothing uploaded](/assets/img/rpharma-2026-keynote/slide-46.jpg)

SLIDE 46 [core] The safety.viz demo

- Load your own files; nothing leaves the browser. Link [jwildfire.github.io/safety.viz/demo](https://jwildfire.github.io/safety.viz/demo/) so readers try it.
- Option: embed the 40-second demo video (keynote/assets/safety-viz-demo.mp4) or its GIF instead of the still.

![Costs: $11,750 at API prices. I paid $200 a month.](/assets/img/rpharma-2026-keynote/slide-47.jpg)

SLIDE 47 [core] Costs

- $11,750 at API prices, May to early October; I paid $200 a month on one Claude Max plan.
- Per million tokens: $0.97 in July, $0.41 in October.
- Say the holes plainly: June isn't counted, most of September is missing, so it's a floor. Link the hub's [analytics page](https://jwildfire.github.io/obot.roadmap/analytics/).

![A lot of tests, and still an experiment. 2,963 tests in safety.viz; 40 of 52 agents were reviewers; nothing here has had a formal review.](/assets/img/rpharma-2026-keynote/slide-48.jpg)

SLIDE 48 [core] A lot of tests, and still an experiment

- Inspector Orange's question again (callback to slide 12). Agents test: 2,963 tests in safety.viz, up from 343 in July. Agents review: one caught a bad p-value.
- A person signs: not yet. Tests and reviews are cheap now; the signature is not.
- The pharma takeaway in one line: lots of evidence, no judgement yet. Tie to [diary #9](https://jwildfire.github.io/2026/09/06/not-a-capabilities-problem.html): not a capabilities problem, an execution one.

![Try it out! Pick an agent, set up GitHub, pick a development process, write a prompt, ask questions](/assets/img/rpharma-2026-keynote/slide-50.jpg)

SLIDE 50 [core] Try it out!

- Five steps: an agent ($20 a month), a free GitHub account, a development process ([R Packages](https://r-pkgs.org/)), a prompt, and questions.
- Reproduce the prompt as a code block; it's the most copy-able thing in the talk.

![How fast it is moving: roughly a year, and I could not keep up](/assets/img/rpharma-2026-keynote/slide-51.jpg)

SLIDE 51 [optional] How fast it is moving

- November 2025 (Opus 4.5) to now: a model release every few weeks, an obot version for most of them, and a list of things I never got to.
- The gap between capability and adoption keeps widening. Credit Simon's [2026 in LLMs (so far)](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/) as the timeline's source.

![The question, one last time: Quite a lot! Not at setting priorities. Generating evidence, but not judgement. Software development.](/assets/img/rpharma-2026-keynote/slide-52.jpg)

SLIDE 52 [core] The question, one last time

- Four Oranges answer: quite a lot; not at setting priorities; generating evidence, but not judgement; software development.
- This is the thesis paragraph of the post. Give it the most room.

![Mixed feelings: Coding feels completely different than it did a year ago. It's kind of fun, but I'm certainly not working less.](/assets/img/rpharma-2026-keynote/slide-53.jpg)

SLIDE 53 [core] Mixed feelings

- Coding feels completely different than a year ago; kind of fun, not working less.
- What's next, both sides: more medicines faster (and no more PowerPoint) against data centers and rogue agents. So much change.
- Slide 54 (acknowledgements) folds in here: co-workers, bosses, family, open-source collaborators.

![Thank you! Orange's party](/assets/img/rpharma-2026-keynote/slide-55.jpg)

SLIDE 55 [optional] Thank you

- One line, Simon-style closer. Link the [party page](https://jwildfire.github.io/keynote/party.html) (click for confetti).

AFTER THE TALK (edit in Wednesday afternoon)

- Video link when R/Pharma posts it.
- Anything that changed on stage or in Q&A.

---

Outline drafted by Claude Code using Opus 5.5 for @jwildfire, 17 October 2026.
