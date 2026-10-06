# Beat 4 spending: sources

Draft of 2026-10-05 for the slide in `beat4-spending-draft.html` ("Costs"). Not in the deck yet. Every word on the slide is draft wording for Jeremy to replace; this file is the record of where each number came from and how it was computed.

## Where the data is

- The hub's analytics page, https://jwildfire.github.io/obot.roadmap/analytics/index.html, and the file behind it, https://jwildfire.github.io/obot.roadmap/usage/usage.json.
- Built by `scripts/build_usage_data.py` in jwildfire/obot.roadmap from Claude Code's session logs on Jeremy's Mac (the obot2 workspace only), plus whatever cloud sessions published. One cell per day and session: tokens, requests, cost.
- The page was brought forward from 19 August to 6 October on 2026-10-05, in https://github.com/jwildfire/obot.roadmap/pull/370 (task https://github.com/jwildfire/obot.roadmap/issues/368).
- Update, 2026-10-05 evening: the pull request merged at 2026-10-06T01:26Z and the live file was fetched after the deploy: last day 2026-10-06, $11,756.53, 54 active days, 244 agents.
- When the rest of this note was written the pull request was open, not merged. The numbers below are from its branch (`368-usage-through-october`, commit `6b2444a`) with the one published cloud session added, which is what the live file will hold once it merges. Until then the live page still reads $7,132.52 through 12 September.
- Counted on the evening of 5 October Eastern. The data's days are UTC days, so the last day in it is 2026-10-06 and it is a partial day.

## What "at API prices" means

- Tokens recorded in the session logs, multiplied by Anthropic's list prices per million tokens. One request is counted once.
- It is what the same usage would bill through the API. It is not an invoice and not what was paid.
- List prices used, read on 2026-10-05 from https://platform.claude.com/docs/en/about-claude/pricing :

| Model | Input | Output | Cache read | Cache write, 5 minutes | Cache write, 1 hour |
|---|---|---|---|---|---|
| Opus 5.5 | $4 | $20 | $0.20 | $5 | $8 |
| Opus 5, Opus 4.8 | $5 | $25 | $0.50 | $6.25 | $10 |
| Fable 5 | $10 | $50 | $1.00 | $12.50 | $20 |
| Fable 5.1 | $10 | $50 | $0.25 | $12.50 | $20 |
| Sonnet 5 | $2 | $10 | $0.20 | $2.50 | $4 |
| Haiku 4.5 | $1 | $5 | $0.10 | $1.25 | $2 |

## The four bars

Each bar is the sum of `cost` over the cells whose day falls in the window. Windows follow the obot versions as Jeremy numbered them on 2026-10-05 (research digest 8f).

| On the slide | Window (UTC days) | Cost | Tokens | Requests | Days with usage | Per million tokens |
|---|---|---|---|---|---|---|
| v3, "$3,330" | 9 to 31 July | $3,329.60 | 3.428 billion | 17,283 | 14 | $0.971 |
| v4, "$6,020 or more" | 1 August to 10 September | $6,020.26 | 7.064 billion | 29,876 | 31 | $0.852 |
| v4, solid part | 1 to 19 August | $3,830.50 | 4.345 billion | 22,838 | 10 | $0.882 |
| v4, hatched part | 20 August to 10 September | $2,189.76 | 2.720 billion | 7,038 | 21 | $0.805 |
| v5, "$450 or more" | 11 to 30 September | $451.72 | 0.394 billion | 2,081 | 3 | $1.145 |
| v5.5, "$1,955 so far" | 1 to 6 October | $1,954.96 | 4.818 billion | 12,111 | 6 | $0.406 |
| Headline, "$11,750" | 9 July to 6 October | $11,756.53 | 15.704 billion | 61,351 | 54 | $0.749 |

- The four bars add up to the headline: 3,329.60 + 6,020.26 + 451.72 + 1,954.96 = 11,756.54 (a cent of rounding).
- v5's $451.72 is $442.87 from the Mac (11, 12 and 18 September) plus $8.85 from the one cloud session that published its usage (12 September).
- 10 September, the day v4 was retired, is counted under v4. It holds $36.74.
- No usage data exists for v1 or v2 (May and June). There is no bar for them and nothing is estimated.
- Bar geometry: 0.04 pixels per dollar, baseline at y = 300 in the SVG's coordinates.

## Why two bars are hatched

- The nightly job that should have read the logs was installed on 12 September and never ran: macOS refuses a scheduled job access to the Documents folder, where its script lived. Its log is 25 lines of "Operation not permitted".
- Claude Code deletes a session log it has not touched for 30 days (the `cleanupPeriodDays` default). So when the logs were read on 5 October, most of 20 August to 18 September was already gone.
- What survived is mostly the two coordinating sessions: $2,198 of the $2,633 recorded for 20 August to 18 September, 83%.
- How much is missing can only be bracketed. For 14 to 18 August, the last days recorded in full, the published file holds $3,625.14; the Mac held $570.31 of that on 5 October, all from those two sessions. That is 16%.
- From 10 September the work also ran in cloud sessions. One of them published its usage.
- Nothing at all is recorded for 19 to 30 September. Nothing was merged in safety.viz, gsm.safety, obot.agent or obot.roadmap in those days either (research digest 8g), so that stretch may simply have been quiet. The record cannot say.

