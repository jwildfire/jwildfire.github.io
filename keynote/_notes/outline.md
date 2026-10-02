# Keynote outline — rough draft 2

## Overview
Drafted 2026-10-01 from `research-digest.md` (including the section 7 addendum). L1 = sections, L2 = slides, L3 = details.
The talk is on the morning of Wednesday 21 October 2026, in a 40-minute slot (confirmed by Jeremy, 2026-10-01). About 40 slides.
Draft 2 (2026-10-01) regroups the detailed outline under the four beats below, about 10 minutes and 10 slides each; whether Q&A comes out of the 40 is not known yet.
`[cut?]` = a slide kept from draft 1 that is the first to go if the beat runs long.
`[TODO]` = content that does not exist yet. `[Orange]` = a transition slide with a photo from `keynote/assets/orange/`.
Sources are named in brackets: diary #N is the developer diary post, hub is obot.roadmap.

## Overall Flow

4 beats roughly 10 minutes each
1. Opening - Background and context - Intro Orange talk about path to safetyGraphics
2. openRBQM - Actual Current state right now - GxP monitoring at a large pharma with AI in the loop
3. safety.viz - OrangeBot + Combining safetyGraphics + gsm using semi-autonomous agentic engineering workflows
4. Lessons Learned - What is AI good at now? What's next? 

## Detailed Outline

