# Beat 4 capability timeline: sources

Draft of 2026-10-05 for the slide in `beat4-capability-timeline-draft.html` ("How fast it is moving"). Not in the deck yet. Every word on the slide is draft wording for Jeremy to replace; this file is the record of where each date came from.

Reference Jeremy named: Simon Willison, "2026 in LLMs (so far)", 27 September 2026, https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/ (called "Willison" below). It is the annotated version of his closing keynote at WeAreDevelopers World Congress North America, 25 September 2026.

## The span

- Start: 24 November 2025, the release of Claude Opus 4.5. Source: https://www.anthropic.com/news/claude-opus-4-5
- End: 21 October 2026, the talk.
- Length: 331 days, which is eleven months less three days. Jeremy's "roughly 1 year" is close; the headline says "eleven months".

## Releases lane (eight labelled)

| On the slide | Date | What it is | Source |
|---|---|---|---|
| Opus 4.5 | 24 Nov 2025 | Anthropic model. Willison's "November 2025 inflection point": with GPT-5.1, the release that made coding agents dependable for daily use | https://www.anthropic.com/news/claude-opus-4-5 ; Willison |
| OpenClaw | Jan 2026 | The open-source personal agent that gave "claws" their name. First commit (as "Warelay") 24 Nov 2025; renamed to OpenClaw by the end of January | Willison; https://github.com/openclaw/openclaw |
| Mythos | 7 Apr 2026 | Anthropic model announced and restricted to security researchers (Project Glasswing) | Willison; https://simonwillison.net/2026/Apr/7/project-glasswing/ |
| Fable 5 | 9 Jun 2026 | Anthropic model. Suspended 12 June by a US government directive, back 1 July | Willison; https://simonwillison.net/2026/Jun/9/claude-fable-5/ ; https://www.anthropic.com/news/fable-mythos-access |
| GPT-5.6 | 9 Jul 2026 | OpenAI model family (Sol, Terra, Luna) | Willison; https://simonwillison.net/2026/Jul/9/gpt-5-6/ |
| Opus 5 | 24 Jul 2026 | Anthropic model | https://www.anthropic.com/news/claude-opus-5 ; also https://en.wikipedia.org/wiki/Claude_(language_model) |
| Fable 5.1 | 1 Sep 2026 | Anthropic model, released with a restricted sibling, Mythos 5.1. Added 2026-10-05 when v5 was split, because v5 ran on it | https://en.wikipedia.org/wiki/Claude_(language_model) ; press, for example https://llm-stats.com/blog/research/claude-fable-5-1-launch |
| Opus 5.5 · GPT-6 | 22 Sep 2026 | Anthropic's Opus 5.5 and OpenAI's GPT-6 Sol and Luna, released about an hour apart | https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/ |

