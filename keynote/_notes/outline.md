# Keynote outline — rough draft 2

## Overview
Drafted 2026-10-01 from `research-digest.md` (including the section 7 addendum). L1 = sections, L2 = slides, L3 = details.
The talk is on the morning of Wednesday 21 October 2026, in a 40-minute slot (confirmed by Jeremy, 2026-10-01). About 40 slides.
Draft 2 (2026-10-01) regroups the detailed outline under the four beats below. Timing as of 2026-10-02: beat 2 grows to about 15 minutes and the other three share the remaining 25 (Jeremy: "expand beat 2 to ~15 minutes and trim elsewhere"). Whether Q&A comes out of the 40 is not known yet.
Beat 3 was re-outlined on 2026-10-05 against the releases of 2 to 5 October and Jeremy's steers of that day; beats 1, 2 and 4 are as they were.
`[cut?]` = a slide kept from draft 1 that is the first to go if the beat runs long.
`[TODO]` = content that does not exist yet. `[Orange]` = a transition slide with a photo from `keynote/assets/orange/`.
Sources are named in brackets: diary #N is the developer diary post, hub is obot.roadmap.

## Overall Flow

4 beats. Originally about 10 minutes each; from 2026-10-02 beat 2 gets about 15 and the rest are trimmed to fit (suggested split: 8 / 15 / 10 / 7, not yet decided)
1. Opening - Background and context - Intro Orange talk about path to safetyGraphics
2. openRBQM - Actual Current state right now - GxP monitoring at a large pharma with AI in the loop
3. safety.viz - OrangeBot + Combining safetyGraphics + gsm using semi-autonomous agentic engineering workflows
4. Lessons Learned - What is AI good at now? What's next? 

## Detailed Outline

