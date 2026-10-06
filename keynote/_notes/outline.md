# Keynote outline — rough draft 2

## Overview
Drafted 2026-10-01 from `research-digest.md` (including the section 7 addendum). L1 = sections, L2 = slides, L3 = details.
The talk is on the morning of Wednesday 21 October 2026, in a 40-minute slot (confirmed by Jeremy, 2026-10-01). About 40 slides.
Draft 2 (2026-10-01) regroups the detailed outline under the four beats below. Timing as of 2026-10-02: beat 2 grows to about 15 minutes and the other three share the remaining 25 (Jeremy: "expand beat 2 to ~15 minutes and trim elsewhere"). Whether Q&A comes out of the 40 is not known yet.
Beat 3 was rebuilt on 2026-10-05 as a journey through five obot versions, against the releases of 2 to 5 October and Jeremy's steers of that day; beat 2 gained two slides the same day; beats 1 and 4 are as they were.
`[cut?]` = a slide kept from draft 1 that is the first to go if the beat runs long.
`[TODO]` = content that does not exist yet. `[Orange]` = a transition slide with a photo from `keynote/assets/orange/`.
Sources are named in brackets: diary #N is the developer diary post, hub is obot.roadmap.

## Overall Flow

Four beats, regrouped late on 2026-10-05 into five parts when Jeremy split beat 3 ("3 = Goal + 'What we built' 3.5 = how we built it (cost/sdlc/treemaps/timeline overview) 4 = what we learned (good/bad/mixed feelings/closing)"). Originally about 10 minutes each; from 2026-10-02 beat 2 gets about 15 and the rest are trimmed to fit (suggested split then: 8 / 15 / 10 / 7; not re-divided for 3.5 yet)
1. Opening - Background and context - Intro Orange talk about path to safetyGraphics
2. openRBQM - Actual Current state right now - GxP monitoring at a large pharma: first how it works without AI (gsm, OpenRBQM, the lifecycle, GxP evidence), then how AI was layered in
3. What's next? The goal and what we built: a summer down the AI rabbit hole with obot, six versions of the agent, modernizing safetyGraphics on the gsm framework
3.5. How we built it: costs, the SDLC (quality, the roadmap), the timeline
4. What we learned: good at, bad at, mixed feelings, closing

## Detailed Outline

