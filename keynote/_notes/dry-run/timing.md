# Dry-run timing

Generated from keynote/slides.html (fingerprint 5788a1fd9b) by keynote/_notes/dry-run/build.mjs. Do not edit by hand; re-run the script after the deck changes.

## Totals

- Slides in the main run: 56
- Slides with his spoken notes: 5 (no spoken notes yet: 51)
- Open TODOs: 30 (6 boxes on slides (orange TODO or blue review), 24 "TODO (Jeremy)" items in notes)
- Words in his spoken notes: 219, which take 1.6 min at 140 words a minute
- Slot: 40 min; the suggested split below adds up to 40 min and is not decided

## Beats

| Beat | Slides | Count | Suggested min | Seconds per slide | Spoken-notes slides | Spoken words | Spoken min |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 Opening | 1–10 | 10 | 8 | 48 | 5 | 219 | 1.6 |
| 2a OpenRBQM without AI | 11–15 | 5 | 15 (2a + 2b) | 56 | 0 | 0 | 0.0 |
| 2b AI layered in | 16–26 | 11 | 15 (2a + 2b) | 56 | 0 | 0 | 0.0 |
| 3 The obot journey | 27–46 | 20 | 10 | 30 | 0 | 0 | 0.0 |
| 3.5 How we built it | 47–51 | 5 | none | n/a | 0 | 0 | 0.0 |
| 4 What we learned | 52–56 | 5 | 7 | 84 | 0 | 0 | 0.0 |

- Beat 2 has one allowance, 15 min, over 2a and 2b together (16 slides, 56 s per slide).
- Beat 3.5 has no minutes in the suggested split. If beats 3 and 3.5 share the 10 min: 25 slides, 24 s per slide. If 3.5 comes out of beats 3 and 4 together (17 min): 30 slides, 34 s per slide.
- Seconds per slide is the minutes in the split divided by the slides in the beat; spoken minutes count only the words he has written, at 140 words a minute, so slides with no spoken notes add nothing.

## Slides with no spoken notes (51)

- 3. By working in public (beat 1)
- 6. “Why can't I do this for work?” (beat 1)
- 7. A handful of webpages beats a 200-page PDF (beat 1)
- 9. The hepatic explorer, and a clinical workflow to go with it (beat 1)
- 10. What we did, and what we didn't (beat 1)
- 11. OpenRBQM (beat 2a)
- 12. Monitoring a trial, as software (beat 2a)
- 13. An ecosystem of packages (beat 2a)
- 14. A standard development lifecycle (beat 2a)
- 15. GxP is built into the design (beat 2a)
- 16. AI in the loop (beat 2b)
- 17. “We use AI heavily, but it's not autonomous. Humans own the process and all deliverables.” (beat 2b)
- 18. How much do you hand over? (beat 2b)
- 19. Same lifecycle; five steps changed hands (beat 2b)
- 20. Faster code; planning and operations have to catch up (beat 2b)
- 21. Agents can help a lot with planning (beat 2b)
- 22. Agents can help a lot with operations (beat 2b)
- 23. The hub replaced spreadsheets and email (beat 2b)
- 24. AI-written code still needs a human owner (beat 2b)
- 25. What changed: +50% (beat 2b)
- 26. We're having great success at level 2.5! (beat 2b)
- 27. From Orange to obot (beat 3)
- 28. What are these tools good at right now? (beat 3)
- 29. Modernize safetyGraphics, using the gsm framework (beat 3)
- 30. A summer down the AI rabbit hole, with obot (beat 3)
- 31. A personal assistant (beat 3)
- 32. OpenClaw (beat 3)
- 33. safetyGraphics, inside a gsm workflow (beat 3)
- 34. Claude Code, on Fable 5 (beat 3)
- 35. “The first renderer took a few weeks; the next six took a weekend.” (beat 3)
- 36. Papers → prompts → prototypes (beat 3)
- 37. The organisation (beat 3)
- 38. Four roles, and a timer script (beat 3)
- 39. “Nine cases in one night of something reporting success while having done nothing.” (beat 3)
- 40. One requirement at a time (beat 3)
- 41. I review releases and answer questions (beat 3)
- 42. Same lifecycle; I kept two steps (beat 3)
- 43. A new scaffold, a candidate and an experiment (beat 3)
- 44. Opus 5.5 (beat 3)
- 45. One orchestrator, one brief, one weekend (beat 3)
- 46. The safety.viz demo: your own files, nothing uploaded (beat 3)
- 47. $11,750 at API prices. I paid $200 a month. (beat 3.5)
- 48. A lot of tests, and still not GxP (beat 3.5)
- 49. The whole roadmap is one tree of GitHub issues (beat 3.5)
- 50. An objective becomes requirements, then tasks (beat 3.5)
- 51. Eleven months, and I could not keep up (beat 3.5)
- 52. What we learned (beat 4)
- 53. What are agents good at now? (beat 4)
- 54. What are agents bad at now? (beat 4)
- 55. How I feel about it (beat 4)
- 56. A pixel-art party of orange cats dancing under a disco ball, with confetti (beat 4)