1. Opening: Orange and the path to safetyGraphics (about 8 min, suggested) — drafted, slides 1–10
  - Title (built, slide 1)
    - "Building open-source clinical trial tools with agentic AI"
    - Working title from the keynote page; earlier titles were about "AI in the loop" and clinical trial operations
  - The question (built, slide 2)
    - "What can we actually do with AI agents right now?" [diary #1]
    - Asked four times across the summer; the talk answers it and ends on it
  - How I tried to answer it (built, slide 3)
    - Title on the slide: "By working in public". Visual: a looping timeline whose nine numbered points are the diary posts, each linked; the bullets below are speaker notes
    - Working in public: nine diary posts, June to September, every one with an AI collaboration note
    - "My plan has changed at least three times since I found out about the keynote" [diary #1]
    - The submitted abstract versus what happened: "the reality is messier" [diary #1]
  - Introducing Orange (built, slide 4)
    - Photo: `orange-blue-hat.jpg`
    - Origin story: Chilean street cat, Santiago, the first safetyGraphics ideas [hub diary 2026-07-11; not yet told in a post]
    - Line on the slide: "He was a very good cat."
    - Notes: "But, first I want to introduce a key collaborator, Orange! He was a Chilean street cat and was very silly. One time he fell from our 7th story window into the parking lot and survived! He loved sitting with me while I worked. He really was a good cat."
  - Orange at work (built, slide 5)
    - Photo: `orange-asleep-on-trackpad.jpg`
    - Line on the slide: "And *such* a helpful coworker", subtitle "We actually got a lot done!"
    - Notes: "He was a bit of an inconsistent cowoker though. I want to tell you about some of the work Orange and I did together! He was there both when I learned R and when I learned Clinical trials."
    - Hand-off line: "I promise I'm not *just* going to talk about my cat today. This actually is a talk about AI and how it has completely changed how I do my job over the last year."
  - "Why can't I do this for work?" (built, slide 6)
    - SAS in grad school, R at Rho, then D3 after seeing the New York Times interactives [diary #3]
    - Image: `fig1_NYT.png`
    - Orange tie-in: Herman Mitchell let Jeremy work from Chile for five years [diary #3 footnote]
  - A handful of webpages beats a 200-page PDF (built, slide 7)
    - The wall of numbers; the Rho Graphics Group; the Adverse Event Explorer [diary #3]
    - Image: `fig2_aeexplorer.gif`
  - safetyGraphics and the people who built it (built, slide 8)
    - ASA-DIA Safety Working Group: five years of clinicians and data scientists together [diary #3]
    - Acknowledgements up front, by name; `[TODO]` Jeremy confirms which names go on the slide
  - The hepatic explorer and its clinical workflow (built, slide 9)
    - "The best work we did" [diary #3]; image `fig3_hepexplorer.gif`
    - Second image: step 1 of the clinical workflow, screenshot from the safety.viz guide page (`keynote/assets/hep-workflow-step1.png`)
    - Plants the workflow document that the agents are handed in beat 3
  - What we did, and what we didn't (built, slide 10)
    - "Change the industry standard for how people monitor safety" [diary #3]
    - Modernizing it "needed a team and a budget I no longer have" — or does it? [diary #3]

2. OpenRBQM: GxP monitoring with AI in the loop (about 15 min) — drafted, slides 11–24
  - Sources: public material (diary #1 and #4, gsm.agent, gsm.roadmap README, the 6 June deck) for slides 11–16 and 23–24; the team's internal Q3 2026 agentic update deck for slides 17–22 (read from Downloads 2026-10-02; the file is not in this repo). `[TODO]` Jeremy vets everything on the Q3-deck slides (17–22)
  - Story (from the Q3 deck): the team moved its effort from coding agents to the two ends of the lifecycle, planning and operations, "where the value was"
  - [Orange] What we do right now (built, slide 11)
    - Photo: `orange-reviewing-spreadsheet.jpg`; line "OpenRBQM, with AI in the loop." (draft wording)
  - Monitoring a trial, as software (built, slide 12)
    - gsm: open-source R packages for risk-based quality monitoring, built for GxP from the start [diary #1, diary #4]
    - Image: the report screenshot from the public gsm.kri README (example data); `[TODO]` Jeremy confirms or supplies a newer one
  - AI in the loop (built, slide 13)
    - "We use AI heavily, but it's not autonomous. Humans own the process and all deliverables." [diary #1]
  - How much do you hand over? (built, slide 14)
    - The five levels of AI usage as a ladder, level 5 on top, with "the day job" marked at level 3 [March all-hands deck; post 2026-02-10]
    - Level names are Dan Shapiro's via Simon Willison; descriptions reworded; credited on the slide
    - `[TODO]` Jeremy confirms level 3 is still right for October; the ladder can return in beat 3 as obot climbs
  - Same lifecycle; five steps changed hands (built, slide 15)
    - Design, build, publish: each step marked a person, the agent, or automated; merges the all-hands deck's before and after slides into one [March all-hands deck]
    - Optional (Jeremy: "possibly"); it shows the March state, and slide 18 says how it has moved since
  - +50% (built, slide 16)
    - Releases up about 50% on last year; issues and pull requests roughly doubled; "not a controlled productivity study" [diary #1]
    - `[TODO]` June figures; the Q3 deck has fresher numbers that could replace them
  - Plan → build → run: we invest at both ends (built, slide 17)
    - Plan and run are our own scaffolds; build is vendor coding agents plus our shared context [Q3 deck]
    - Why: both ends are company-specific process no vendor will build; the middle is commodity and improving monthly
  - "We just let the coding agent deal with it" (built, slide 18)
    - Title is Jeremy's line. Stopped building: a coding agent of our own. Maintain: one context file mapping about 40 repos, plus three skills [Q3 deck: "Coding: maintained, not abandoned"]
    - About a third of recent roadmap-repo commits co-authored by Copilot or Claude
    - Replaces the seven-step red/green gsm.agent slide
  - Deterministic tools first, agents on top (built, slide 19)
    - Framework → Tools → Skills → Bots; the first three reliable, bots still learning [Q3 deck]
    - "Agents write prose on top of evidence the tools compute, so the numbers stay right even when an agent fails"
  - Plan: agents draft; people approve (built, slide 20)
    - Six stages, Backlog to Done, with an artifact at each and a person signing off every gate [Q3 deck, gsm.roadmap README]
    - Numbers held in the notes: 13 skills, 82 requirements, 64 artifacts, 132 merged pull requests since July
  - Run: one repo per study, one hub to run them (built, slide 21)
    - Study repos (20), central scheduling, intake and a 15-step guide, weekly plan alignment [Q3 deck]
    - `[TODO]` a diagram or dashboard screenshot would beat bullets; the deck's screenshots are internal
  - Run: the hub replaced spreadsheets and email (built, slide 22)
    - Before: Excel trackers, status by email, no live view. Now: merge a schedule and issues open in each study repo, a daily dashboard, an audit trail through pull requests [Q3 deck]
  - AI-written code still needs a human owner (built, slide 23)
    - The four "a person…" lines, verbatim from the 6 June deck
  - The bridge (built, slide 24)
    - "Open, software-shaped workflows are agent-ready." Then: so what happens when the agent does more of the work?
    - Notes: "I'm not comfortable using those highly autonomous tools for GxP use cases right now" [diary #1], so the experiment runs on safetyGraphics
  - Taken out of beat 2 on 2026-10-02 (still in git history)
    - Every metric is the same six steps (Input → Summarize)
    - qcthat: traceability as a byproduct; a better fit for beat 3, where gsm.safety borrows it
    - What good practice looks like now (the diary #10 placeholder); a better fit for beat 4
    - The industry got ready without knowing it (never built)

3. safety.viz: OrangeBot, safetyGraphics and gsm with semi-autonomous agents (about 10 min) — outlined 2026-10-05, not built; proposed slides 25–39
  - Status: re-outlined on 2026-10-05 after Jeremy's steers of that day; he reviews this outline before any slide is built. Facts are checked against GitHub and the local session transcripts as of 2026-10-05; sources are in `research-digest.md` section 8
  - Shape: the beat opens on the goal, and the goal's four lines are its four parts: build, climb, experiment, have fun
  - Budget: 15 slides as listed, for about 10 minutes. The three marked `[cut?]` bring it to 12
  - Hue: 4, blue (proposed). It is the ladder's level-4 colour, where obot spends most of the beat
  - The ladder from slide 14 returns three times (level 4, level 5, level 4). How it returns is a design choice for the build: the full ladder each time, the full ladder once at the end, or a small six-hex strip in the corner of three slides. Suggested: the small strip, which adds no slides
  - [Orange] From Orange to obot (proposed slide 25)
    - The beat's transition slide, forcats hex as the kicker. The agent is named after the cat: "obot is named after Orange, your cat." [diary #2, Obot's words]; "Orange was a very good cat. I like that working with you reminds me of him." [diary #2, Jeremy's]
    - Photo, suggested: `orange-paw-on-github.jpg` (his paw on a laptop showing GitHub). Check before using it: the screen shows three GitHub usernames from the Rho days, small but readable when zoomed. Alternatives `orange-supervising-laptop.jpg` and `orange-desk-copilot.jpg` both show Jeremy
    - Notes: the first obot ran on a clean-room laptop with none of Jeremy's credentials; "51% fun and 49% frustrating" [diary #2]
    - `[TODO]` Jeremy: this slide first and the goal second, or the goal first? Every other beat opens on its Orange photo, so the outline keeps that order
  - The goal (proposed slide 26)
    - Jeremy's words (2026-10-05), four lines on the slide:
      - Build a modern version of safetyGraphics, with everything we've learned from gsm as the foundation
      - See just how high we can climb the levels of automation
      - Experiment
      - Have some fun!
    - Answers beat 2's bridge ("so what happens when the agent does more of the work?") and sets up the four parts below
    - Notes: why this project and not the day job: "I'm not comfortable using those highly autonomous tools for GxP use cases right now" [diary #1]
  - The disclaimer (proposed slide 27) `[cut?]` could be a second click on slide 26
    - On the slide, Jeremy's words: "This is really, really not GxP" and, smaller, "(but there are A LOT of tests included …)"
    - Pays off on the "Is it validated?" slide, where the tests get counted
  - Part 1 · Build
  - The plan: keep, modernize, borrow (proposed slide 28)
    - Three columns. Keep the expert workflows and the interactivity; modernize a decade-old charting engine; borrow gsm's quality framework [diary #4]
    - "Instead of inventing a new quality framework, we plug the safety graphics into a quality framework that already exists." [diary #4]
    - "The outputs need to be checkable — by a person, by a test suite, and by another agent." [diary #4]
    - qcthat hex as the kicker
  - obot v3: a plan, a playbook and an identity (proposed slide 29) `[cut?]` its content can move to the notes of slide 30
    - Claude Code plus obot.roadmap ("the plan and the memory"), obot.agent ("the playbook") and a bot account ("the identity") [diary #6]
    - Ladder marker: level 4, "you write the specs and plans; agents do the work"
    - One weekend: 5 sessions, 16 named agents [diary #6]
  - "The first renderer took a few weeks; the next six took a weekend." (proposed slide 30)
    - The headline is the diary #5 line, quoted exactly
    - Four-step release timeline, 11–12 July: v0.1.0 at 8 am, v1.0.0 at 10:30 pm, v1.1.0 at 11:50 pm, v1.2.0 at 10 pm the next night [diary #5; times match the GitHub release timestamps]
    - Folded in from the old "billion tokens" slide: 1.0B tokens, $1,273 at API prices, $200 a month actually paid, about 10 hours of Jeremy's time [diary #6]
    - Notes: "delivering a 6-month project for less than $2k seems like an amazing deal" [diary #6]
  - Papers → prompts → prototypes (proposed slide 31)
    - Jim Buchanan sends references after a demo; two working prototypes the same evening [diary #7]
    - Hepatic composite view: 176M tokens, about $143. QT explorer: 308M tokens, about $241 [diary #7]
    - The point: agents are only as good as the clinical workflow they are handed (pays off slide 9)
    - Images: `hep-explorer-composite.gif`, `qt-explorer-demo.gif`
  - "Is it validated?" (proposed slide 32)
    - Then: "Not really. It's exploratory" [diary #5]. Now: 2,185 unit tests and 374 browser tests keyed to requirement IDs [safety.viz v1.9.1 release notes]. In July it was 249 and 94 [diary #5]
    - Every chart has a live demo and a published evidence report. Still not GxP: this is where the disclaimer pays off
    - Images: a fresh screenshot of an evidence page; the July one in `assets/img/` shows July's counts
    - testthat hex as the kicker
    - Callout, proposed (thumbs-up): "Catching real errors, including its own". A reviewer agent found that a p-value an earlier agent had put on the histogram "is not an F-test p-value"; v1.9.1 deprecates it [safety.viz#188]. Also available: the death count that went from 4 to 13, which is in gsm.safety's unreleased v1.2.0 candidate
  - Part 2 · Climb
  - obot v4: the agent became an organisation (proposed slide 33)
    - "The agent stopped being a worker and became an organisation" [diary #8, Obot's words]
    - Six-step chain in the deck's style, labels from the post's diagram: Jeremy, concierge, operating officer, workers, fleet manager, and a timer script that is not an agent and was the only part with a clean record
    - Ladder marker: level 5, reached for
    - Notes: "never let an agent be the sole watcher of an agent" [diary #8]
  - Quietly wrong (proposed slide 34)
    - Quote slide: "Nine cases in one night of something reporting success while having done nothing." [diary #8, Obot's words about itself]
    - Notes: about $7,000 at API prices across 24 active days, on a $200 a month plan [diary #8; the hub's usage data gives $7,124 for 9 July to 19 August]
    - Callout (thumbs-down): "Knowing when it has failed"
  - 10 September: I shut it down (proposed slide 35)
    - `[TODO]` Jeremy's own account. The only record is agent-written: "the agent structure held… it never produced a release for him to review" [hub diary 2026-09-10]
    - Facts available: 475 files of scaffolding removed from obot.agent, seven left; back to one requirement per session with a definition of done, Jeremy driving [hub diary 2026-09-10, hub NEWS v0.4]
    - `[TODO]` Jeremy: the "mixed feelings" promised in diary #8. Here, or kept for beat 4 where the outline already has a slide for them
    - Callout, proposed (thumbs-down): "Remembering". The readout said memory management was poor
  - One orchestrator, one brief, one weekend (proposed slide 36)
    - Jeremy's steer (2026-10-05): "Capabilities keep improving and Opus 5.5 moved the goal posts again. Orchestration works *great* with a simple prompt now." The last evolution of obot before the talk
    - What went in: one brief of about 800 words, about 22 messages from Jeremy over three days, Claude Code as shipped. No custom scaffolding
    - What came back, Friday 2 to Sunday 4 October: 52 agents (40 of them reviewers of the other 12's work), 3.9 billion tokens, six releases across three packages, all twelve requirements of the objective [local transcript; digest 8c]
    - Cost: about $1,640 at API list prices for the whole session; $737 of that by Saturday morning ["Today's API cost summary" session and the same rates applied to the whole transcript; digest 8c]
    - Ladder marker: back to level 4, with Jeremy driving (his answer, 2026-10-05)
    - `[TODO]` Jeremy: two figures of his that the transcript does not reproduce. "Over 1,000 subagents": the transcript has 52 agents and about 9,800 model requests. "Half my weekly allotment": the last meter reading on record is 21% on the Friday night
    - `[TODO]` Jeremy: what to call it. "obot v5" is a placeholder of the outline's, not his
    - Notes: the same Friday, two ordinary sessions took the demo app from "I want to work on creating an app version" to the v1.8.0 release in about 12 hours, for about $150 at API prices
  - Part 3 · Experiment
  - Agents are great at experiments (proposed slide 37)
    - Headline is Jeremy's line (2026-10-05)
    - Kept going: bio.viz and gsm.bio, six biomarker charts with every test computed by R, two releases each in four days [GitHub releases]
    - Stopped at a prototype: AI-drafted safety narratives for the Patient Journey Explorer (merged in September, taken out of v1.8.0, parked on a branch) and open.csr (v0.3.0 in August; its next candidate has sat unreviewed since 2 September) [safety.viz#178; open.csr#75]
    - Nothing on the slide or in the notes about where the biomarker charts' design came from
    - Callout (thumbs-up): "Running experiments"
  - Where it landed
  - Where it stands today (proposed slide 38) `[cut?]` its numbers can be said over the demo
    - 14 releases of safety.viz since 11 July; the latest, v1.9.1, on 4 October [GitHub releases]
    - 13 charts in the library and the app: 8 stable, 5 marked Experimental. One more is a Prototype and is not counted [safety.viz v1.8.0 release notes, `site/config.json`]
    - In R: released gsm.safety (v1.1.0, 17 August) carries 9 of the 13; the other 4 are in a release candidate that has waited on Jeremy's review since 14 September [gsm.safety#88]. Sets up beat 4's "review is the bottleneck"
    - Not done: the 22 figures in the FDA safety guidance, all specified, none drawn [obot.roadmap#323, #324]
    - `[TODO]` refresh the counts on the morning of the talk
  - Demo: your own files, one HTML file, offline (proposed slide 39)
    - Decided 2026-10-05: the safety.viz demo app, released in v1.8.0. Drop CSV or JSON files, the columns are mapped with every guess labelled, the charts the data supports are drawn, nothing is uploaded [safety.viz v1.8.0 and v1.9.1 release notes]
    - The whole app is one HTML file of about 1.2 MB that runs with no network, so the demo does not depend on conference wifi
    - Slide: the app's Data view beside a chart, as the fallback picture if the demo is skipped
    - `[TODO]` Jeremy: live or recorded, and which files to drop in. A recorded fallback either way
    - `[TODO]` the fourth line of the goal, "have some fun": a closing line here that hands to beat 4. "51% fun and 49% frustrating" was the June number; what is it now?
    - Ruled out: demo-301 (its weekly pipeline failed on 28 September and 5 October), the live audience-ideas demo (its tooling was retired on 10 September), the Patient Journey Explorer (a Prototype with known issues)

4. Lessons learned: what is AI good at now, and what is next (about 7 min, suggested) — not drafted
  - [Orange] transition
    - Photo option: `orange-looking-up-agenda.jpg` (so what now?) or `orange-asleep-on-keyboard.jpg`
  - The summer in one number
    - About 315,000 lines across 367 pull requests, 23 releases and 12 repositories, "from one person and a few agents, working in spare time" [diary #9]
  - What is AI good at?
    - Teaching me things!
    - Busy work: making slides (thank goodness!), meeting minutes
    - Design: artifacts are amazing; .md → .html
    - Syntax: `git`
    - Writing code (add links)
    - Catching real errors, including its own: the death count that went from 4 to 13, measured twice [gsm.safety NEWS, v1.2.0]; 97 claims checked, 68 confirmed [hub org-chart report]
  - What is AI bad at?
    - Communicating: being concise
    - Prioritizing
    - Remembering
    - Knowing when it has failed: "quietly wrong" [diary #8]
  - Best practices
    - Use version control
    - Standard SDLC
    - Just use Claude Code or Codex or ...
    - Never let an agent be the sole watcher of an agent [diary #8]
    - Commit working notes; transcript-only work dies with the session [unpublished draft]
    - Requirements before work
  - The bottleneck moved
    - "Review, not writing, is the bottleneck" [diary #9]
    - "The bottleneck still isn't intelligence. It's plumbing." [unpublished draft]
  - Mixed feelings
    - "I'll talk about that more in the keynote" [diary #8]
    - `[TODO]` Jeremy only
  - The execution gap `[cut?]`
    - AI standards move in months; GxP moves slowly by design [diary #9]
    - Version control and semantic versioning as a prerequisite; agents as "the best change-management tool we have"
  - Open source is the path
    - The precompetitive base: OpenRBQM, safetyGraphics, pharmaverse, R Validation Hub, CDISC [diary #9]
    - A community opportunity, which is why this talk is at R/Pharma [dictation notes 2026-06-06]
  - What is next
    - The same data twice: monitoring charts that become reporting figures after database lock [diary #4]
    - The 22 figures in the FDA safety guidance: all specified, none drawn yet [digest 7b]
    - `[TODO]` decide how much of the unbuilt mid-October plan to promise on stage
  - If the models were frozen today
    - "Clinical trials would still be completely different in five years" [diary #9]
    - Amodei: "A compressed century of biology is only possible with a compressed century of trials" [diary #9] `[cut?]`
  - The question, one last time
    - "What can we do right now?" — quite a lot. So what is stopping us?
  - [Orange] Thank you
    - Photo option: `orange-asleep-on-typing-arm.jpg`, or the porch video `orange-porch.mov`
    - Links: the deck, the diary, the repos; QR code
    - `[TODO]` turn the keynote page into the "start here" page and link the deck from it

## Callouts: "What are agents good at now?"

A recurring callout in the bottom-right corner: Orange's face in an amber hex with a thumbs-up, the question in small capitals, the answer in a speech bubble (design B, chosen 2026-10-02). The close in beat 4 gathers the same answers into one list.

- Placed
  - Teaching me things — slide 6, "Why can't I do this for work?"
  - Writing code — slide 18, "We just let the coding agent deal with it"
  - Drafting documents — slide 20, "Agents draft; people approve"
- Proposed for beat 3 (not built)
  - Catching real errors, including its own — "Is it validated?"
  - Running experiments — "Agents are great at experiments" (Jeremy's wording, 2026-10-05)
- Candidates from the close-out list, not placed yet
  - Busy work: making slides, meeting minutes
  - Design: artifacts, .md → .html
  - Syntax: git
- Thumbs-down version, "What are agents bad at now?": an unimpressed Orange in a muted-red hex, bottom-left corner
  - Placed: Setting priorities — slide 20, "Agents draft; people approve" (alongside "Drafting documents")
  - Proposed for beat 3 (not built): knowing when it has failed — "Quietly wrong"; remembering — "10 September: I shut it down"
  - Candidates from the close-out list, not placed yet: being concise

## Left out of draft 2

Kept here so nothing from draft 1 is lost; pull any of it back in.

- The five levels of AI-assisted development as a ladder slide [post 2026-02-10]
- obot v1 baseline numbers: 266 commits and 18 merged pull requests by 10 June [diary #2]
- Gates before fan-out; pick models like picking staff [unpublished draft]
- "Not done until it is demonstrable" as its own slide (folded into "Is it validated?")
- Clinical study reports, your own files, nothing leaving the browser (the unbuilt app plan)

## Open before this can be final

- Whether Q&A comes out of the 40 minutes, and whether the talk is in person or virtual
- The demo is the safety.viz demo app (decided 2026-10-05); whether it is live or recorded is still open
- Whether the industry-history slide stays (it has the least material behind it)
- Whether diary #10 is written before the talk
- Section colours: beat 1 is amber (it suits Orange), beat 2 is teal; beat 3 is proposed as blue (hue 4); beat 4 takes one of the remaining hues
- Where the five minutes for beat 2 come from. Suggested: two from beat 1 (it is ten quick slides already) and three from beat 4, with beat 3 held at ten. Beat 2's fourteen slides now fit its fifteen minutes, so its cut marks are removed
- Beats 3 and 4 as outlined are each about three slides over even a 10-slide budget, and beat 4 now has about seven minutes; the `[cut?]` marks are where to start, and the recurring callouts can carry some of beat 4's "good at / bad at" lists before the close
- Beat 3 before it is built: Jeremy reviews the outline above; the order of its first two slides; how the ladder returns; the transition photo; which of the three `[cut?]` slides go
- Stale in beat 4 after 5 October, left for Jeremy since beat 4 is his to revise:
  - "The summer in one number" stops at 6 September. Since then: seven more releases and two new packages (digest 8a)
  - "What is next" asks how much of the unbuilt mid-October plan to promise. The app part is built and released; the 22 FDA figures are still none drawn
  - "Left out of draft 2" calls "your own files, nothing leaving the browser" the unbuilt app plan. It shipped in safety.viz v1.8.0