1. Opening: Orange and the path to safetyGraphics (about 8 min, suggested) — drafted, slides 1–10
  - Title (built, slide 1)
    - "Building open-source clinical trial tools with agentic AI"
    - Spoken intro, in the speaker notes (Jeremy, 2026-10-06): "Hi I'm Jeremy and I work on building open source tools for clinical trials. I've spent the last few years trying to figure out how AI fits into this world." The second half is spoken over slide 2: "Today I'm going to talk about what these tools are good at right now ... As you'll see, the answer to that question changes on a regular basis."
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
    - From 2026-10-06 a graphic slide: the safetyGraphics hex beside a dashed placeholder for the contributing companies' logos. The four bullets it carried are now in its speaker notes
    - `[TODO]` Jeremy: the companies graphic, from an old slide (drop it in `keynote/_notes/inbox/`)
    - ASA-DIA Safety Working Group: five years of clinicians and data scientists together [diary #3]
    - Acknowledgements up front, by name; `[TODO]` Jeremy confirms which names go on the slide
  - The hepatic explorer and its clinical workflow (built, slide 9)
    - "The best work we did" [diary #3]; image `fig3_hepexplorer.gif`
    - Second image: step 1 of the clinical workflow, screenshot from the safety.viz guide page (`keynote/assets/hep-workflow-step1.png`)
    - Plants the workflow document that the agents are handed in beat 3
  - What we did, and what we didn't (built, slide 10)
    - "Change the industry standard for how people monitor safety" [diary #3]
    - Modernizing it "needed a team and a budget I no longer have" — or does it? [diary #3]

2. OpenRBQM: GxP monitoring, first without AI and then with it (about 15 min) — drafted, slides 11–29; split in two on 2026-10-06
  - Sources: public material (diary #1 and #4, gsm.agent, gsm.roadmap README, the 6 June deck) for slides 11–20 and 15–29; the team's internal Q3 2026 agentic update deck for slides 21–24 and 26–27 (read from Downloads 2026-10-02; the file is not in this repo). `[TODO]` Jeremy vets everything on the Q3-deck slides (17–20, 22–23)
  - Checked 2026-10-05: gsm.roadmap and gsm.agent are NOT publicly reachable (the gsm.roadmap site redirects to a GitHub sign-in; both repositories return 404 without a login). So what beat 2 says about them is not from public sources, and no gsm.roadmap artifact can be shown or linked. `[TODO]` Jeremy decides what can be said and shown
  - Story (from the Q3 deck): the team moved its effort from coding agents to the two ends of the lifecycle, planning and operations, "where the value was"
  - Part 2a: OpenRBQM and how it works without AI (Jeremy, 2026-10-06: "Need to intro gsm/openRBQM and explian how it works without AI before getting into AI. slides 11/12 stay.")
  - [Orange] OpenRBQM (built, slide 11)
    - Photo: `orange-reviewing-spreadsheet.jpg`. Headline and line are Jeremy's (2026-10-06): "OpenRBQM" and "Open-source Risk Based Quality Monitoring. GxP by design." Before that: "What we do right now" / "OpenRBQM, with AI in the loop."
    - `[TODO]` Jeremy: the OpenRBQM site says "risk-based quality management"; confirm "Monitoring"
  - Monitoring a trial, as software (built, slide 12)
    - gsm: open-source R packages for risk-based quality monitoring, built for GxP from the start [diary #1, diary #4]
    - Image: the report screenshot from the public gsm.kri README (example data); `[TODO]` Jeremy confirms or supplies a newer one
  - OpenRBQM, in more detail (placeholder, slide 13): `[TODO]` Jeremy. "A new slide with more details about OpenRBQM (add a todo)". Suggestions on the placeholder: the packages and who is in the PHUSE collaboration; one pipeline for every metric; a diagram or screenshot
  - A standard development lifecycle (built, slide 14): the lifecycle slide without the AI overlay, every step a person or automated (Jeremy: "immediately intro SDLC (s15 without the AI overlay)")
    - `[TODO]` Jeremy: check the steps against the March all-hands deck's "Standard Development Lifecycle" slide; this version was worked back from the merged slide
  - GxP is built into the design (built, slide 15; the qcthat slide, moved up)
    - Jeremy (2026-10-06): "OpenRBQM has GxP built into it's design. Every package ships with evidence, every time." The headline and the line under the columns are that sentence in two parts; the old headline ("Traceability as a byproduct") and the qualification line are in the notes
    - Restored on 2026-10-05 (Jeremy: "Missing a slide around quality"; "restore it, plus qualification"). The qcthat slide cut on 2 October, with one new line: "Qualification: every requirement has a test, every test has a result, and a person signs the release."
    - `[TODO]` Jeremy vets the qualification line and supplies a real qcthat report if one can be shown
  - Part 2b: how we have layered AI in (Jeremy, 2026-10-06: "Then we talk about how we've layered in AI. then experiments."). An Orange section break opens it
  - [Orange] AI in the loop (built, slide 16; title is Jeremy's and tentative)
    - Photo: `orange-paw-on-trackpad.jpg`, cropped to the bottom of the frame (swapped 2026-10-06; `orange-desk-copilot.jpg` is now unused). Line, draft: "The same lifecycle, with an agent in some of the seats."
  - AI in the loop (built, slide 17)
    - "We use AI heavily, but it's not autonomous. Humans own the process and all deliverables." [diary #1]
  - How much do you hand over? (built, slide 18)
    - The five levels of AI usage as a ladder, level 5 on top, with "the day job" marked at level 3 [March all-hands deck; post 2026-02-10]
    - Level names are Dan Shapiro's via Simon Willison; descriptions reworded; credited on the slide
    - `[TODO]` Jeremy confirms level 3 is still right for October; the ladder can return in beat 3 as obot climbs
  - Same lifecycle; five steps changed hands (built, slide 19)
    - Level sidebar at level 3 (added 2026-10-06)
    - Design, build, publish: each step marked a person, the agent, or automated; merges the all-hands deck's before and after slides into one [March all-hands deck]
    - Optional (Jeremy: "possibly"); it shows the March state, and slide 22 says how it has moved since
  - +50% (built, slide 20)
    - Releases up about 50% on last year; issues and pull requests roughly doubled; "not a controlled productivity study" [diary #1]
    - `[TODO]` June figures; the Q3 deck has fresher numbers that could replace them
    - `[TODO]` flagged on the slide in orange (Jeremy, 2026-10-06: "Slide 20 needs updates/details/visual"): newer numbers, more detail, a visual
  - Plan → build → run: we invest at both ends (built, slide 21)
    - Plan and run are our own scaffolds; build is vendor coding agents plus our shared context [Q3 deck]
    - Why: both ends are company-specific process no vendor will build; the middle is commodity and improving monthly
  - "We just let the coding agent deal with it" (built, slide 22)
    - Title is Jeremy's line. Stopped building: a coding agent of our own. Maintain: one context file mapping about 40 repos, plus three skills [Q3 deck: "Coding: maintained, not abandoned"]
    - About a third of recent roadmap-repo commits co-authored by Copilot or Claude
    - Replaces the seven-step red/green gsm.agent slide
  - Deterministic tools first, agents on top (built, slide 23)
    - Framework → Tools → Skills → Bots; the first three reliable, bots still learning [Q3 deck]
    - "Agents write prose on top of evidence the tools compute, so the numbers stay right even when an agent fails"
  - Plan: agents draft; people approve (built, slide 24)
    - Six stages, Backlog to Done, with an artifact at each and a person signing off every gate [Q3 deck, gsm.roadmap README]
    - Numbers held in the notes: 13 skills, 82 requirements, 64 artifacts, 132 merged pull requests since July
  - The artifact is what a person reviews (built, slide 25)
    - Added 2026-10-05 (Jeremy: "Are we capturing the importance of artifacts in beat 2?… A slide with thumbnails of a bunch of the artifacts goes a long way"). No version of the deck had shown an artifact before
    - Ten thumbnails in a five-by-two grid: migration assessment, data requirement, design document, layout options, roadmap plan, decision record, release demo, qualification evidence, release review guide, org chart. Images in `keynote/assets/artifacts/`; pages and exclusions in `keynote/_notes/beat2-artifacts-sources.md`
    - All ten are from obot.roadmap, the side project's public hub, standing in for the team's; the slide says so in one line
    - Callout on the second click, draft: "Designing pages!" (from the outline's candidate "Design: artifacts are amazing; .md → .html")
    - `[TODO]` Jeremy: vet the ten pages; supply or approve real work artifacts if any can be shown; headline is a placeholder; keep or drop the callout (slide 24 already has two)
  - Run: one repo per study, one hub to run them (built, slide 26)
    - Study repos (20), central scheduling, intake and a 15-step guide, weekly plan alignment [Q3 deck]
    - `[TODO]` a diagram or dashboard screenshot would beat bullets; the deck's screenshots are internal
  - Run: the hub replaced spreadsheets and email (built, slide 27)
    - Before: Excel trackers, status by email, no live view. Now: merge a schedule and issues open in each study repo, a daily dashboard, an audit trail through pull requests [Q3 deck]
  - AI-written code still needs a human owner (built, slide 28)
    - The four "a person…" lines, verbatim from the 6 June deck
  - Wrap-up: "We're having great success at level 3!" (built, slide 29)
    - Jeremy's outline (2026-10-05): efficiency gains; fully compliant; but what's next … With the level sidebar at level 3
    - `[TODO]` Jeremy confirms "Fully compliant!" as a public claim about the day job, and fresher efficiency numbers
    - Replaces the bridge slide ("Open, software-shaped workflows are agent-ready"), which is in the reserves
  - Taken out of beat 2 on 2026-10-02 (still in git history)
    - Every metric is the same six steps (Input → Summarize)
    - qcthat: traceability as a byproduct — restored on 2026-10-05 as slide 15
    - What good practice looks like now (the diary #10 placeholder); a better fit for beat 4
    - The industry got ready without knowing it (never built)

3. What's next? The goal and what we built: a summer down the AI rabbit hole, with obot (about 10 min) — rebuilt 2026-10-05 as a journey, slides 30–48
  - Status: rebuilt on 2026-10-05 to Jeremy's outline of that day: "the narrative (and the slide structure) is a total mess. Let's add more structure. Frame it as a journey. 5 versions of obot created during a summer of experiments." The first build (same day) is in git history; the slides it dropped are in the deck's reserves
  - The five versions (Jeremy, 2026-10-05): "v1 was actually a local personal assistant who drafted a handoff/build for the openclaw! v2 is open claw. v2.5 was paperclip (probably just a footnote). v3 fable 5. v4 org. v5 opus 5.5."
  - Template for each version: a title slide (the version's hex, name, dates, the set-up, the level sidebar (the full ladder down the right edge with the current level boxed; replaced the small strip on 2026-10-06, Jeremy: "this isn't enough emphasis. maybe as a sidebar?"), and "what changed" to get here), then what it built, with Orange's thumbs on the second click as "What worked" and "What didn't"
  - Later the same day he split the last version: "a v5 (after retiring factory, before opus 5.5) and 5.5 (opus 5.5 work)". So: v5 = September, one requirement at a time; v5.5 = October, Opus 5.5
  - Ladder (Jeremy, 2026-10-05, re-mapped to his version numbers): v2 = 3, v3 = 4, v4 = 5, v5 and v5.5 = back to 4. v1 = 2 is the outline's guess, `[TODO]` Jeremy
  - Hexes: Jeremy's own, supplied 2026-10-05 as one sheet (kept in `keynote/_notes/inbox/`) and cut into `keynote/assets/hex/orange.png` and `obot-v1.png` to `obot-v5-5.png`, used in the journey row, the version title slides, the kickers, the timeline and the costs slide. The sheet also had three unframed cats (`orange-cutout.png`, `obot-cutout-claw.png`, `obot-cutout-shades.png`), saved and not placed. `[TODO]` full-size files (the brief asked for 1040 × 1200) would be sharper than the 240 px cuts. Before that: placeholder robot cats drawn as SVG, still in the folder as `obot-v1.svg` to `obot-v5-5.svg`. Jeremy: "A is fine for now as placeholder. I'll provide hexes later." The three options are in `keynote/_notes/obot-version-hex-options.html`
  - Hue: 4, blue. Budget: 20 slides for about 10 minutes, so still over; Jeremy cuts after seeing it
  - Facts are checked against GitHub and the local session transcripts as of 2026-10-05 (`research-digest.md`, section 8). Wording is draft unless marked as Jeremy's
  - [Orange] From Orange to obot (built, slide 30)
    - The beat's Orange transition, forcats hex as the kicker; line "The agent is named after him." [diary #2]
    - Photo: `orange-paw-on-github.jpg`. Demoted to the reserves in the journey rebuild and restored the same day (Jeremy: "Restore the section transition slide between 25 and 26")
    - `[TODO]` Jeremy checks the photo: three Rho-era GitHub usernames are on the laptop screen, a few pixels tall at slide size
  - Opener: A summer down the AI rabbit hole, with obot (built, slide 31)
    - Title from Jeremy's outline: "What's next? A summer down the AI rabbit hole (in the matrix??) with obot …"
    - `[TODO]` Jeremy's image: "Comic of orange transforming into a robot? Evolution graphic? I'll figure something out". Built as a stand-in evolution row: Orange's photo hex, then the five version hexes. It doubles as the map of the beat
    - Notes: the agent is named after the cat [diary #2]
  - What are these tools good at right now? Mad scientist edition (built, slide 32)
    - Jeremy's three lines: Open source. Not GxP (his bold). Let's experiment and have some fun …
    - Notes: why not at work, "I'm not comfortable using those highly autonomous tools for GxP use cases right now" [diary #1]
  - The goal: modernize safetyGraphics, using the gsm framework (built, slide 33)
    - A gallery of the ten original charts (Jeremy, 2026-10-05: "show a gallery of the original charts"): each one's own README screenshot as a still, with the year of its last commit in the corner. Images in `keynote/assets/legacy/`; all ten repositories are MIT-licensed
    - One line under it: 10 original charts, 25,400 lines of JavaScript, all on D3 v3. Measured 2026-10-05 from the public repositories (730 files; last commits 2019 to 2022; today safety.viz is on Chart.js 4). The earlier three-figure version of the slide is in the reserves
    - Jeremy's draft said "sitting idle for 5+ years": true of eight of the ten; the newest last commit is February 2022
  - obot v1 · early May: a personal assistant (built, slide 34)
    - One slide; there is no public account of v1. What the record has: gsm.safety's first commit, 9 May 2026, is authored by "Orange" ("Initial gsm.safety design")
    - `[TODO]` Jeremy: which tool it was, what worked, what didn't, and its ladder level
  - obot v2 · May to June: OpenClaw (built, slides 35–36)
    - Title slide: a clean-room laptop with none of his credentials, Telegram, its own GitHub account [diary #2]. Level 3
    - What I built: the gsm.safety proof of concept (the old charts run from gsm workflows), a public hub and daily diary, 266 commits, 18 pull requests and 2 releases by 10 June [diary #2]
    - What worked: "Real work, by text". What didn't: "Autonomy" ("51% fun and 49% frustrating"; "trying (and mostly failing)… to get Obot to be more autonomous") [diary #2]
    - Footnote in the notes: v2.5, a PM, a developer and a tester with Paperclip as the control plane, "never shipped" [diary #6]
  - obot v3 · July: Claude Code, on Fable 5 (built, slides 37–39)
    - Title slide: a plan, a playbook and an identity; "a session starts when I sit down". What changed: Fable 5 came out [diary #6]. Level 4
    - What I built: "The first renderer took a few weeks; the next six took a weekend." Four-step release timeline, with 1.0 billion tokens, $1,273 at API prices, $200 a month paid, about 10 hours [diary #5, #6]
    - What worked: "Porting old code". What didn't: "Working without me"
    - What I built next: Papers → prompts → prototypes [diary #7]. What worked: "Translating research into software" (Jeremy's wording, 2026-10-05)
  - obot v4 · August to 10 September: the organisation (built, slides 40–42)
    - Title slide: "the agent stopped being a worker and became an organisation", on Opus 5. What changed: "seeing how far a fully autonomous session can get without me in the loop at all" [diary #7, #8]. Level 5
    - What I built: four roles and a timer script, the diary #8 org chart redrawn
    - Quietly wrong: "Nine cases in one night of something reporting success while having done nothing." [diary #8, Obot's words]
    - What worked: "The structure held". What didn't: "Knowing when it has failed"
  - obot v5 · September: one requirement at a time (built, slides 43–45)
    - Title slide: he retired the organisation and kept a tree of issues; one session per requirement, each with a definition of done. What changed: "On 10 September I shut v4 down. 475 files of scaffolding went; seven stayed." Back to level 4
    - `[TODO]` Jeremy's own account of 10 September, and the "mixed feelings" from diary #8; both are in this slide's notes
    - The scaffold that stayed: "I review releases and answer questions" (his sentence); objective → requirements → tasks → release candidate → release; written down on 11 September as three short standards [hub NEWS v0.4]
    - What I built, 10 to 30 September, checked against GitHub: the scaffold rewritten (obot.agent v0.5.0 and obot.roadmap v0.4, both 11 September); gsm.safety v1.2.0 as a release candidate (38 pull requests in three days, the FDA's 22 figures specified, still waiting on review); the Patient Journey Explorer with AI-drafted narratives (merged 18 September)
    - What worked: "A definition of done". What didn't: "No chart releases" (draft wording)
    - Where the record differs from Jeremy's recollection ("some gsm.viz releases + experiments (open.csr, patient profile, etc)"): no safety.viz release between 15 August and 2 October; open.csr's last activity was 2 September, under v4; the participant profile shipped in July. After 18 September nothing merged in the chart repositories until 1 October
    - Models: Fable 5.1 and Opus 5 in the local logs; most sessions ran in the cloud and left no local log
  - obot v5.5 · October: Opus 5.5 (built, slides 46–47)
    - Title slide: the same tree of issues, one orchestrator and one brief. What changed: "The model got better. Orchestration now works from a plain brief." Level 4
    - Opus 5.5 was released on 22 September [Willison, via the beat 4 timeline sources]; it first appears in the local session logs on 1 October
    - What I built: one orchestrator, one brief, one weekend. In: a brief of about 800 words, about 22 messages. Out: 52 agents (40 reviewers), 3.9 billion tokens, about $1,640 at API prices, six releases [digest 8c]
    - What worked: "Reviewing its own work". What didn't: "Still waits on me" is a placeholder, `[TODO]` Jeremy
    - `[TODO]` Jeremy: "over 1,000 subagents" and "half my weekly allotment" are not what the transcript shows (52 agents; 21% on the Friday night)
    - Notes: the safety.viz demo app (v1.8.0) was also built on Opus 5.5, in two ordinary sessions on 2 October
  - The payoff: the safety.viz demo (built, slide 48)
    - Jeremy's outline: "What I built: gsm.viz demo (this is the payoff)". Read as the safety.viz demo app; `[TODO]` Jeremy confirms
    - Your own files, mapped columns, nothing uploaded, one HTML file that runs offline [safety.viz v1.8.0 and v1.9.1 release notes]
    - `[TODO]` Jeremy: live or recorded, which files, and a closing line that hands to beat 4

3.5. How we built it — slides 49–54, regrouped late on 2026-10-05
  - Jeremy (2026-10-05): "3.5 = how we built it (cost/sdlc/treemaps/timeline overview)". These slides were drafted earlier the same day under beat 4's "how do we do this in GxP?"
  - [Orange] How we built it (built, slide 49; draft wording)
    - Photo: `orange-supervising-laptop.jpg` (Jeremy is in it); alternative `orange-spreadsheet-side-eye.jpg`. Line: "What it cost, how it was run, and how fast it moved."
    - `[TODO]` Jeremy: whether 3.5 wants its own Orange transition or runs straight on from the demo
  - Costs (built, slide 50; draft wording): "$11,750 at API prices. I paid $200 a month." Bars by obot version (v3 $3,330; v4 $6,020 or more; v5 $450 or more; v5.5 $1,955 so far), with the uncertain parts hatched; cards for what he paid, the price per million tokens ($0.97 in July, $0.41 in October) and the two long weekends. Sources in `keynote/_notes/beat4-spending-sources.md`
    - The numbers come from the hub's usage data brought up to 6 October in obot.roadmap#370, merged on 5 October; the live analytics page was checked after the deploy and reads $11,756.53 through 2026-10-06
    - `[TODO]` Jeremy: "$200 a month" is unconfirmed after 6 September; the July weekend's $1,273 (diary #6) is mostly not in the hub data, which holds $146 for 9 to 12 July, so the true total is probably about $1,100 higher; refresh the October figures before the talk
  - The SDLC: quality (built, slide 51; kicker "SDLC · quality"; draft wording): "A lot of tests, and still not GxP". Three columns: Agents test (2,559 tests in safety.viz, up from 343 in July); Agents review (40 of 52 agents on the October weekend were reviewers; one caught a bad p-value, safety.viz#188); A person signs (0 qualified releases; a gsm.safety candidate open since 11 September). Line under: "Tests and reviews are cheap now. The signature is not."
    - `[TODO]` Jeremy: whether to say "0 qualified releases" that flatly; the gsm.safety candidate (pull request 88) shows "review required" on GitHub with 25 comment reviews under his account and no approval, while the hub's last note says approved and waiting on a ruleset edit; whether his own unfinished review belongs on a slide. Alternative third column: the organisation-chart claim check (97 checked, 68 confirmed)
    - This slide is where "review, not writing, is the bottleneck" [diary #9] can be said
    - `[TODO]` Jeremy: his list for 3.5 does not name quality; it is placed here as the SDLC slide. Say if it belongs in "what we learned" instead
  - The SDLC: the roadmap: two slides (Jeremy, 2026-10-05: "Both, as two slides"), a treemap of the whole roadmap and a node-link tree of one objective, coloured by status, each a date-stamped snapshot embedded in the deck. No hub page for now ("No need for a day of work on the website right now"). Built, slides 52 and 53 (draft wording): "The whole roadmap is one tree of GitHub issues" (treemap: 10 objectives, 108 requirements, 155 tasks; 44 retired requirements and 25 with no objective not shown) and "An objective becomes requirements, then tasks" (Biomarker charts: 14 requirements, 44 tasks, one bead per task). Stamped "as of 5 October 2026". Refresh with `keynote/_notes/roadmap-tree/` (fetch.mjs, then build.mjs --inject ../../slides.html); sources in beat4-roadmap-tree-sources.md. The five options he chose from are in a hub worktree, unpublished
    - `[TODO]` Jeremy: two things on the treemap could mislead and are only in the notes. Six pale backlog boxes are full of done tasks (labels not kept up), and open.csr looks untouched because its three in-review requirements are not linked to the objective. Four small objectives are drawn larger than true size so their names fit
    - `[TODO]` Refresh both pictures the week of the talk so the date stamp is current
  - The timeline: how fast it is moving (built, slide 54; draft wording throughout)
    - Jeremy (2026-10-05): the five versions set up "a slide in beat 4 where we can emphasize just how fast capabilities are improving… roughly 1 year after Opus 4.5 changed the game and made agents viable. Maybe show a timeline of how the major innovations/model releases line up against my 5 agent experiments. Mention all the things I *didn't* experiment with… Takeaway for pharma is that we just can't keep up and as a result the gap between capabilities and adoption is rapidly widening."
    - Also out of scope, and worth saying (Jeremy, 2026-10-05): open-source models. All five obot versions ran on closed, hosted models
    - Reference: https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/
    - Built 2026-10-05 by a worker session as the first slide of beat 4, then moved the same day to close beat 3 after the demo (Jeremy: "pull the timeline slide to the end of beat 3, I think it works well as a recap/closer after the demo"). Draft headline "Eleven months, and I could not keep up"; a month ruler from November 2025 to October 2026 with eight releases above and the six obot versions below; a "did not try" card (MCP, open-weight models, Muse, Jev, Dots); draft takeaway "We cannot keep up, so the gap between capability and adoption keeps widening."
    - Every date is sourced in `keynote/_notes/beat4-capability-timeline-sources.md`; the standalone draft is `beat4-capability-timeline-draft.html`
    - `[TODO]` Jeremy: "eleven months" or "a year" (Opus 4.5 was 24 November 2025, 331 days before the talk); whether "did not try MCP" is right; whether GPT-5.1 shares the credit for the November turn, as Willison has it; v5's label says Fable 5.1 though it also ran on Opus 5
    - Moved again late on 2026-10-05: it now closes part 3.5 (he listed it last, and its takeaway hands to "what we learned")

4. What we learned (about 7 min, suggested) — slides 55–59, regrouped late on 2026-10-05
  - Jeremy (2026-10-05): "4 = what we learned (good/bad/mixed feelings/closing)"
  - [Orange] What we learned (built, slide 55; draft wording)
    - Photo: `orange-looking-up-agenda.jpg`, cropped so the printed agenda (it has people's names on it) is out of frame. Line: "What agents are good at, what they are not, and how I feel about it."
  - What are agents good at now? (built, slide 56; draft wording): "What are agents good at now?", Orange's thumbs-up answers gathered as eight cards. Left column, the opening and the team: Teaching me things, Writing code, Drafting documents, Designing pages. Right column, obot: Porting old code, Translating research into software, Running experiments, Reviewing its own work
    - `[TODO]` Jeremy: "Running experiments" is his steer but is not a callout in the main deck; left out as verdicts on a way of working: Real work by text, The structure held, A definition of done
  - What are agents bad at now? (built, slide 57; draft wording): "What are agents bad at now?", five cards. Setting priorities; Working without me (v2, v3 and v5.5 folded into one); Knowing when it has failed; Being concise; Remembering. The dashed bridge cell ("So how do we do this in GxP?") was removed when the beats were regrouped
    - `[TODO]` Jeremy: Being concise and Remembering are from his close-out list and are not callouts anywhere yet; "No chart releases" (v5) is left out
  - Mixed feelings (placeholder, slide 58): `[TODO]` Jeremy only. The placeholder quotes what he has said in public: "I've honestly got some mixed feelings about the whole thing ... but this is getting long, so I'll talk about that more in the keynote :)" and "For now, I'll just say it's ... weird. Working on open source projects feels very different than it did a year ago." [diary #8]; "51% fun and 49% frustrating" [diary #2]
  - Closing (placeholder, slide 59): Jeremy is having an image model build it (2026-10-05). The earlier list has the question one last time and Orange's thank-you with links and a QR code
  - Not in this structure: best practices (in his first structure of 5 October, not drafted); the summer in one number; the bottleneck moved (review); the execution gap; open source is the path; what is next; if the models were frozen today
  - His first structure of 2026-10-05, superseded the same day: Proposed structure (Jeremy, 2026-10-05), not yet reconciled with the earlier list below: "revisit our answers to 'What are these tools good at' (slide 1) and not good at (s2) and then discuss 'how do we do this in GxP?' velocity/timeline (s3, drafted), costs (s4) Quality (s5), SDLC/Roadmap (s6, treemap visual above), best practices (s7, orchestration, agents). Then closing."
  - Earlier list (draft 2, 2026-10-01), kept until the two are reconciled
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

A recurring callout in the bottom-right corner: Orange's face in an amber hex with a thumbs-up, the question in small capitals, the answer in a speech bubble (design B, chosen 2026-10-02). The close in beat 4 gathers the same answers into one list. From 2026-10-06 the photo hexes are Jeremy's drawn ones: `keynote/assets/hex/orange-thumbs-up.png` and `orange-thumbs-down.png` (the emoji badge is gone, since the art carries the thumb). A third, `orange-question.png` (Orange thinking, with a question mark), is saved and not placed.

- Beats 1 and 2 ("What are agents good at now?" / "What are agents bad at now?")
  - Teaching me things — slide 6
  - Writing code — slide 22
  - Drafting documents, and Setting priorities (thumbs-down) — slide 24
  - Designing pages (draft wording) — slide 25, the artifacts
- Beat 3 uses the same two callouts as each version's verdict, labelled "What worked" and "What didn't" (Jeremy's outline, 2026-10-05). All wording is draft
  - v2, slide 36: Real work, by text / Autonomy
  - v3, slide 38: Porting old code / Working without me; slide 39: Translating research into software (thumbs-up only, Jeremy's wording)
  - v4, slide 42: The structure held / Knowing when it has failed
  - v5, slide 45: A definition of done / No chart releases
  - v5.5, slide 47: Reviewing its own work / Still waits on me (placeholder)
- Beat 4 gathers the answers: slide 56 (good at) and slide 57 (bad at)
- Candidates from the close-out list, not placed in a callout
  - Good at: busy work (making slides, meeting minutes); design (artifacts, .md → .html); syntax (git); catching real errors, including its own; running experiments
  - Bad at: being concise; remembering

## Reserves

Since 2026-10-05, a slide that leaves the main deck moves to the reserves section near the end of `slides.html` instead of being deleted (Jeremy: "start saving any discarded slides in a reserves section in the deck. Just add a note about when it was demoted"). A reserve slide carries `data-reserve="date"`, shows a "Reserve · demoted …" tag in place of its number, is left out of the slide count, and says in its notes when and why it was demoted.

- Demoted 2026-10-05
  - (Restored the same day: From Orange to obot, the paw-on-GitHub transition, now slide 27)
  - The bridge, "Open, software-shaped workflows are agent-ready" (was the last slide of beat 2)
  - The goal, as four lines (build, climb, experiment, have fun)
  - The disclaimer, "This is really really not GxP (but there are A LOT of tests included …)"
  - Keep, modernize, borrow
  - obot v3: a plan, a playbook and an identity
  - "Is it validated?" (with the callout "Catching real errors")
  - 10 September: I shut it down (the placeholder for Jeremy's account)
  - Agents are great at experiments (with the callout "Running experiments!")
  - What it took (costs and GitHub activity; a candidate for beat 4)
  - Where it stands today
  - The goal as three figures (10 / 25,400 / D3 v3), replaced by the gallery of original charts

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
- Beat 3 after the journey rebuild: Jeremy's opening image (his hexes arrived on 5 October); what v1 was; each version's "what worked" and "what didn't" in his words (v5's thumbs-down is a placeholder); his account of 10 September and the "mixed feelings"; which slides to cut (20 for about 10 minutes); whether "What it took" comes back in beat 4
- Stale in beat 4 after 5 October, left for Jeremy since beat 4 is his to revise:
  - "The summer in one number" stops at 6 September. Since then: seven more releases and two new packages (digest 8a)
  - "What is next" asks how much of the unbuilt mid-October plan to promise. The app part is built and released; the 22 FDA figures are still none drawn
  - "Left out of draft 2" calls "your own files, nothing leaving the browser" the unbuilt app plan. It shipped in safety.viz v1.8.0
