# Research digest — R/Pharma 2026 keynote

Compiled 2026-10-01 from three sources, to support drafting the slide outline for
`keynote/slides.html`. Read-only research; nothing else was changed.

**Path legend** (every citation below uses one of these roots):

- `[blog]` = `/home/user/jwildfire.github.io`
- `[hub]` = `/home/user/jwildfire/obot.roadmap` (local clone; last commit `f0f7a5c`, 2026-09-14 — anything after that is not visible here)
- `[deck]` = `/home/user/jwildfire/RPharma2026-AIKeynote` (cloned 2026-10-01, all branches and `refs/pull/*` fetched)
- `[gs]` = `/home/user/gsm.safety` (this session's repo, used only for one release fact)

GitHub issue bodies (#10, #22, #72, #74) could **not** be read: this session's GitHub access
covers only `gsm.safety` and `jwildfire.github.io`. Everything about those issues below comes
from how local hub files quote or describe them.

---

## 1. Talk framing

**Title (current).** "Building Open-Source Clinical Trial Tools with Agentic AI" — the `<title>`
and headline of `[blog]/keynote/index.html` ("R/Pharma 2026 · Keynote · October").

**Earlier titles, in order:**

1. "Agentic AI for Clinical Trial Operations: What Open Source Can Do Next", the deck draft of 2026-06-06 (`[deck]/outline.md`, `[deck]/index.html`).
2. "AI in the Loop: How Agentic Workflows Are Reshaping Clinical Trial Analytics", the submitted abstract, reproduced in `[blog]/_posts/2026-06-10-rpharma-keynote-developer-diary.md`.
3. On 2026-06-10 the deck repo was retitled "to focus on open-source and agentic AI" (`[deck]` commit `5a5ef2f`, PR #4).

**Submitted abstract (summary)** (`[blog]/_posts/2026-06-10-…md`, collapsed `<details>`):
- Pharma's regulated setting needs "scaffolding that makes AI behavior repeatable, auditable, and governed by the humans who remain responsible for every line of code."
- Its stated shape is landscape (models / scaffolding / context, and "AI in the loop" with approval gates), then concrete gsm work, then a look forward. The concrete part names `{gsm.agent}` (red-green TDD, from a failing test to a merged PR), `{gsm.roadmap}` (AI-assisted requirement decomposition) and `{qcthat}` (traceability matrices). The forward look covers clinical operations, CDISC data generation and CSR creation with pharmaverse.
- **Note:** the talk drifted a long way from this abstract. The diary's evidence base is obot / safety.viz / gsm.safety, not gsm.agent / gsm.roadmap. Jeremy says so himself: "That's the official version. Honestly, the reality is messier" (same file).

**The recurring question:** "what can we do with these tools right now? How can we use them to create medicines faster and more efficiently?" (`[blog]/_posts/2026-06-10-…md`). It is restated as "What are these tools good at right now? How much can they do autonomously?" (`2026-07-13-obot-v3-billion-tokens.md`) and answered "Quite a lot" (`2026-09-06-not-a-capabilities-problem.md`).

**Stated goals for the keynote:**
- Work in public, try things out, and "talk about what I learn in the keynote" (`2026-06-10-…md`).
- Find out whether modernizing safetyGraphics still "needed a team and a budget I no longer have — … with AI agents, I'm honestly not sure that's true anymore. Figuring out whether it is, is what this whole keynote experiment is about" (`2026-06-16-reintroducing-safetygraphics.md`).
- The October goal as it stood on 2026-07-10: "go way beyond the safetyGraphics updates — finish that lane in July … leaving August–September to build **open.gismo**, a full end-to-end environment for safety, RBQM, 'and anything else'" (`[hub]/diary/2026-07-10.md`, "Planning: the keynote arc").
- The goal as of 2026-09-10: everything ready by mid-October "and ready to go live". The open.gismo arc "parks for the talk" and the app becomes safety.viz-native (`[hub]/reports/goal-sessions-plan-2026-09-10/index.html`).
- Jeremy has saved some material for the stage: "I've honestly got some mixed feelings about the whole thing … I'll talk about that more in the keynote" (`2026-08-20-obot-v4-second-interview.md`).

**Date / venue:**
- The talk is at R/Pharma (rinpharma.com) in **October 2026** (`[blog]/keynote/index.html`; `[hub]/diary/2026-07-10.md` "keynote is date-locked"). "Mid-October" appears in `[hub]/reports/goal-sessions-plan-2026-09-10/index.html`, which assumes everything is "ready by **Friday 16 October**; the exact talk date pins the last week".
- **No exact date, time slot, length or venue/format appears in any source.** The 06-06 deck draft targeted "~40 minutes" (`[deck]/outline.md`).
- The hub flagged a September-vs-October conflict: the goal #72 body reportedly said September (`[hub]/reports/decisions/2026-08-31-september-plan/README.md`, question S1). It was still "Awaiting his answers" in `[hub]/reports/decisions/README.md` at the last local commit.

**Keynote landing page** (`[blog]/keynote/index.html`):
- Copy: "Jeremy Wildfire is preparing his R/Pharma keynote in the open. The developer diary … is the live record — experiments, lessons, and honest dead ends, posted right up until the talk."
- Lists **9 entries · more before October**, newest first, each with a "Part N" label. Footer: "Working in public — every entry carries its own AI collaboration note."
- Links to OpenRBQM and R/Pharma.
- The page uses its own orange accent (`--accent: #f97316`). Orange is "the R/Pharma keynote's colour" by decision (`[hub]/site/roadmap-changelog.json`, 2026-09-12 entry).

**Asset note:** `[hub]/site/assets/obot-keynote.css` (136 lines) is the canonical "shared keynote stylesheet". Despite the name, it is the light theme the public program sites wear (paper `#fafaf8`, graphite ink, plum links, Instrument Serif/Sans + IBM Plex Mono, honeycomb strip). Orange survives in it only as `--event`, the keynote colour. It is a site theme, not a deck theme.

---

## 2. Blog series

**Permalinks.** `[blog]/_config.yml` sets no `permalink`, so Jekyll's default `date` style applies: `/:categories/:year/:month/:day/:title.html`. Posts carry no categories, so URLs are `/YYYY/MM/DD/slug.html`. The links in `[blog]/keynote/index.html` and the absolute links in diary #9 confirm this.

### 2a. Pre-series AI posts (context, Feb–Apr 2026)

| Date | Title | URL path | Key point for the talk |
|---|---|---|---|
| 2026-02-10 | Five Levels of AI-Assisted Development | `/2026/02/10/five-levels-ai-development.html` | Shapiro/Willison levels 0–5 (spicy autocomplete → dark factory). "I'm currently getting comfortable at level 3." This is a ready-made **ladder slide**: Feb = L3, v3 = L4-ish, v4 = an attempt at L5, Sept = back to L4 (see §5). |
| 2026-02-16 | Something Big is Happening | `/2026/02/16/something-big.html` | Quotes Shumer's timeline (2022 arithmetic → Feb 2026 models). "When given proper context, the models are now *excellent* coders." |
| 2026-02-25 | Agentic Pattern: First Run the Tests | `/2026/02/25/agentic-pattern-first-run-the-tests.html` | Willison: "Automated tests are no longer optional when working with coding agents." "Small prompt, big leverage." |
| 2026-04-06 | AI Reading List: April 2026 | `/2026/04/06/ai-reading-list-april-2026.html` | "AI is a force multiplier for implementation but a dangerous substitute for design" (syntaqlite retrospective). |
| 2026-04-19 | The Capital Might Be Misaligned, But The Plane is Probably Fine | `/2026/04/19/bubble_maybe.html` *(the file has **no front matter**, so Jekyll may copy it rather than render it; check before linking)* | "There's at least 10x, maybe less than 1000x, [more software] in clinical trials." "There's no way in hell I can manage 100 agents now — especially in my highly regulated environment… But it doesn't feel too crazy that it will be doable in a year or two." Calls for an "Agentic Technical PM". |
| 2026-04-24 | AI Reading List: April 24, 2026 | `/2026/04/24/ai-reading-list-april-24-2026.html` | "Your sprints still matter more than your agents" — requirements, acceptance criteria, measurement. "AI is an amplifier for both good and bad habits." |

Files: `[blog]/_posts/2026-02-10-five-levels-ai-development.md`, `2026-02-16-something-big.md`,
`2026-02-25-agentic-pattern-first-run-the-tests.md`, `2026-04-06-ai-reading-list-april-2026.md`,
`2026-04-19-bubble_maybe.md`, `2026-04-24-ai-reading-list-april-24-2026.md`.

### 2b. The R/Pharma developer diary (series "R/Pharma 2026 developer diary", parts 1–9)

**#1 — 2026-06-10 — "What Can We Actually Do With AI Agents Right Now?"**
`/2026/06/10/rpharma-keynote-developer-diary.html` · `[blog]/_posts/2026-06-10-rpharma-keynote-developer-diary.md`
- Kicks off the series. The submitted abstract is included and openly called out of date ("Fable 5 came out today, so who knows what things will look like in October").
- Today = "AI in the loop": the team uses GitHub Copilot on `{gsm.core}`, and "Humans own the process and all deliverables." The team started adopting agentic AI in January 2026 and has been formalizing since.
- What's next is the open question of autonomous "agentic workers" (OpenClaw, "country of geniuses in a datacenter"). "I'm not comfortable using those highly autonomous tools for GxP use cases right now, but the capabilities are coming."
- Numbers: team release rate is up ~50% year on year, and issues and PRs have roughly doubled ("not a controlled productivity study").
- Quotable: "My plan has changed at least three times since I found out about the keynote last month."

**#2 — 2026-06-12 — "Introducing Obot"**
`/2026/06/12/setting-up-obot-openclaw.html` · `[blog]/_posts/2026-06-12-setting-up-obot-openclaw.md`
- An interview over Telegram with Obot, an OpenClaw agent on a clean-room MacBook, GitHub identity `obot-claw`.
- First real proof: the gsm.safety POC combining safetyGraphics widgets with gsm workflows (obot-claw/gsm.safety PR #26).
- Security: "The hard part is not access. It is making access auditable." Jeremy's correction: the real guardrail is that the laptop has none of his credentials, so the "blast radius" is narrow.
- Metrics as of 2026-06-10: **266 commits, 18 PRs merged, 11,798 tracked lines, 2 releases.**
- Quotable: "51% fun and 49% frustrating" and "slightly less productive using Obot than working directly in Claude Code". The name comes from Orange the cat; there is a photo at `[blog]/assets/img/orange-obot.jpg`.

**#3 — 2026-06-16 — "Re-Introducing safetyGraphics"**
`/2026/06/16/reintroducing-safetygraphics.html` · `[blog]/_posts/2026-06-16-reintroducing-safetygraphics.md`
- Career prehistory: SAS in grad school, then R at Rho, then D3/Protovis after seeing NYT interactives ("Why can't I do this for work?"). The Rho Graphics Group came next, then the ASA-DIA Safety Working Group, five years of clinicians and data scientists working together, and the eDISH hep explorer and its clinical workflow.
- "A handful of webpages is more useful and usable than a 200-page PDF." What they didn't do: "change the industry standard for how people monitor safety."
- Acknowledgements up front (footnotes name Alexa, Herman Mitchell, Agustin Calatroni, Jim Buchanan, Susan Mayo, Xiao Ni, Melvin Munsaka, Frank Harrell, Posit folks, and others).
- Assets: `[blog]/assets/img/fig1_NYT.png`, `fig2_aeexplorer.gif`, `fig3_hepexplorer.gif`. There is also a "Harry Potter GIF" reference for the wall of numbers.

**#4 — 2026-07-02 — "safetyGraphics ❤️ gsm"**
`/2026/07/02/safetygraphics-heart-gsm.html` · `[blog]/_posts/2026-07-02-safetygraphics-heart-gsm.md`
- The v2 plan has three parts. **Keep** expert workflows, interactivity, openness and practical charts. **Modernize** (D3 v3 → modern JS, data contracts, tests, "make rendered artifacts easier for agents and humans to validate"). **Borrow from gsm** (workr, qcthat, GxP from day one).
- Stretch goal: bridge monitoring and reporting. "Why can't tools for monitoring a study translate directly into tools for reporting after database lock?" The aim is static CSR-style PDF outputs alongside interactive HTML.
- Quotable: "Instead of inventing a new quality framework, we plug the safety graphics into a quality framework that already exists." "If an agent is going to help maintain these tools, the outputs need to be checkable — by a person, by a test suite, and by another agent."

**#5 — 2026-07-12 — "Introducing safety.viz"**
`/2026/07/12/introducing-safety-viz.html` · `[blog]/_posts/2026-07-12-introducing-safety-viz.md`
- safety.viz v1.0 rebuilds 7 of the 10 original renderers on Chart.js with JSON-Schema contracts (histogram, outlier explorer, results over time, shift, delta-delta, AE timelines, hep explorer/eDISH).
- Quality: "Is it validated?" used to get "Not really. It's exploratory". Now there are **249 unit tests + 94 browser tests** keyed to requirement IDs, published as evidence reports.
- Release timeline (a natural **timeline slide**): v0.1.0 (Jul 11, 8am, after weeks of work), v1.0.0 (Jul 11, 10:30pm, +5 renderers in one session), v1.1.0 (11:50pm, ~1 hour, pharmaverseadam data), v1.2.0 (Jul 12, 10pm, hep-explorer plus the clinical guide ported from PDF).
- Quotable: "The first renderer took a few weeks; the next six took a weekend." Assets: `[blog]/assets/img/safety-viz-gallery.png`, `safety-viz-evidence.png`.

**#6 — 2026-07-13 — "Obot v3: How I Used a Billion Tokens in a Weekend"**
`/2026/07/13/obot-v3-billion-tokens.html` · `[blog]/_posts/2026-07-13-obot-v3-billion-tokens.md`
- v2/"2.5" (OpenClaw heartbeats, PM/Dev/Test agents, Paperclip control plane) was abandoned. v3 = Claude Code + `obot.roadmap` ("the plan and the memory") + `obot.agent` ("the playbook") + the `obotclaw[bot]` GitHub App ("the identity").
- Session framework: `/session-init` → note/update/todo → `/session-dashboard` → `/session-wrapup`. Roles: 😺🤖 session manager, 👯🤖 sibling, ⚡️🤖 autonomous ultracode worker. One weekend = 5 sessions, 16 named agents and dozens of subagents.
- The hep-explorer prompt "/spawn an ultracode session to add the safetyGraphics/hep-explorer to safety.viz" ran ~2 hours, ~50M tokens, ~$55. The guide port was 44M tokens / $33.
- **Numbers slide:** **1.0B tokens, 5,749 API calls, 97% cache reads, $1,273 API-equivalent** (Fable 5 $971, Opus 4.8 $299, peak Saturday $662). **Paid: $200/mo Claude Max, marginal $0.** About 10 hours of Jeremy's time.
- Quotable: "delivering a 6-month project for less than $2k seems like an amazing deal" (estimate: 6 months × 3 people without AI). "To be clear, this isn't ready for production use, but I'm not sure it's that far off." Assets: `[blog]/assets/img/hep-explorer-edish.png`, `hep-explorer-guide.png`.

**#7 — 2026-07-17 — "Papers → Prompts → Prototypes"**
`/2026/07/17/papers-prompts-prototypes.html` · `[blog]/_posts/2026-07-17-papers-prompts-prototypes.md`
- Jim Buchanan (the original clinical lead) sent references after a demo, and two prototypes were working the same evening.
- Hep composite view, from Tesfaldet et al., *Drug Safety* 2024, plus the FDA's MIT-licensed reference code: one Opus 4.8 session, **176M tokens, ~$143**.
- QT Safety Explorer, from the CSRC qtexplorer prototype and the ICH E14 draft clinical workflow: about four hours, **308M tokens, ~$241**. It covers central tendency, outlier scatter and categorical views on pharmaverse ADEG, plus a guide. It is marked **Experimental**, with six Phase 2 items (hub #37).
- Quotable: "Provided with robust clinical workflows, it independently implemented prototypes bringing hepatotoxicity monitoring closer to current best practice and adding the first tool for cardiovascular safety in one evening." Assets: `[blog]/assets/img/hep-explorer-composite.gif`, `qt-explorer-demo.gif`.
- Its closing line, "Up next: seeing how far a fully autonomous session can get without me in the loop at all", sets up #8.

**#8 — 2026-08-20 — "A Second Interview with Obot"**
`/2026/08/20/obot-v4-second-interview.html` · `[blog]/_posts/2026-08-20-obot-v4-second-interview.md`
- v4 = "the agent stopped being a worker and became an organisation". The roles are a concierge, an operating officer, a fleet manager (later "admiral") and short-lived workers. **A 5-minute timer script, which is not an agent, is the load-bearing watcher.** It includes an org-chart diagram; the full version is at `[hub]/reports/org-chart/`.
- Charts: **13 renderers**, six releases since mid-July (v1.4.0 QT, v1.5.0 profile + DILI Sankey/waterfall, v1.6.0 nephrotoxicity + study-day playback, v1.7.0 time-to-event, Experimental). gsm.safety v1.1.0 shipped 17 Aug. open.gismo v0.2.0 is an RC: local-first, "three commands", and "Clinical data mostly cannot leave the environment it lives in."
- "Quietly wrong": "Nine cases in one night of something reporting success while having done nothing. A blocker that set an evening's agenda and turned out never to have existed. Nine hours of work sitting on disk that no check we had could see."
- **Cost:** "$7,000 of usage across twenty-four active days", API-equivalent and not out of pocket, and the weekly allowance ran out in about 3 days.
- Quotable: "never let an agent be the sole watcher of an agent. Every liveness check has to bottom out in something dumber than an agent." Also: "Working on open source projects feels very different than it did a year ago."

**#9 — 2026-09-06 — "It's Not a Capabilities Problem Anymore"**
`/2026/09/06/not-a-capabilities-problem.html` · `[blog]/_posts/2026-09-06-not-a-capabilities-problem.md`
- Thesis: "Using agentic AI as a cornerstone of clinical development is no longer about capabilities — it's about execution. The models are capable."
- Execution gap: AI standards move fast (MCP Nov 2024 → Linux Foundation; Agent Skills open standard Dec 2025), while GxP moves slowly by design (the FDA AI guidance has been in draft since Jan 2025). The precompetitive base is OpenRBQM, safetyGraphics, pharmaverse, the R Consortium submissions WG, the R Validation Hub and CDISC. Version control and semver are "arguably a prerequisite for using agentic AI at all", and agents are "the best change-management tool we have".
- **Numbers slide:** "roughly **315,000 lines of source across 367 pull requests and 23 releases in 12 repositories** — from one person and a few agents, working in spare time". The figure is about 4M counting generated artifacts; the method is in a footnote. "Review, not writing, is the bottleneck" (Osmani, Milestone).
- Amodei: "A compressed century of biology is only possible with a compressed century of trials."
- Quotable: "if the frontier models were frozen today, clinical trials would still be completely different in five years."
- **Promised next entry (not yet published):** "GxP best practices for agentic engineering: validation as code, generated documentation and traceability, human gates, and what I learned about monitoring agents the hard way. Then, October."

### 2c. Unpublished draft

**`[blog]/_drafts/ultracode-effort-safety-viz-v1.md`** — "R/Pharma Diary #7 — Ultracode: Five Renderers Before Lunch" (dated 2026-07-11, never published; slot #7 went to "Papers → Prompts → Prototypes")
- On 11 July, from 9:17 to ~11:40, the RC PR went from 1 chart to 6. That produced **247 unit + 92 Playwright tests**, from "about six messages" by Jeremy.
- Scripted workflow vs improvising agent: the journaled workflow resumed after the session-limit outage, but the website agent lost its design catalog ("transcript-only deliverables die with the session. Commit working notes").
- Other lessons: gates before fan-out (the binning bug "reproduced from primary sources" by executing 2017 d3-v3 code) and model allocation like "picking staff" (Fable for judgment, Opus 4.8 for template work). Four Opus builders independently made the same one-line fix. The permission classifier blocked the merge: "I'll take a guardrail that's occasionally overcautious over one that's occasionally absent."
- Bill: ~2.37M reported subagent tokens, $0 marginal, "low hundreds" API-equivalent.
- Quotable for the talk: "Nothing broke because a model wasn't smart enough… The bottleneck still isn't intelligence. It's plumbing." Its "What This Means for October" section is effectively keynote prose.

---

## 3. Roadmap (obot.roadmap hub)

### 3a. Keynote issue lineage

| Item | What it is | Source |
|---|---|---|
| **P006** | "R/Pharma 2026 AI Keynote deck". Created 2026-05-24 in the obot-claw era with the repo `obot-claw/RPharma2026-AIKeynote` and the page `/projects/006/overview/` on the old obot-claw site (not in this clone). It sat at "5%" for weeks with the same next step repeated: "Draft the P006 keynote story spine and demo fallback plan" | `[hub]/diary/2026-05-24.md` through `2026-06-04.md` |
| D1 (2026-07-02) | Hub-consolidation decision: P006 becomes a backlog Requirement on the hub "because the keynote draws on this work" | `[hub]/requirements/design/7_design.html`; `[hub]/diary/2026-07-02.md` |
| **hub #10** | "Requirement: R/Pharma 2026 AI keynote deck", milestone 2026q4 ("date-locked to October"). It was still a stub on 07-21: "no overview, no data requirement, no design, no tasks" (Gap G2) | `[hub]/diary/2026-07-10.md`; `[hub]/reports/executive-overview-2026-07-21/index.html` |
| **hub #22** | The developer-diary blog series requirement (filed 2026-07-08): "outline the remaining posts through the October keynote (the outline becomes the Design section)"; the posts are "source material for the deck" | `[hub]/diary/2026-07-08.md`; `[hub]/reports/ideas-triage-v2-dry-run-2026-07-24/index.html` |
| **hub #72** | "Goal: R/Pharma 2026 keynote deck", promoted from Ideas discussion #52 ("Make a new goal around creating my keynote deck") on 07-24. It had one member (#74) and was "under-linked, not under-scoped". It was **paused on 2026-08-14** ("held, not retired") and left paused on 09-10 | `[hub]/diary/2026-07-24-3.md`; `[hub]/reports/goal-atlas-2026-07-24/goals.html`; `[hub]/diary/2026-08-14.md`; `[hub]/reports/goal-sessions-plan-2026-09-10/index.html`; `[hub]/docs/issue-contract.md:95` |
| **hub #74** | "Requirement: keynote live demo — audience ideas implemented during the talk", from Ideas discussion #51: "Share a link that allows people to post ideas here at the start of the keynote. Have obot implement during the talk and i'll demo a few at the end." It depends on #48 (idea queue) and #58 (ideas-triage v2), and "must never be selected in a way that risks the live talk" | `[hub]/reports/ideas-triage-v2-dry-run-2026-07-24/index.html` |

**Series outline (#22 Design):** no written outline of the remaining posts was found locally. What exists:
- The 07-12 decided order for #5–#7 (`[hub]/reports/blog-drafts-2026-07-12/index.html`): #5 safety.viz, #6 the Claude Code transition, #7 the work-patterns case study.
- The 07-10 "blog cycle" plan (`[hub]/diary/2026-07-10.md`).
- Repeated "Diary #8 outline" carry-items (`[hub]/diary/2026-07-24*.md`).
- A teased "Part 7 — Anatomy of a Session" that was never written (`[hub]/diary/2026-07-13.md`; `[hub]/reports/sessions/2026-07-14.html`).

The #22 issue body itself was not readable here.

### 3b. "Planning: the keynote arc" (2026-07-10)

From `[hub]/diary/2026-07-10.md`:
- "The October keynote goal got explicit (@jwildfire): go way beyond the safetyGraphics updates — finish that lane in July (safety.viz v1.0, gsm.safety 1.0, then static charts), leaving August–September to build **open.gismo** … Recorded in memory with the open decisions (**where the work lives, demo form factor, review-bandwidth model**)."
- Those three open decisions became keynote decisions **K2/K3/K4**, carried on every session list from 07-11 to 07-18 (`[hub]/diary/2026-07-11-2.md` … `2026-07-18.md`).
- **K1 is never defined** in any local file. It may be the arc decision above, but that is an inference.

The executive overview of 07-21 framed it as acts: "open.gismo v1.0 — the platform … This is the August–September centerpiece and the keynote's **second act**" (`[hub]/reports/executive-overview-2026-07-21/index.html`).

### 3c. Keynote decisions K2–K4 (decided 2026-07-19)

Recorded in `[hub]/diary/2026-07-19.md`:
- **K2:** build open.gismo on the jwildfire fork, with milestone PRs upstream. This matches open.gismo #34 D2.
- **K3:** "the keynote demo is a **forkable demo-study repo** (gsm.datasim → workr on scheduled Actions → live dashboard site)". The steps were drawn as "K3 · step 1–3" in `[hub]/reports/app-design-2026-07-28/directions.html`. It was realized on 07-28 as `jwildfire.github.io/demo-301`: "the safetyGraphics-replacement app was running on real pipeline output … with a forkable study repo behind it" (`[hub]/diary/2026-07-28.md`). On 08-31 its weekly pipeline "failed three consecutive weekly rebuilds in silence" (`[hub]/reports/decisions/2026-08-31-september-plan/index.html`).
- **K4:** "wider standing per-repo grants for the Aug–Sept build". Designed as the A1–A3 grant matrix in `[hub]/requirements/design/18_design.html` §5.

**A second, conflicting K-series.** The goal atlas (`[hub]/reports/goal-atlas-2026-07-24/requirements.html`, section "K Keynote — hub#72") proposes **K1–K8 as requirement candidates**, not decisions. Most were never filed as far as local files show.

| ID | Candidate | Atlas's "why now" (abridged) |
|---|---|---|
| K1 | Narrative arc and slide inventory (M) | "the artifact every other keynote item depends on" |
| K2 | Demo reliability plan (M) | pinned build, offline path, rehearsed fallback, an abandon rule. Conference wifi plus GitHub plus one-hour tokens |
| K3 | "Anatomy of a session" as a shareable artifact (M) | "converts the talk's most hand-wavy claim ('the agent ran the session') into something a skeptic can read line by line" |
| K4 | Metrics pipeline for the numbers slides (S) | counts generated and "refreshable on the morning of the talk" |
| K5 | Audience intake for the live demo (S) | QR/short link, moderation and a rate cap, "tested with more than one person before … three hundred" |
| K6 | Rehearsal with timings (S) | "A talk with unattended agent work inside it has a variance problem" |
| K7 | Public-surface review before the talk (S) | a scrub of the repos, issues, diary and demo data the talk points at |
| K8 | Post-talk landing page (S) | deck, repos, diary, forkable demo, "start here" |

The same file also tags keynote-facing items in other goals:
- A5, the forkable demo study: "the most convincing possible answer to the keynote's inevitable question — 'how do I try it?'"
- C3, Kaplan–Meier: "the clearest 'we built what the guidance asks for and nobody else has' slide in the deck".
- U7, cost accounting: "the number the keynote audience will most want".

**Use "K1–K8 (atlas)" vs "K2–K4 (07-19 decisions)" explicitly in the outline to avoid confusion.**

### 3d. Late-summer plans that reshape the talk

**D0031 "September: the last build month"** (2026-08-31, goal #72), in `[hub]/reports/decisions/2026-08-31-september-plan/`. Status "Awaiting his answers".
- Questions S1–S4: S1 the date (Sept vs Oct); S2 spend September on open.gismo vs consolidating; S3 defer the SAP and the review layer in writing; S4 a hard stop at the end of week 3, with week 4 protected for rehearsal.
- Key argument: "The talk is about none of [the healthy efforts]. The summer deliverable … was open.gismo … and open.gismo is the thinnest thing in the programme."
- The demo candidate: "put the folder on disk as the vendor sent it, run one command, and get back a single document that prices every gap in terms of the charts it turns off … the most interesting five minutes available in a talk about this kind of tool."
- Rehearsal rationale: "Every serious defect this programme found in August was something that *looked fine* … Those are exactly the failures that survive a quick look and die in front of an audience."
- It refers to a "companion episode … on *obot: the program*". What that is (a podcast? a series?) is not explained anywhere local.

**2026-09-10: the autonomous prototype is shut down** (`[hub]/diary/2026-09-10.md`; `[hub]/reports/goal-sessions-plan-2026-09-10/index.html`; `[hub]/NEWS.md` v0.4). This is probably the most important late plot turn for the talk.
- The readout: "the agent structure held, objectives and memory management were poor, most of the effort went into the orchestration itself, he had to redirect it constantly, and it never produced a release for him to review."
- The plan page's summary: "The last iteration built a robust agent structure and then spent it on itself: orchestration health improved while no agent-produced release ever reached Jeremy for review."
- The replacement is **requirement sessions**: Objectives → Requirements → Tasks, each with a definition of done; one requirement per Claude Code **cloud** session using `/goal`; a nightly standup rendered from GitHub; GitHub rulesets for merges; and the retirement of the obotclaw[bot] identity. The obot.agent retire PR removed **475 files, 7 left**, and **35 files / 20k lines** of hub scaffold were removed (`[hub]/NEWS.md`).
- Jeremy's verbatim ask: "I want to move to much more rigid issue tracking … All questions in standup should be tied to blocked issues."
- **The Mid-October plan:** five objectives across two lanes (A = app in safety.viz, B = charts in gsm.safety), weeks 0–5 running Sep 10 → Oct 16, with a "Must show by Friday" column.
  - Obj 1: all **22 FDA ST&F figures** as static charts.
  - Obj 2: interactive/static parity, "a static twin for every interactive chart".
  - Obj 3: a portfolio view of all 13 charts.
  - Obj 4: drop-your-own-files data loading and mapping, "nothing leaving the browser".
  - Obj 5: "a single downloadable file … opens from the desktop with no network and no install … released with a user guide and a rehearsed talk demo".
  - **Implied demo:** the downloadable offline app with your own CSVs dropped in. This supersedes the K3 GitHub-Actions demo-study demo, but that supersession is never said explicitly.
  - Open decisions: the freeze date, and a "version plan for the talk" (safety.viz v2.0.0 carrying the app, gsm.safety v2.0.0 carrying the static charts).

**Status visible locally (last commit 2026-09-14):**
- gsm.safety's dev branch ships as one release, **v1.2.0**, "on @jwildfire's decision of 2026-09-12" (`[gs]/NEWS.md`).
- `[hub]` HEAD: "Release review plan: gsm.safety v1.2.0 approved; the merge waits on a ruleset edit."
- **No local evidence of Sept 14 → Oct 1 progress** on objectives 3–5 or the 22-figure count.

### 3e. Keynote-facing flags elsewhere in the hub

- The roadmap page is "public and **keynote-facing**, so it opens on the work rather than the approval queue" (`[hub]/site/roadmap-changelog.json`).
- The Orange origin story ("Chilean street cat → Santiago → first safetyGraphics ideas") is captured as a "candidate opener for hub #10" (`[hub]/diary/2026-07-11-2.md`).
- The gsm.safety v1.2.0 census correction: the death count went **4 → 13** (`[gs]/NEWS.md`, "The death count, in detail"). It "matched the text of a discontinuation reason, never read the death domain". The new figure is "measured twice … by two routes that share no code", and the NEWS even records a correction of its own earlier "thirteenfold" claim. This is a strong **"agents finding real clinical errors, and their own"** slide, though it is not flagged as keynote material anywhere.
- The org chart was claim-checked by a 3-agent refutation pass: **97 claims checked, 68 confirmed, the rest corrected** (`[hub]/reports/org-chart/README.md`). It is a candidate "verification" anecdote.
- The idea triage run cost was tracked per run (example: 447.7k tokens in, ~$1.42; `[hub]/reports/ideas-triage-v2-dry-run-2026-07-24/index.html`). This is evidence of the cost-accounting culture.

### 3f. Open questions (unresolved in local sources)

1. The exact talk date and slot length (D0031 S1; the 09-10 "freeze date").
2. Whether the live audience-ideas demo (#74) is still on. Its infrastructure (ideas triage, intake lane) was **removed** on 09-10 (`[hub]/NEWS.md` v0.4: "the ideas triage … removed"), and #72 is paused. It is probably dead, but nothing records that.
3. Which demo is the demo:
   - K3 forkable demo-study / demo-301
   - the D0031 "folder → gap report"
   - the Obj 5 offline single-file app
4. The version plan for the talk (safety.viz/gsm.safety v2.0.0).
5. Whether diary #10 (GxP best practices) publishes before the talk, and whether a post-shutdown entry about requirement sessions (an "obot v5") is planned.
6. What Jeremy's "mixed feelings" are. They were deliberately held for the keynote (diary #8).
7. Whether #10, #22 and #72 were ever given Design sections or tasks.

---

## 4. Prior deck — `jwildfire/RPharma2026-AIKeynote`

**History** (`git log --all` in `[deck]`):
- Scaffolded by obot-claw on 2026-05-24.
- Drafted from two Jeremy dictations on 2026-06-06 (`f071317`, `a1d8c08` "Incorporate complete keynote dictation"), with release tag `v0.1`.
- On 2026-06-10, PRs #2–#4 briefly turned it into a docs hub with a diary-first layout. PR #5 (`d244019`) then returned it to deck-only: "official talk homepage moves to jwildfire.github.io/keynote".
- PR #1 (branch `codex/keynote-dictation-draft-2026-06-06`, the dictation draft) was merged. `main` is **content-identical** to that branch (empty `git diff`). There are no other unmerged branches.
- Housekeeping defect: `[deck]/README.md` lines 21–30 contain unresolved merge-conflict markers.

**Structure** (`[deck]/index.html`: 28 `<section>` slides, title "Agentic AI for Clinical Trial Operations — What the open-source community can do next", v0.1 released 2026-06-06; mirrored in `[deck]/outline.md`, 28 numbered slides, target ~40 min):

0. Title, thesis, "Why R/Pharma?", "Three parts".
1. **History (~10 min):**
   - the old model: every company had a big repo of SAS macros
   - the hybrid era: SAS + R/Python
   - open frameworks + local customization ("shared core / company extensions / clinical use", pharmaverse-style)
   - "Open source changed the surface area"
2. **Current best practices (~15 min), meant to be the largest section:**
   - SafetyGraphics ("When data inputs, displays, examples, and docs are open, safety review assumptions become easier to inspect"); GSM ("Monitoring workflows should be treated like software")
   - the shared pattern (Pre-competitive / Open / Inspectable / Reusable)
   - "Why this matters for AI" ("Once the workflow is open and software-shaped… AI can do more than autocomplete code")
   - what changed; the agentic engineering loop ("Issue → requirement → implementation → tests → demo → PR → human review")
   - Qualified, validated, GxP-ready; "AI-written code still needs a human owner" (four "A person must…" lines)
   - clinical ops opportunities (setup / conduct / closeout / submission)
   - what agents can help with now / what still needs humans
3. **What comes next (~15 min):**
   - obot as the demo thread (OpenClaw-era: Telegram, browser QA)
   - the live case study gsm.safety ("Report honestly in October on how far the team got")
   - "From human-in-the-loop to delegated AI team" (before/after)
   - guardrails for clinical contexts (Evidence / Permissions / Traceability / Humans)
   - close: "Open source is the path", with a placeholder for links and a QR code

**Dictation notes** (`[deck]/notes/keynote-direction-2026-06-06.md`):
- Core thesis: "Agentic AI can streamline and automate clinical trial work when it is connected to open, auditable, reusable clinical software workflows and governed by qualified, validated, GxP-ready practices."
- Venue framing: R/Pharma "already works in open-source and pre-competitive clinical tooling", so the talk is "a community opportunity".
- Part 1 should show that "Agentic AI is arriving into that context, not replacing it from scratch."
- Tone: "not 'AI can write code, ship it,' but 'AI can help build faster if humans own the requirements, evidence, validation, and accountability.'"
- Part 3: "Show the way of working, not just the artifact"; "obot as an AI engineering team managed by a human".
- The first dictation "cut off during the transition" to agentic AI (`[deck]/README.md`).

**Other files:**
- `[deck]/docs/visual-asset-plan.md` holds a visual backlog: a clinical workflow diagram, safety screenshots, an obot orchestration diagram, an agentic lifecycle diagram and a GitHub issue/PR structure. It has a screenshot metadata template. `assets/` is empty.
- `[deck]/skills/keynote-slide-workflow/SKILL.md` has a release-per-slide-update rule (v0.1, v0.2, …).

**What is reusable vs dated:**
- *Reusable:* the three-act history → practice → future spine, and the SAS-macros → hybrid → open-frameworks history (none of the diary posts covers that industry history). Also the "software-shaped workflows are agent-ready" bridge, the human-ownership slide, the setup/conduct/closeout/submission frame (matching the abstract's forward look), and the Evidence/Permissions/Traceability/Humans guardrails grid.
- *Dated:* everything obot-specific (OpenClaw, Telegram, PM/Dev/Test roles). The gsm.safety "live case study" framing is now a finished story with numbers. The talk title changed.

---

## 5. Candidate story beats and through-lines (SUGGESTION — synthesis, not from the sources)

**A. One question, asked four times.** "What can we actually do with AI agents right now?" (06-10) → "quite a lot" (07-13) → "it's not a capabilities problem anymore" (09-06) → in October: "so what's stopping us?" This gives the talk a built-in spine and a callback ending.

**B. The obot version ladder, mapped onto the Five Levels post (02-10).**
- v1/v2 OpenClaw on a clean-room laptop (L3 → L4 attempt, "51/49")
- v3 Claude Code + roadmap + playbook + bot identity (L4: "a billion tokens in a weekend")
- v4 "the agent became an organisation" (an L5 attempt: quietly wrong, $7k API-equivalent)
- the 09-10 shutdown → requirement sessions (deliberately back to L4: "him driving rather than reviewing")

The honest arc is that autonomy went up, then came back down on purpose. That is the most distinctive and credible story here, and it probably *is* the "mixed feelings" Jeremy held back for the stage (diary #8).

**C. Papers → prompts → prototypes, plus the expert loop.** The 2017 working-group knowledge (requirement wikis, the eDISH clinical PDF), Jim Buchanan's references and FDA reference code become working, tested renderers in an evening. The point is "agents are only as good as the clinical workflows they're given", which honors the acknowledgements in #3.

**D. Evidence as the product.** Use the quality-framework thread from the 2019 FAQ ("Is it validated?") through:
- requirement-keyed tests (249 + 94, later more)
- evidence pages and the done-gate ("demonstrable on a public site")
- the census death-count correction (4 → 13), measured twice
- 97 claims adversarially checked

This answers the GxP audience directly and is the bridge to diary #10's promised "validation as code".

**E. The bottleneck moved.** The draft says "It's plumbing", diary #9 says "review, not writing, is the bottleneck", and the hub showed that no agent-produced release ever reached review. Agents produce more than humans and pipelines can absorb. For pharma this lands on version control, semver and qualification at volume (315k lines / 367 PRs / 23 releases).

**F. The numbers slides (all API-equivalent; actually paid $200/mo):**
- obot v1 baseline: 266 commits / 18 PRs
- weekend: 1.0B tokens / $1,273 / ~10 hours of Jeremy's time
- hep-explorer: 50M / $55; composite: 176M / $143; QT: 308M / $241
- summer: ~$7k over 24 days
- output by 09-06: 315k lines, 367 PRs, 23 releases, 12 repos
- charts: 13 renderers by mid-August

Atlas K4 argues these should be regenerated on the morning of the talk.

**G. Monitoring ↔ reporting / the same data twice.** Diary #4's bridge idea ("why can't tools for monitoring … translate directly into tools for reporting after database lock?") lands in the 09-10 Objectives 1–2: 22 FDA ST&F static figures, and a static twin for every interactive chart. It is a concrete "beyond a port" payoff, if it shipped.

**H. Lessons-learned list.** Pull from the hub and the draft:
- "never let an agent be the sole watcher of an agent"
- "transcript-only deliverables die with the session"
- gates before fan-out
- pick models like picking staff
- exit-zero lies ("reporting success while having done nothing")
- credential isolation over vibes
- requirements before work ("the roadmap … was recording work rather than authorising it")

**I. Bookends.** Open with the acknowledgements-first move from diary #3 and/or the Orange origin story (Chile → Santiago → safetyGraphics). Close with Amodei's "compressed century of trials" and "if the frontier models were frozen today…".

**J. Possible 3-act mapping that keeps the prior deck's spine:**
1. Where we came from: SAS macros → open frameworks, safetyGraphics and gsm, and the people.
2. What we did this summer: the obot ladder, safety.viz/gsm.safety, the numbers, papers to prototypes, evidence.
3. What's stopping us: execution, review and qualification at volume, pipelines and version control, rigid issue contracts; then the demo and the call to action.

---

## 6. Gaps the outline will need filled

1. **Logistics:** the exact date, slot length (the old draft assumed ~40 min), Q&A time, in-person vs virtual, and whether a live demo is allowed or wise. Nothing local states them.
2. **The demo decision:** which demo (K3 demo-301 / D0031 folder → gap report / Obj 5 offline app / #74 live audience ideas), and its fallback recording. Atlas K2 (reliability plan) and K6 (rehearsal) were never filed as far as local files show.
3. **Sept 14 → Oct 1 outcomes:** did the portfolio view, data loader, offline app, the 22/22 FDA figures and the v2.0.0 releases ship? The local hub clone stops at 09-14, so `/home/user/jwildfire/obot.roadmap` needs a pull, or the standup on the `session-state` branch needs reading.
4. **Diary #10 (GxP best practices)** is promised but not written. The keynote page still says "9 entries". The "validation as code / human gates / monitoring agents" content may need to be drafted directly for the talk.
5. **An account of the 09-10 shutdown and requirement sessions in Jeremy's own voice.** It exists only in hub artifacts written by agents, and his "mixed feelings" are unwritten.
6. **The industry-history section** (SAS macros → hybrid → open frameworks) exists only as dictation bullets in `[deck]`, with no data, dates or examples.
7. **The team / day-job evidence** ("AI in the loop" at Gilead with Copilot, the 50% release-rate figure, qcthat/workr). Only diary #1 touches it, while the abstract promised gsm.agent / gsm.roadmap / qcthat content. Is that still in scope, and what can be said publicly?
8. **The forward look** to clinical operations, CDISC/SDTM generation and CSR creation (abstract; diary #4 footnote; open.csr exists per the diary #9 repo list and `[hub]/reports/open-csr-*`) has no diary post. The CSR objective is paused.
9. **Fresh numbers:** a refreshed count for the numbers slides (atlas K4); none of the figures above is newer than 09-06.
10. **Visual assets:**
    - Usable now: `[blog]/assets/img/` (gallery and evidence screenshots, eDISH/guide PNGs, composite and QT GIFs, Orange photo, NYT/AE explorer/hep explorer figures) and `[hub]/reports/org-chart/` (chart.mmd).
    - Missing: a diagram of the obot version ladder, the requirement-session model, and before/after screenshots of the original safetyGraphics app.
11. **Public-surface review** (atlas K7) before pointing the audience at the live repos.
12. **A post-talk landing page** (atlas K8). `[blog]/keynote/index.html` could take that role; it needs a "start here" section and a link to the deck.
13. **Housekeeping:** `bubble_maybe.md` has no front matter, `[deck]/README.md` has conflict markers, and the "obot: the program" companion is never explained.

---

## 7. Addendum — gaps closed on 2026-10-01 (local session)

Read from GitHub and the local clones on Jeremy's Mac, which the cloud session could not reach.
Everything here was checked on the morning of 2026-10-01.

### 7a. The four hub issues, as written on GitHub

All four are open and none has moved since 2026-09-11.

**#10 — Requirement: R/Pharma 2026 AI keynote deck** (milestone 2026q4, status backlog)
- Scope: "open-source safety tooling, GSM, agentic engineering, and autonomous AI workers — the story this portfolio tells."
- Success: "a finished HTML-first slide deck, developed through the release-per-slide workflow the hub era established."
- Still points at the old deck repo (RPharma2026-AIKeynote PR #1) as the place the deck lives. That is now out of date: the deck is `keynote/slides.html` in this repo.
- Design and Tasks sections are empty placeholders. No date or slot length.

**#22 — Requirement: developer-diary blog series** (milestone 2026q4, status backlog)
- The body is stale: it says six posts are published (nine are) and still lists "write post #5".
- The Design section, meant to hold the series outline through the keynote, is empty. There is no written plan for diary #10 or anything after it.
- Cross-post backlog to big.blog: posts #2–#3 sit on an unpushed local branch, #4–#6 were never cross-posted (and by extension #7–#9).
- States the relationship both ways: "posts are source material for the deck, and the deck's story arc should inform the series outline."

**#72 — Goal: R/Pharma 2026 keynote deck** (milestone backlog)
- This is the source of the September-vs-October conflict: the goal line reads "the talk this whole roadmap feeds (September 2026)". Every other source says October.
- Division of labour, in the issue's words: "obot drafts structure, outlines, and supporting assets; @jwildfire owns the prose and the delivery."
- Names a "stage model" for the story: safety.viz portfolio → autonomy → app arc.
- Candidate children: the live demo (#74, the only one linked), deck outline / narrative arc, deck build ("format TBD"), rehearsal with timings. The last three were never filed.

**#74 — Requirement: keynote live demo** (milestone backlog, status backlog)
- The idea as written: share a link at the start, "obot triages and implements during the talk", demo a few results at the end. "The talk's thesis made tangible."
- Assumes "real code — draft PRs and deployed results", built inside about 30 minutes.
- Design notes list the risks without resolving them: moderation and rate limiting, a demo-safe selection rule, what is on screen while it works, pre-seeded fallback ideas, which machine and identity run it.
- Tasks: one empty checkbox.
- It is not closed, but everything it builds on was retired on 2026-09-10 (the idea queue, ideas triage and the obotclaw identity). Treat it as dead unless Jeremy revives it.

### 7b. What happened between 14 September and 1 October

Short version: one new explorer was built, nothing was released, and the mid-October app plan has not started.

- **The hub has not moved.** `obot.roadmap` main is still at `f0f7a5c` (2026-09-14). The nightly standup was never scheduled; `standup.md` on the `session-state` branch is the 11 September placeholder ("Not yet rendered").
- **No releases anywhere since August.** safety.viz is at v1.7.0 (15 Aug), gsm.safety at v1.1.0 (17 Aug), open.csr at v0.3.0 (27 Aug), the hub at v0.4 (11 Sep). There is no v2.0.0 of anything.
- **gsm.safety v1.2.0 is still a release candidate.** gsm.safety PR #88 is open and mergeable, review required, last touched 14 September. The hub's last commit says it was approved and "waits on a ruleset edit".
- **The one thing built: the Patient Journey Explorer.** Merged to safety.viz `dev` on 18 September in three PRs: the explorer (one participant's whole safety course on one study-day axis, safety.viz #144 and #147) and an AI narrative layer on top of it ("drafted, cited, reviewer-accepted", safety.viz #148). Hub requirements #349 and #351 are at status review; the R widget (#350) is backlog. It is on `dev` only, five commits ahead of v1.7.0, unreleased. This is the first chart in the programme with generated text in it, which makes it a candidate demo.
- **The five objectives of the mid-October plan:**
  - Chart coverage, all 22 FDA figures (#78): the requirement matrix on gsm.safety `dev` keys all 22 figures, plus the reference tables and three derivation functions (phase 0, in the v1.2.0 candidate). No figure is drawn yet; the two build phases (#323, #324) are backlog.
  - Static parity (#328): both requirements backlog, untouched since 11 September.
  - Portfolio view (#79): all three new requirements backlog.
  - Data loading and mapping (#329): all three requirements backlog.
  - Offline single-file app (#330): all three requirements backlog, including "release, guide and demo".

### 7c. What this changes for the deck

- **The offline app demo does not exist.** As of 1 October nothing under objectives 2–5 has a merged pull request. With the 16 October target that is 15 days. The demo choice is now between what already runs (the safety.viz gallery, the Patient Journey Explorer with narratives on `dev`, demo-301) and what would have to be built first.
- **"22 FDA figures" is a plan, not a result.** The honest number today is 22 figures specified, 0 drawn.
- **The numbers slides are safe to keep at their 6 September values** (315k lines, 367 PRs, 23 releases, 12 repos): little has merged since. A refresh would add three PRs and no releases.
- **The story since 10 September is itself a beat.** After the autonomous prototype was shut down, output dropped to one feature in three weeks, built with Jeremy driving. That fits through-line B (autonomy went up, then came back down on purpose) and should be said plainly rather than skipped.
- **Date and length, confirmed by Jeremy on 2026-10-01:** the morning of Wednesday 21 October 2026, 40 minutes. That is 20 days out, and five days after the hub plan's "ready by Friday 16 October". This settles open question 1 in sections 3f and 6.
- **Still only Jeremy can answer:** which demo, whether diary #10 is written before the talk, and what the "mixed feelings" are.

### 7d. Orange photos

`keynote/assets/orange/` holds 18 photos and one short video from Jeremy's download of 2026-10-01, resized to 2000px on the long edge. Orange opens the talk (slide 2, the blue-hat photo) and returns "working" on the transition slides. Five files are 360px originals (suffix `-small`) and will look soft at full slide height. `orange-lap-patio.jpg` shows another person, and `orange-supervising-laptop.jpg`, `orange-desk-copilot.jpg` and `orange-across-the-keyboard-small.jpg` show Jeremy.

---

## 8. Addendum — state on 2026-10-05, for beat 3

Checked against GitHub and the local Claude Code transcripts on Jeremy's Mac on 2026-10-05.
Section 7b's "nothing was released" stopped being true on 2 October; this section replaces it.

### 8a. Releases since section 7

| Package | Release | Date (UTC) | What it added |
|---|---|---|---|
| safety.viz | [v1.8.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.8.0) | 2026-10-02 | The demo app: load your own CSV or JSON, map columns, 13 charts, nothing uploaded, and the whole app as one HTML file that runs offline. Nine requests from the old RhoInc and SafetyGraphics trackers. Chart status tiers. Patient Journey Explorer as a Prototype |
| safety.viz | [v1.9.0](https://github.com/jwildfire/safety.viz/releases/tag/v1.9.0) | 2026-10-03 | The shared chart parts exported as a kit (36 members); a second chart library's charts in the demo app; R started in the browser on request |
| safety.viz | [v1.9.1](https://github.com/jwildfire/safety.viz/releases/tag/v1.9.1) | 2026-10-04 | The app says what happens to loaded data; the histogram's two JavaScript p-values deprecated |
| bio.viz | [v0.1.0](https://github.com/jwildfire/bio.viz/releases/tag/v0.1.0), [v0.2.0](https://github.com/jwildfire/bio.viz/releases/tag/v0.2.0) | 2026-10-03, 2026-10-05 | Six biomarker charts (one Experimental); every test computed by R |
| gsm.bio | [v0.1.0](https://github.com/jwildfire/gsm.bio/releases/tag/v0.1.0), [v0.2.0](https://github.com/jwildfire/gsm.bio/releases/tag/v0.2.0) | 2026-10-03, 2026-10-05 | The R behind bio.viz: statistics functions, six widgets, static figures and RTF tables |

- safety.viz has 14 releases between 2026-07-11 (v0.1.0) and 2026-10-04 (v1.9.1).
- gsm.safety has not moved: v1.1.0 (2026-08-17) is the latest release. [v1.2.0-RC1](https://github.com/jwildfire/gsm.safety/pull/88) is open, review required, last touched 2026-09-14. Released `main` has 9 `Widget_*` functions; `dev` has 13.
- Never say where the biomarker charts' design came from. bio.viz and gsm.bio are public; their origin is not.

### 8b. Counts for the slides

- Charts: 13 in the library and the demo app. 8 stable (histogram, outlier explorer, results over time, shift plot, delta-delta, hepatic explorer, AE explorer, AE timelines), 5 Experimental (hepatic waterfall, participant profile, nephrotoxicity, time-to-event, QT). Source: `site/config.json` on safety.viz `main` at v1.9.1.
- Not counted: the Patient Journey Explorer (Prototype, docs site only, known issues in safety.viz#167) and two planned charts. The gallery page's own header reads "14 of 16 migrated", which counts the prototype.
- Tests: 249 unit and 94 browser at v1.0.0 (diary #5); 2,185 unit and 374 browser at v1.9.1 (release notes).
- The AI narrative layer for the Patient Journey Explorer was merged to `dev` on 2026-09-18 (safety.viz#148), taken out of v1.8.0 (safety.viz#178) and kept on the branch `parked/pje-narratives`.
- open.csr: v0.3.0 (2026-08-27) is the latest release; v0.4.0-RC1 (open.csr#75) has been open since 2026-09-02; no pull request has merged since.
- FDA safety figures: still 22 specified, 0 drawn (obot.roadmap#323 and #324, backlog, untouched since 2026-09-11).
- demo-301: the weekly pipeline run failed on 2026-09-28 and 2026-10-05.
- Cost: the hub's published usage data (`site/usage/usage.json`) covers 2026-07-09 to 2026-08-19: $7,123.67 API-equivalent, 24 active days, 228 agents. Nothing is published for any later date.

### 8c. The last evolution before the talk: one orchestrator session

Jeremy's steer (2026-10-05): "Capabilities keep improving and Opus 5.5 moved the goal posts again. Orchestration works *great* with a simple prompt now."

The session is "Biomarker charts orchestration", local transcript `7c154956-4cfd-4a8b-ae87-f50aaaf3cf94` in `~/.claude/projects/-Users-jwildfire-Documents-obot2/`. Measured from that transcript and its 52 subagent transcripts, deduplicated by message id:

- Ran from 2026-10-02 12:03 UTC to 2026-10-05 03:59 UTC (Friday 08:03 to Sunday 23:59 Eastern); Jeremy's last message was at 23:43 Eastern on Sunday.
- One model throughout: `claude-opus-5-5`.
- 3.94 billion tokens: 3.77 billion cache reads (96%), 167 million cache writes, 1.23 million output. 9,818 model calls. By day: 0.94B, 1.36B, 1.50B, 0.15B.
- 52 agents spawned by the orchestrator, all at depth 1: 40 reviewers (by task description), 12 builders and page writers. They were long-lived: 141 hand-backs, about 9,200 shell commands.
- Jeremy's part: an opening brief of about 800 words, about 22 messages over the three days, 19 multiple-choice answers.
- What came out: six releases (safety.viz v1.9.0 and v1.9.1, bio.viz v0.1.0 and v0.2.0, gsm.bio v0.1.0 and v0.2.0) and all twelve requirements under obot.roadmap#353. bio.viz merged 32 pull requests and gsm.bio 23, all between 2 and 5 October.
- The same Friday, two other sessions produced safety.viz v1.8.0: "Safety.viz app with data loader" (09:30 to 14:13 UTC, 216M tokens) and "safety.viz v1.8.0-RC1" (14:12 to 21:45 UTC, 325M tokens). The first message was "I want to work on creating an app version for safety.viz that includes a data loader"; the release was published at 21:41 UTC.

Cost, at API list prices. The rates are the ones the desktop session "Today's API cost summary" (2 to 3 October) took from Claude Code's bundled API reference: Opus 5.5 at $4 input, $20 output, $0.20 cache read, $5 five-minute cache write and $8 one-hour cache write per million tokens. That session's own figures, reproduced here from the transcripts to within about a dollar:

- The orchestration session up to 05:49 Eastern on Saturday 3 October: 4,835 requests, 1.96 billion tokens, $737, with 27 subagents so far.
- Everything on Friday 2 October including the overnight run, all local sessions: 6,345 requests, 2.6 billion tokens, $943. The same tokens at Opus 5 rates would have cost $1,809 (48% less on Opus 5.5).
- The two sessions that produced safety.viz v1.8.0 that day: $62 and $91.
- The plan meter went from 12% to 21% of the weekly limit between 15:27 and 21:59 on Friday.

Extended to the whole orchestration session with the same rates (computed 2026-10-05, not in the cost session): $1,637 for 3.94 billion tokens, of which $1,414 was the 52 subagents. Cache writes cost more than cache reads: 158 million five-minute cache-write tokens at $5 against 3.77 billion cache reads at $0.20.

Not reproduced:
- Jeremy's "over 1000 subagents". The transcript shows 52 agents, 27 of them by Saturday morning. (The session made about 9,800 model requests; 4,835 by Saturday morning.)
- Jeremy's "half of my weekly allotment". The last meter reading on record is 21% on Friday night.

The contrast with obot v4: the 10 September retirement removed 475 files of scaffolding from obot.agent (hub diary 2026-09-10). This session ran on Claude Code as shipped, the hub's three standards documents and one brief. The release-candidate review by three subagents replaced the ultrareview gate during this session (hub NEWS v0.5, 2026-10-03).

### 8d. A found error worth a callout

safety.viz#188 (2026-10-03): a reviewer agent in the gsm.bio v0.1.0 release review found that the histogram's optional group comparison printed `exp(-0.5 * F)`, which "is not an F-test p-value", and that the normality screen was approximate. Both had shipped. v1.9.1 deprecates both settings and says so on the chart; v1.10.0 removes them. An agent wrote the shortcut and a later agent caught it.

### 8e. Overall cost and activity, counted 2026-10-05

Cost, API-equivalent:

| Window | Cost | Tokens | Source and caveat |
|---|---|---|---|
| 9 July to 19 August | $7,123.67 | about 8.0 billion | The hub's analytics page (`usage/usage.json`): 24 active days, 40,071 requests, 228 agents. Its local data stops on 19 August; the live page adds one cloud session of 12 September ($8.85) |
| 20 August to 18 September | at least $2,470 | at least 3.1 billion | Transcripts still on the Mac, priced at the hub script's rates. A floor: older transcripts have been pruned (for 14 to 19 August the Mac now holds $634 of the $3,653 the hub recorded) and cloud sessions after 10 September are not on the Mac |
| 1 to 5 October | $1,865 | 4.6 billion | Local transcripts, complete, all Opus 5.5 at the cost session's rates |

- More than $11,400 on record. June (the OpenClaw obot) is counted nowhere.
- Blended price: about $0.90 per million tokens for 9 July to 19 August, about $0.40 for October.
- What Jeremy paid: "$200/month Claude Max" (diary #6, diary #8). Not confirmed for October.

Activity on GitHub since 2026-06-10, over the twelve repositories in diary #9's footnote (safety.viz, gsm.safety, open.csr, open.gismo, obot.agent, obot.roadmap, demo-301, scaffold, showlist, RPharma2026-AIKeynote, and the safetyGraphics and safetyCharts forks) plus bio.viz and gsm.bio:

| | To 6 September (12 repos) | To 5 October (14 repos) |
|---|---|---|
| Pull requests merged | 367 | 496 |
| Releases | 23 | 32 |
| Issues opened | not counted then | 704 |
| Issues closed | not counted then | 483 |
| Commits on default branches | not counted then | about 2,100 |

- The 6 September column reproduces diary #9 exactly, so the method matches.
- By repository, pull requests merged to 5 October: obot.agent 185, safety.viz 95, gsm.safety 53, obot.roadmap 47, open.csr 43, bio.viz 32, gsm.bio 23, open.gismo 8, demo-301 4, the old keynote repository 4, scaffold 2.
- Lines of source have not been recounted since diary #9's 315,000.
- The hub tracker on 2026-10-05: 10 objectives, 175 requirements (66 released, 44 retired, 55 backlog, 7 in review, 3 ready), 266 tasks (224 done).

### 8f. The five obot versions, and the starting point (2026-10-05)

Jeremy's numbering (2026-10-05): "v1 was actually a local personal assistant who drafted a handoff/build for the openclaw! v2 is open claw. v2.5 was paperclip (probably just a footnote). v3 fable 5. v4 org. v5 opus 5.5."

| Version | When | What the record has |
|---|---|---|
| v1, a local personal assistant | early May 2026 | No public account. gsm.safety's first commit (2026-05-09) has the author name "Orange" and the message "Initial gsm.safety design". In diary #2 the OpenClaw agent calls itself "the second bot of the name, following obot v1 or obot-prime" |
| v2, OpenClaw | 11 May to June | The old hub's diary: "obot came online" on 2026-05-11. Diary #2: clean-room laptop, Telegram, GitHub identity obot-claw; 266 commits, 18 pull requests and 2 releases by 10 June; "51% fun and 49% frustrating" |
| v2.5, Paperclip | late June | Diary #6 footnote: PM, Dev and Testing agents, OpenClaw heartbeats, Paperclip as the control plane; "never shipped" |
| v3, Claude Code on Fable 5 | July | Diary #5, #6, #7. Hub established 2 July; the weekend of 10 to 12 July |
| v4, the organisation, on Opus 5 | August to 10 September | Diary #8 (20 August); hub diary 2026-09-10 for the shutdown |
| v5, one requirement at a time | 10 to 30 September | Split out by Jeremy on 2026-10-05 ("after retiring factory, before opus 5.5"). See the table below |
| v5.5, Opus 5.5 | October | Section 8c above. Opus 5.5 was released on 22 September (simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/) and first appears in the local session logs on 2026-10-01 |

The earlier notes in this digest (sections 2 and 5) call the OpenClaw agent "v1"; Jeremy's numbering above replaces that.

The starting point for the goal slide, measured 2026-10-05 from fresh clones (`wc -l` over `src/**/*.js`, last commit on the default branch, `package.json`):

| Legacy renderer | Last commit | Lines of JavaScript in src/ | Files |
|---|---|---|---|
| RhoInc/safety-histogram | 2020-01-20 | 3,587 | 102 |
| RhoInc/safety-outlier-explorer | 2021-06-01 | 2,463 | 85 |
| RhoInc/safety-results-over-time | 2019-07-12 | 1,731 | 72 |
| RhoInc/safety-shift-plot | 2019-08-19 | 1,330 | 38 |
| RhoInc/safety-delta-delta | 2019-11-27 | 1,326 | 47 |
| RhoInc/paneled-outlier-explorer | 2019-08-19 | 1,897 | 61 |
| RhoInc/aeexplorer | 2020-10-21 | 2,161 | 45 |
| RhoInc/ae-timelines | 2019-08-19 | 1,063 | 28 |
| RhoInc/web-codebook | 2021-05-07 | 4,762 | 119 |
| SafetyGraphics/hep-explorer | 2022-02-25 | 5,103 | 133 |
| Total | | 25,423 | 730 |

- Every one depends on D3 version 3 and on Webcharts. safety.viz v1.9.1 depends on Chart.js ^4.5.1 and has 45,655 lines in 147 files under `src/`.
- Idle on 2026-10-05: six for more than six years, eight for more than five, nine for more than four.

### 8g. What shipped under obot v5, 10 to 30 September (checked 2026-10-05)

| Where | What | When |
|---|---|---|
| obot.agent | v0.5.0, "the requirement-session core": the retirement pull request (#334) removed 475 files and left seven | released 11 September |
| obot.roadmap | v0.4, "the standards home": the issue contract, ways of working, developer guidelines; objective, requirement and task templates; status as a label | released 11 September |
| obot.roadmap | The tracker page (#347); per-session usage published from cloud sessions (obot.agent#339) | 12 September |
| gsm.safety | 38 pull requests merged, about 100 commits on `dev`, toward v1.2.0: the FDA requirement matrix (22 figures), reference criteria as package data, the first `Derive_*` functions, many input checks. Still a release candidate (#88) | 11 to 13 September |
| safety.viz | The Patient Journey Explorer (#144, #147) and its AI narrative layer (#148), merged to `dev` | 18 September |
| ai-roundup | A new public repository, "Agentic Sweep for AI News related to Clinical Trials" | 9 to 21 September |
| jwildfire.github.io | The site's light theme, honeycomb favicon and the homepage release feed (#14 to #18) | 12 to 13 September |

- Releases in the window: the two scaffold releases only. No safety.viz release between v1.7.0 (15 August) and v1.8.0 (2 October); no gsm.safety release since v1.1.0 (17 August).
- Nothing merged in safety.viz, gsm.safety, obot.agent or obot.roadmap between 19 and 30 September.
- Not in this window, though Jeremy remembered them here: open.csr (last activity 2 September, v0.4.0-RC1 opened that day, under v4) and the participant profile (rebuilt in safety.viz v1.5.0, 26 July).
- Models: local logs for 10 to 18 September show Fable 5.1 and Opus 5 (18 September: 1,364 Fable 5.1 requests and 455 Opus 5); the one cloud session with published usage (12 September) ran on Fable 5.1.