1. Opening: Orange and the path to safetyGraphics (10 min) — drafted, slides 1–10
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
    - Plants the workflow document that the agents are handed in beat 3
  - What we did, and what we didn't (built, slide 10)
    - "Change the industry standard for how people monitor safety" [diary #3]
    - Modernizing it "needed a team and a budget I no longer have" — or does it? [diary #3]

2. OpenRBQM: GxP monitoring with AI in the loop (10 min) — drafted, slides 11–22
  - Sources: public material (diary #1 and #4, gsm.agent, gsm.roadmap README, the 6 June deck) for slides 11–14 and 21–22; the team's internal Q3 2026 agentic update deck for slides 15–20 (read from Downloads 2026-10-02; the file is not in this repo). `[TODO]` Jeremy vets everything on slides 15–20 before the branch is pushed again
  - Story (from the Q3 deck): the team moved its effort from coding agents to the two ends of the lifecycle, planning and operations, "where the value was"
  - [Orange] What we do right now (built, slide 11)
    - Photo: `orange-reviewing-spreadsheet.jpg`; line "OpenRBQM, with AI in the loop." (draft wording)
  - Monitoring a trial, as software (built, slide 12)
    - gsm: open-source R packages for risk-based quality monitoring, built for GxP from the start [diary #1, diary #4]
    - Image: the report screenshot from the public gsm.kri README (example data); `[TODO]` Jeremy confirms or supplies a newer one
  - AI in the loop (built, slide 13)
    - "We use AI heavily, but it's not autonomous. Humans own the process and all deliverables." [diary #1]
  - +50% (built, slide 14) `[cut?]`
    - Releases up about 50% on last year; issues and pull requests roughly doubled; "not a controlled productivity study" [diary #1]
    - `[TODO]` June figures; the Q3 deck has fresher numbers that could replace them
  - Plan → build → run: we invest at both ends (built, slide 15)
    - Plan and run are our own scaffolds; build is vendor coding agents plus our shared context [Q3 deck]
    - Why: both ends are company-specific process no vendor will build; the middle is commodity and improving monthly
  - "We just let the coding agent deal with it" (built, slide 16)
    - Title is Jeremy's line. Stopped building: a coding agent of our own. Maintain: one context file mapping about 40 repos, plus three skills [Q3 deck: "Coding: maintained, not abandoned"]
    - About a third of recent roadmap-repo commits co-authored by Copilot or Claude
    - Replaces the seven-step red/green gsm.agent slide
  - Deterministic tools first, agents on top (built, slide 17) `[cut?]`
    - Framework → Tools → Skills → Bots; the first three reliable, bots still learning [Q3 deck]
    - "Agents write prose on top of evidence the tools compute, so the numbers stay right even when an agent fails"
  - Plan: agents draft; people approve (built, slide 18)
    - Six stages, Backlog to Done, with an artifact at each and a person signing off every gate [Q3 deck, gsm.roadmap README]
    - Numbers held in the notes: 13 skills, 82 requirements, 64 artifacts, 132 merged pull requests since July
  - Run: one repo per study, one hub to run them (built, slide 19)
    - Study repos (20), central scheduling, intake and a 15-step guide, weekly plan alignment [Q3 deck]
    - `[TODO]` a diagram or dashboard screenshot would beat bullets; the deck's screenshots are internal
  - Run: the hub replaced spreadsheets and email (built, slide 20)
    - Before: Excel trackers, status by email, no live view. Now: merge a schedule and issues open in each study repo, a daily dashboard, an audit trail through pull requests [Q3 deck]
  - AI-written code still needs a human owner (built, slide 21)
    - The four "a person…" lines, verbatim from the 6 June deck
  - The bridge (built, slide 22)
    - "Open, software-shaped workflows are agent-ready." Then: so what happens when the agent does more of the work?
    - Notes: "I'm not comfortable using those highly autonomous tools for GxP use cases right now" [diary #1], so the experiment runs on safetyGraphics
  - Taken out of beat 2 on 2026-10-02 (still in git history)
    - Every metric is the same six steps (Input → Summarize)
    - qcthat: traceability as a byproduct; a better fit for beat 3, where gsm.safety borrows it
    - What good practice looks like now (the diary #10 placeholder); a better fit for beat 4
    - The industry got ready without knowing it (never built)

3. safety.viz: OrangeBot, safetyGraphics and gsm with semi-autonomous agents (10 min) — not drafted
  - From Orange to obot
    - The agent is named after the cat [diary #2]
    - Photo option: `orange-supervising-laptop.jpg`, `orange-desk-copilot.jpg` or `orange-paw-on-github.jpg`
    - Clean-room laptop with none of my credentials; "51% fun and 49% frustrating" [diary #2]
  - The plan: keep, modernize, borrow
    - Keep the expert workflows and interactivity; modernize the code; borrow gsm's quality framework [diary #4]
    - "The outputs need to be checkable — by a person, by a test suite, and by another agent" [diary #4]
  - obot v3: a plan, a playbook and an identity
    - Claude Code plus a roadmap repo, a playbook repo and a bot account [diary #6]
    - One weekend: 5 sessions, 16 named agents
  - The first renderer took weeks; the next six took a weekend
    - Release timeline, 11–12 July: v0.1.0 at 8am, v1.0.0 at 10:30pm, v1.1.0 an hour later, v1.2.0 the next night [diary #5]
    - Image: `safety-viz-gallery.png`
  - A billion tokens in a weekend
    - 1.0B tokens, $1,273 at API prices, $200 a month actually paid, about 10 hours of my time [diary #6]
    - "A 6-month project for less than $2k" [diary #6]
  - Papers → prompts → prototypes
    - Jim Buchanan sends references after a demo; two working prototypes the same evening [diary #7]
    - Hep composite view: 176M tokens, about $143. QT explorer: 308M tokens, about $241
    - The point: agents are only as good as the clinical workflow they are handed (pays off slide 9)
    - Images: `hep-explorer-composite.gif`, `qt-explorer-demo.gif`
  - "Is it validated?"
    - Then: "Not really. It's exploratory." Now: 249 unit tests and 94 browser tests keyed to requirement IDs [diary #5]
    - Every chart ships with a gallery page, an evidence report and an R widget on a public site
    - Image: `safety-viz-evidence.png`
  - Where it stands today
    - 13 chart renderers and six releases since mid-July; gsm.safety brings them to R [diary #8]
    - Newest, unreleased: the Patient Journey Explorer with drafted, cited narratives [digest 7b]
    - `[TODO]` refresh the counts on the morning of the talk
  - Demo
    - `[TODO]` which demo: the gallery, the Patient Journey Explorer, demo-301, or the offline app (not started) [digest 7c]
    - `[TODO]` a recorded fallback either way
  - obot v4: the agent became an organisation
    - Concierge, operating officer, fleet manager, short-lived workers; the load-bearing watcher was a 5-minute timer script [diary #8]
    - "Nine cases in one night of something reporting success while having done nothing"; about $7,000 at API prices across 24 active days [diary #8]
    - Image: the org chart [hub org-chart report]
  - 10 September: I shut it down
    - "The agent structure held… it never produced a release for him to review" [hub diary 2026-09-10]
    - Back to one requirement per session, a definition of done, me driving; three weeks since: one new explorer, no releases [digest 7b]
    - `[TODO]` this exists only in agent-written hub pages; needs Jeremy's own account

4. Lessons learned: what is AI good at now, and what is next (10 min) — not drafted
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

## Left out of draft 2

Kept here so nothing from draft 1 is lost; pull any of it back in.

- The five levels of AI-assisted development as a ladder slide [post 2026-02-10]
- obot v1 baseline numbers: 266 commits and 18 merged pull requests by 10 June [diary #2]
- Gates before fan-out; pick models like picking staff [unpublished draft]
- "Not done until it is demonstrable" as its own slide (folded into "Is it validated?")
- Clinical study reports, your own files, nothing leaving the browser (the unbuilt app plan)

## Open before this can be final

- Whether Q&A comes out of the 40 minutes, and whether the talk is in person or virtual
- Which demo, and whether it is live or recorded
- Whether the industry-history slide stays (it has the least material behind it)
- Whether diary #10 is written before the talk
- Section colours: beat 1 is amber (it suits Orange), beat 2 is teal; beats 3 and 4 take two of the remaining hues
- Beats 3 and 4 are each about three slides over a 10-slide budget; the `[cut?]` marks are where to start