- The marker for "today" is the talk, 21 October 2026.
- Coloured hex markers are the releases an obot version ran on: OpenClaw (v2), Fable 5 (v3), Opus 5 (v4), Fable 5.1 (v5), Opus 5.5 (v5.5).
- OpenClaw's marker sits at 30 January. Willison gives "by the end of January", not a day; the label says "Jan".
- GPT-6 Astra came out earlier than its siblings (limited preview 3 September, general release 4 September, per https://en.wikipedia.org/wiki/GPT-6_Astra). The slide's label is anchored on 22 September because that is the Opus 5.5 date.

## Experiments lane (dates as given by the lead session, from the diary and beat 3)

| Version | When | Ran on | Ladder level |
|---|---|---|---|
| v1 | early May 2026 (first gsm.safety commit 9 May) | a local personal assistant; model not in the record | 2 |
| v2 | 11 May to June 2026 | OpenClaw on a clean-room laptop, over Telegram (diary #2 also lists Codex) | 3 |
| v3 | July 2026 (1.0 billion tokens on 10–12 July) | Claude Code on Fable 5 | 4 |
| v4 | August to 10 September 2026 | "the organisation" on Opus 5 | 5, reached for |
| v5 | 10 to 30 September 2026. "One requirement at a time": v4 shut down, a tree of issues kept (objective, requirement, task), one session per requirement. Activity is concentrated on 10 to 18 September | Fable 5.1 and Opus 5 (local session logs; the one cloud session with published usage, 12 September, ran on Fable 5.1) | 4 |
| v5.5 | 1 to 5 October 2026 (2–4 October: 52 agents, 3.9 billion tokens, six releases) | Opus 5.5, one orchestrator and one brief | 4 |

- The bars under the ruler show when each ran. v1's bar (1–10 May) is approximate: "early May" is all the record gives.
- Jeremy split v5 in two on 2026-10-05: "split out a v5 (after retiring factory, before opus 5.5) and 5.5 (opus 5.5 work)". The lane now has six markers: v1, v2, v3, v4, v5 and v5.5.
- v4's bar ends on 10 September; v5's teal bar runs 10 to 30 September; v5.5's bar runs 1 to 5 October, so it is short.
- v5's label says "Fable 5.1" only. "Fable 5.1 · Opus 5" does not fit between its neighbours at a readable size; the notes carry both.
- Hexes: `obot-v5.svg` is the teal September hex; `obot-v5-5.svg` is the blue October hex.
- "v2.5" (Paperclip as a control plane, never shipped) is left off.
- Ladder levels are not on the slide; they are here in case Jeremy wants them under the hexes.

## Did not try (five entries, hollow markers)

| On the slide | What it is | Date | Source |
|---|---|---|---|
| MCP | Model Context Protocol: Anthropic's open standard for connecting AI tools to data sources and other tools. Donated to the Linux Foundation a year later (diary #9) | 25 Nov 2024 (before the chart starts, so no marker on the ruler) | https://www.anthropic.com/news/model-context-protocol ; `_posts/2026-09-06-not-a-capabilities-problem.md` |
| Open-weight models | Models whose weights can be downloaded and run on your own hardware. Added at Jeremy's request, 2026-10-05: all six obot versions ran on closed, hosted models | Qwen3.6-35B-A3B, 16 Apr 2026; Qwen 3.8 27B, 14 Aug 2026 | see the next section |
| Muse | Meta's personal AI agent. Willison places it in the "claw" line: the race to build a safe claw for ordinary users | 8 Sep 2026 | https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/ ; Willison |
| Jev | TypeSafe AI's first "System One" model. It does not write text: it takes program state and typed questions and returns typed answers with probabilities, for the decisions inside an agent harness (routing, screening). API access, early access | 15 Sep 2026 | https://typesafe.ai/blog/introducing-system-one-models-and-jev ; https://en.wikipedia.org/wiki/Jev_(AI_model) |
| Dots | OpenAI's always-on personal agents, announced at DevDay. Each dot runs on GPT-6 Astra with its own cloud computer and browser | 29 Sep 2026 | https://openai.com/index/introducing-dots/ (returned 403 to the fetch tool) ; https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/ |

What Jeremy's shorthand turned out to be:

- "jev" is Jev, spelled as he typed it.
- "muse" is Meta's Muse.
- "dots" is OpenAI's dots.
- Muse and dots are both consumer personal agents, the category Willison calls claws. Jev is not a claw; it is a new kind of model. Jeremy's sentence already separates them ("MCP, jev, new 'claw' products like muse/dots").
- Dots launched two days after Willison's post, so it is not in the post. Jev is not in the post either.

## Open-weight models: what the notes say and why

- Willison names "a dramatic improvement in the abilities of open weight models, including models that you can run on a laptop" as a key trend of 2026.
- Qwen3.6-35B-A3B (Alibaba). He ran it on his laptop on 16 April 2026 as a 20.9GB file; it drew a better pelican than the then-new Claude Opus 4.7. Source: Willison; https://simonwillison.net/2026/Apr/16/qwen-beats-opus/
- Qwen 3.8 27B (Alibaba), Apache 2 licensed, a 17GB download. He calls it the first model he ran on his laptop that felt almost competitive with the frontier, with the caveat that his test is pelican drawings. Source: Willison; https://simonwillison.net/2026/Aug/16/qwen-38-27b/
- Date of Qwen 3.8 27B: his post of Sunday 16 August calls it "Friday's big release", which is 14 August. That is derived, not stated as a date.
- Date of Qwen3.6-35B-A3B: 16 April is the day he ran it and wrote it up as new. The vendor page (https://qwen.ai/blog?id=qwen3.6-35b-a3b) was not checked.
- Both have hollow diamond markers on the ruler, unlabelled; the card names them.
- "Data that cannot leave the building" in the notes is the lead session's phrase for why this matters to pharma. It is draft wording, not a quote from a source.

## Could not verify, or verified only second-hand

- OpenAI's own page for dots would not load (403). The 29 September date and the description come from TechCrunch and other press.
- Opus 5's date (24 July 2026) and Jev's date (15 September 2026) were read through a page-summarising tool, and each agrees with Wikipedia. TypeSafe's blog page also carries a 28 September "published" stamp; 15 September is the launch date given there and elsewhere.
- GPT-5.1's exact day in November 2025: not in Willison, not looked up, not on the slide.
- The models under v1 and v2: not in the record.
- Whether MCP was truly never used. Claude Code sessions can load MCP connectors without anyone setting out to use them. Jeremy should confirm the wording.

## Where the sources differ from Jeremy's framing

- "Roughly 1 year after Opus 4.5": it is 331 days, eleven months.
- "Opus 4.5 changed the game": Willison credits two models, Opus 4.5 and GPT-5.1, each paired with its coding agent. Diary #1 says "Opus 4.5 and ChatGPT 5.2 in late 2025". The slide marks only Opus 4.5.
- Diary #1 (dated 10 June 2026) says Fable 5 "came out today". Willison and Wikipedia date it 9 June. The slide uses 9 June.
- Fable 5 was unavailable from 12 June to 1 July. That fits v3 starting in July.
- MCP is not a 2026 innovation: it predates the chart by a year. It is on the list because Jeremy named it, with its real date.

## Choices made

- Eight labelled releases, chosen because an obot version ran on them (five) or because they mark a turn in the story (Opus 4.5, Mythos, GPT-5.6). The brief asked for six to nine.
- Left off, with sources if Jeremy wants more ticks: Opus 4.6 (5 Feb), Opus 4.7 (16 Apr), Opus 4.8 (28 May), Sonnet 5 (30 Jun), all from https://en.wikipedia.org/wiki/Claude_(language_model) ; Gemini 3.1 Pro (19 Feb, Willison); GPT-6 Astra (3 Sep, Wikipedia).
- Agent Skills (an open standard since December 2025, diary #9) is something Jeremy did use. It is not on the chart; it could be an eighth label.
- No lines join a release to the version that ran on it. They crossed the ruler and each other; colour and the "ran on" line under each hex do the job.
- No chart of "the gap" itself. There is no sourced measure of adoption to draw, so the takeaway is a sentence.
- Headline and takeaway are placeholders: "Eleven months, and I could not keep up" and "We cannot keep up, so the gap between capability and adoption keeps widening."
- Scale: x = 30 + 3.45 × (days since 1 November 2025), in a 1320-wide SVG, so anyone can move or add a marker.

---

Drafted by Claude Code using Opus 5.5 on 2026-10-05; not yet reviewed by @jwildfire.