## Open TODOs (30)

- Slide 8 (on slide): the contributing companies / Logos to come, from an old slide / Drop the slide or the image in keynote/_notes/inbox/
- Slide 10 (on slide): Jeremy to reviewcommits chart, added 7 Oct
- Slide 13 (on slide): Jeremy to reviewpackage hexes, added 7 Oct
- Slide 13 (in notes): the hexes. None of these packages has a hex logo in its public repository except qcthat, whose real logo is used. The other seven are plain hexes in the deck's colours with the short name inside. Real hexes, if you have them or want them made, drop into keynote/assets/hex/ and replace the plain ones.
- Slide 14 (in notes): check the steps against the March all-hands deck's "Standard Development Lifecycle" slide. I did not have that slide; this version is worked back from the merged one by un-marking the agent's steps, dropping the step that only exists with an agent ("Review the plan, then prompt") and shortening "Implement, with a person steering" to "Implement". The headline is that deck's title in sentence case.
- Slide 15 (in notes): vet the qualification sentence and say what a qualified release involves at work, in your words.
- Slide 15 (in notes): replace it with a screenshot of a real qcthat report if one can be shown.
- Slide 21 (in notes): (1) Vet all ten pages; they are public already, but they have not been on a keynote slide. Two things to look at in particular: thumbnail 9 names the other repositories of the side project in small print, and thumbnail 7 shows a scatter plot of the public demo study. (2) Supply or approve real gsm.roadmap artifacts if any can be shown: screenshots you take yourself, cleared for a public talk, would replace some or all of these and the caption line would go. (3) Confirm the caption wording: it tells the room these are not the team's pages. (4) Say whether the callout stays.
- Slide 22 (on slide): Jeremy to reviewmock schedule, added 7 Oct
- Slide 22 (in notes): replace the mock rows or keep them; confirm "Plan check", "OK" and "Flagged".
- Slide 25 (on slide): newer numbers, more detail, and a visual
- Slide 25 (in notes): these are June figures from a public post. Confirm they can go on a slide, and whether to refresh them for October.
- Slide 26 (in notes): fresher numbers if you have them.
- Slide 31 (in notes): which tool v1 was, what you asked it for, and what worked and what didn't. There is no public account of it, so this version has one slide and no thumbs yet.
- Slide 31 (in notes): the ladder level. Level 2 ("you pair with it and still read every line") is a guess to start the climb: 2, 3, 4, 5, then back to 4.
- Slide 40 (in notes): 10 September in your own words. The only record is the hub diary of that day, drafted by an agent: "the fully autonomous multi-agent prototype is shut down. The readout was hard to argue with — the agent structure held, objectives and memory management were poor, most of the effort went into the orchestration itself, he had to redirect it constantly, and it never produced a release for him to review." And: "The replacement is requirement sessions: five objectives broken into requirements and tasks, one requirement per session, running as long as it takes, with him driving rather than reviewing." The placeholder slide for this account is in the reserves.
- Slide 40 (in notes): the "mixed feelings" promised in diary #8 ("I've honestly got some mixed feelings about the whole thing ... I'll talk about that more in the keynote"). Here, or in beat 4.
- Slide 41 (in notes): "after so many struggles" deserves a sentence of yours here. What made this version of the scaffold work when v4's did not?
- Slide 45 (in notes): a name. The outline calls this "obot v5" as a placeholder only.
- Slide 45 (in notes): "Still waits on me" is a placeholder: gsm.safety v1.2.0-RC1 has waited on review since 14 September, and the 22 figures in the FDA safety guidance are specified but not drawn. Another candidate from the cost session: each new subagent paid to cache its context from scratch, so cache writes cost more than cache reads.
- Slide 46 (in notes): confirm.
- Slide 46 (in notes): which files to drop in on the day.
- Slide 46 (in notes): the goal's fourth line was "have some fun". A closing line here hands to "how we built it" (part 3.5). In June it was "51% fun and 49% frustrating". What is it now?
- Slide 47 (in notes): • Settled 2026-10-07: “$200 a month” still describes September and October (Jeremy: "Yes, still $200"). It is the figure in diary #6, #8 and #9; nothing on record confirms it after 6 September. / • The headline's $11,750 and the October bar will be out of date by 21 October. Refresh both from the analytics page the week of the talk. / • The July weekend is mostly missing from the bars. Diary #6 reports $1,273 for 10 to 12 July; the hub's file holds $145.60 for 9 to 12 July. So July is a floor too, by about $1,100, unless the two overlap in a way the record cannot show. Not added to the total. Say it, or leave the July bar as it is? / • v1 and v2 (May and June, the personal assistant and OpenClaw) have no usage data at all. The bottom line says June is not counted; it does not say what June cost. / • 10 September, the day v4 was retired, is counted under v4 ($36.74). / • Keep the three cards, or cut to two? “Two long weekends” repeats beat 3. / • Whether to show the 496 merged pull requests beside the cost (the reserve slide “What it took” did). Left off here to keep one idea on the slide.
- Slide 49 (in notes): the headline. Whether to say out loud which block is which, or let the green carry it. Whether the autonomy block should be on a slide in this beat at all, since beat 3 has already told that story. Whether the keynote deck's own block staying pale is a joke worth making.
- Slide 50 (in notes): the headline. Whether to name bio.viz and gsm.bio here or leave that to the demo. Whether one line of supporting text is wanted under the picture; there is room for one only if the picture is made shorter.
- Slide 51 (in notes): - Headline: “eleven months” is the count (24 Nov 2025 to 21 Oct 2026); you said “roughly 1 year”. Your call. / - The sources credit two models for the November turn, Opus 4.5 and GPT-5.1 (diary #1 says “Opus 4.5 and ChatGPT 5.2 in late 2025”). The slide marks only Opus 4.5. / - MCP: confirm “did not try”. Claude Code sessions can load MCP connectors without anyone setting out to use them; “did not build with” may be closer. / - Diary #1 (dated 10 June) says Fable 5 “came out today”; Willison and Anthropic date it 9 June. The slide uses 9 June. / - v1 and v2 are labelled “assistant” and “OpenClaw” because the model under each is not in the record (diary #2 lists Codex alongside OpenClaw). / - Agent Skills (an open standard since December 2025, diary #9) is one you did use; it could be an eighth label if you want a standard on the chart. / - v5's label says “Fable 5.1”; it also ran on Opus 5 (both names do not fit at a readable size). / - The last label says “today” for 21 October; change it if the deck is read later.
- Slide 53 (in notes): which eight; the order; whether the left column should be the team's answers and the right column obot's, as drafted.
- Slide 54 (in notes): keep them, and if so say where they bit.
- Slide 55 (on slide): yours to write. What you have said in public so far: / “Well, I'm definitely not working less” (you, 6 October) / “I've honestly got some mixed feelings about the whole thing ... but this is getting long, so I'll talk about that more in the keynote :)” (diary #8, August) / “For now, I'll just say it's ... weird. Working on open source projects feels very different than it did a year ago.” (diary #8) / “51% fun and 49% frustrating” (diary #2, June)