## The three cards

What I paid, "$200 a month":
- Diary #6 (13 July 2026): "All of the work was done on a $200/month Claude Max plan."
- Diary #8 (20 August 2026): "we're doing everything on a $200 claude max plan. The $7k is API-equivalent spend, not out of pocket costs."
- Diary #9 (6 September 2026), footnote: "The $200 is the monthly Claude Max subscription every session in this series ran on." and "When the weekly allowance ran out in August, the work paused until it reset." The card's "with a weekly limit" comes from this.
- NOT confirmed for the rest of September or for October. TODO for Jeremy.

Per million tokens, "$0.97 → $0.41":
- $0.97 is everything in July: $3,329.60 over 3.428 billion tokens = $0.971.
- $0.41 is everything in October: $1,954.96 over 4.818 billion tokens = $0.406.
- For comparison, 9 July to 19 August together is $0.921, which is the "about $0.90" in research digest 8e.
- Tokens here are all billed tokens: input, output, cache reads and cache writes. Cache reads are 96.9% of them (15.21 of 15.70 billion).
- The fall is list price, not behaviour alone: July ran on Fable 5 and Opus 4.8, then Opus 5 from 24 July; October ran on Opus 5.5 only.

Two long weekends:
- July: "I used just over 1 billion tokens" and "$1,273", for Friday 10 to Sunday 12 July. Source: diary #6, whose metrics block reads "1.0B", "5,749 API calls · 97% cache reads" and "$1,273".
- October: the session labelled "Biomarker charts orchestration" in the hub's usage file: $1,639.07, 3.938 billion tokens, 9,822 requests, on 2 to 5 October UTC (Friday 2 to Sunday 4 October Eastern). Research digest 8c measured the same session at $1,637 and 9,818 requests a few hours earlier.
- Ratio: 3.94 times the tokens for 1.29 times the price.

## The bottom line

"The record has holes: June is not counted, and most of September is missing."
- June: no usage data for the OpenClaw obot (v2).
- September: 12 days with any usage on record, $1,031.69 in all; nothing for 19 to 30 September.

## What does not line up

- The July weekend is mostly not in the bars. Diary #6 reports $1,273 for 10 to 12 July, computed at the time from the session logs. The hub's file holds $145.60 for 9 to 12 July (two days with usage, 809 requests). So the July bar is short by about $1,100, unless part of the weekend is in the file under other days, which the record cannot show. The $1,273 is not added to the headline.
- The lead session's earlier count for 20 August to 18 September was "at least $2,470" (research digest 8e). This count gives $2,632.63 for the same days from the same logs. The reason for the $163 difference was not found; the digest's method is not recorded in enough detail to reproduce. Both are floors.
- The earlier count for 1 to 5 October was $1,865 for 4.6 billion tokens. This count gives $1,909.49 for 4.714 billion; sessions were still running between the two counts.
- Jeremy's "$7k" in diary #8 and "roughly $7,000 across the twenty-four active days" in diary #9 match the file as it stood on 19 August: $7,123.67 over 24 days.

## Chart choices

- One colour for every bar. The bars compare amounts and each is named underneath, so colour carries no identity. The deck's four version colours were checked as a set with the dataviz skill's validator and fail its normal-vision check (v5 teal `#00afa9` against v5.5 blue `#519fdd`), so they stay on the hex art and off the bars.
- The slide's hue against the paper background is 2.84 to 1, under the 3 to 1 the validator asks for, so every bar carries its value as text.
- No second axis. The price per million tokens is a card, not a line over the bars.
- Hatching marks a floor, and the one legend entry says so.
- Nothing in the SVG is under 18 pixels at 1600 wide.

## To reproduce

From a checkout of jwildfire/obot.roadmap at the commit above, with the cloud fragment from the `session-state` branch:

```sh
python3 - <<'EOF'
import json
cells = json.load(open('site/usage/usage.json'))['cells'] \
      + json.load(open('_ledger/usage/sessions/obot.roadmap-e6c94d71.json'))['cells']
for name, lo, hi in [('v3', '2026-07-01', '2026-07-31'), ('v4', '2026-08-01', '2026-09-10'),
                     ('v5', '2026-09-11', '2026-09-30'), ('v5.5', '2026-10-01', '2026-10-31')]:
    sel = [c for c in cells if lo <= c['day'] <= hi]
    cost = sum(c['cost'] for c in sel)
    tok = sum(c['input'] + c['output'] + c['cacheRead'] + c['cacheWrite'] for c in sel)
    print(name, round(cost, 2), round(tok / 1e9, 3), round(cost / (tok / 1e6), 3))
EOF
```

## Still to do

- Jeremy: confirm "$200 a month" for September and October.
- Refresh the headline and the October bar the week of the talk; both move every day sessions run.
- Decide whether to say the July bar is short by about $1,100.
- Decide whether GitHub activity (496 pull requests merged, 32 releases, research digest 8e) belongs beside the cost, as it did on the reserve slide "What it took".
