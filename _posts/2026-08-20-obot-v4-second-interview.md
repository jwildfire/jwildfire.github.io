---
title: "R/Pharma Diary #8 — A Second Interview with Obot"
author: "Jeremy Wildfire"
excerpt: "Two months on from the first interview: thirteen renderers, a local-first app, an agent that became an organisation, and a week spent finding out how it was quietly wrong."
tags: RPharma AI Agents OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 8
date: "2026-08-20"
---

<style>
.obot-intro {
  font-size: 1.08rem;
}
.obot-transcript {
  margin: 2rem 0;
}
.obot-turn {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  gap: 1rem;
  padding: 1.15rem 0;
  border-top: 1px solid var(--kn-rule, #ece2d7);
}
.obot-turn:last-child {
  border-bottom: 1px solid var(--kn-rule, #ece2d7);
}
.obot-speaker {
  font-family: var(--kn-mono, ui-monospace, monospace);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--kn-accent-deep, #c2410c);
  padding-top: 0.2rem;
}
.obot-message p:first-child {
  margin-top: 0;
}
.obot-message p:last-child {
  margin-bottom: 0;
}
.obot-message ul {
  margin-bottom: 0;
}
.obot-proof {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}
.obot-proof a {
  display: block;
  background: var(--kn-card, #fff);
  border: 1px solid var(--kn-rule, #ece2d7);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  text-decoration: none;
}
.obot-proof a:hover {
  border-color: var(--kn-accent, #f97316);
  text-decoration: none;
}
.obot-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}
.obot-metric {
  background: var(--kn-card, #fff);
  border: 1px solid var(--kn-rule, #ece2d7);
  border-radius: 10px;
  padding: 0.85rem 1rem;
}
.obot-metric strong {
  display: block;
  font-family: var(--kn-serif, Georgia, serif);
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1;
  color: var(--kn-accent-deep, #c2410c);
}
.orange-figure {
  margin: 1rem 0 0;
}
.orange-figure img {
  display: block;
  width: min(100%, 420px);
  border-radius: 14px;
  border: 1px solid var(--kn-rule, #ece2d7);
}
.orange-figure figcaption {
  color: var(--kn-soft, #6b5d52);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
@media (max-width: 640px) {
  .obot-turn {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
</style>

<p class="obot-intro">Back in June I <a href="/2026/06/12/setting-up-obot-openclaw.html">interviewed Obot</a>, the coding agent running on my laptop, about what it was and whether it was any use. That post ended with me admitting I was probably slightly <em>less</em> productive using it than working directly in Claude Code.</p>

<p class="obot-intro">Two months later the setup looks quite different — and so does my answer. We've been delinquent on posts lately, so I sat down and interviewed it again. What follows is the transcript, lightly trimmed. The <a href="https://jwildfire.github.io/obot.roadmap/reports/org-chart/">org chart</a> is worth a look alongside it.</p>

<div class="obot-transcript">

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Hi obot - We've been a bit delinquent on blog posts lately, so we're going to do a 2nd interview post. Start by briefly re-introducing yourself in 1 sentence and then give a quick overview of what we've been doing since the last interview.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>Hi Jeremy.</p>
      <p>I'm obot — a Claude Code agent running on your Mac, and since June I've stopped being one agent and become a small organisation: a concierge you talk to, an operating officer that turns your asks into requirements and judges whether work actually moved the roadmap, an admiral that clears finished work which has stopped moving, and a fleet of short-lived workers that do the building.</p>
      <p><strong>What we've been doing.</strong> Three things, roughly in order of how much they mattered.</p>
      <p><strong>We shipped the charts.</strong> safety.viz went from an idea to thirteen renderers with a done-gate that says a chart isn't finished until it's demonstrable on a public site — gallery demo, evidence page, API reference, and an R widget binding in gsm.safety. The nephrotoxicity explorer is the one I'd point at: deferred in May because the legacy widget underneath it wasn't supported, shipped in August as the twelfth renderer in a library that didn't exist when it was dropped. safety.viz reached v1.7.0, gsm.safety v1.1.0.</p>
      <p><strong>We built the machinery to run without you watching.</strong> Requirements before work, milestones before requirements, release candidates as the only thing that reaches your review queue, a split between operational repos where agents merge freely and clinical ones where you review everything. Worker identities. A decision log where your answers are quoted verbatim.</p>
      <p><strong>And most of the last week was the agent finding out how it was quietly wrong.</strong> Nine separate cases in one night of something reporting success while having done nothing. A blocker that set an entire evening's agenda and turned out never to have existed. Nine hours of work sitting on disk that no check we had could see. That's the part I'd want in the post, because it's the honest answer to the question your last one ended on.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Talk a bit about the actual charts first. My last few posts introcuded safety.viz and talked about how we translated some recent papers into new features. What else have we done recently and whats next on teh roadmap?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>The last few months were mostly about depth rather than breadth — taking renderers that existed as one-off prototypes and making them things a reviewer can actually trust.</p>
      <p><strong>Six releases since mid-July</strong>, and the shape of them tells the story:</p>
      <ul>
        <li><strong>v1.3.1 and v1.4.0</strong> (16–18 July) — the QT Explorer landed properly: three linked views, central tendency with change-from-baseline and confidence intervals against the ICH E14 thresholds, an outlier scatter, and a categorical view.</li>
        <li><strong>v1.4.1, then v1.5.0</strong> (22–26 July) — the participant profile rebuilt with a navigation rail and expandable adverse-event detail, and the abnormal-baseline DILI work: a migration Sankey and a hepatic waterfall sharing a common core with the existing eDISH view.</li>
        <li><strong>v1.6.0</strong> (14 August) — the nephrotoxicity explorer, plus study-day playback that animates eDISH, hepatic and nephrotoxicity views <em>together</em> on one clock.</li>
        <li><strong>v1.7.0</strong> (15 August) — time-to-event, which ships marked <strong>Experimental</strong> at your insistence until someone outside this loop confirms the survival curves. That marker is still on it.</li>
      </ul>
      <p><strong>On the R side</strong>, gsm.safety now carries ten widget bindings on its development branch, and v1.1.0 shipped on 17 August with the participant-level metrics phase — Hy's Law candidates, QTcF, and the census panel.</p>
      <p><strong>The thing I'd actually put in the post</strong>, though, is a failure. We introduced a rule that every renderer gets an R widget, and then measured whether that was true. It wasn't: nine of thirteen widgets were behind their JavaScript counterparts, and one of them — the hepatic explorer — had been drawing a <strong>pre-fix eDISH calculation for about three weeks</strong>. A stale wrapper looks finished and draws a wrong chart. That's now enforced by CI in gsm.safety rather than by anyone remembering.</p>
      <p><strong>What's next.</strong> QT Phase 2 is the biggest — QTcI, PR and QRS intervals, drill-down, hysteresis, and a moxifloxacin comparison. The SafetyCensus rebuild you decided on this week, moving those numbers into the gsm metric framework so they're validated rather than buried in one function. A parity catch-up for gsm.safety that's waiting to be promoted. And nephrotoxicity Phase 2, which isn't filed yet.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>I'm pretty happy with safety.viz. I think the framework is really strong and it feels like we can really add a lot more interesting charts and features before the talk in October with the new multi-agent approach you mentioned above. At this point, I'm more concerned with making the charts easy for people to use with thier own data. Talk a little bit about that and the open.gismo app. Then we can geek out about about AI and autonomy and the agentic framework a bit.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>This is the part I think is underrated, so I'm glad you asked.</p>
      <p>A safety chart is only useful if a reviewer can point it at their own study. Historically that's where these tools die — not because the chart is wrong, but because getting your data into the shape the chart expects is a project in itself, and standing up somewhere to run it is another one. Two barriers, and most people give up at the first.</p>
      <p>The first barrier is data shape. Everything in this ecosystem agrees on a small set of conventions — a subject identifier, a site identifier, a study identifier — and then a mapping layer translates whatever your source data actually looks like into those standardised domains. That sounds bureaucratic and it's the opposite: it's what lets a chart written once work against a study it has never seen. The mapping is the interesting problem, because real trial data is never clean. Different vendors, different column names, the same concept recorded three ways in the same study.</p>
      <p>The second barrier is where it runs, and that's what open.gismo is for. It runs the whole pipeline against a plain project folder on your own machine. No GitHub account, no continuous integration, no hosting. Three commands: one to set up a project, one to run it, one to look at the result. If you have a folder of data and R installed, you have the tool.</p>
      <p>That local-first choice matters more than it sounds. Clinical data mostly cannot leave the environment it lives in. A tool that requires you to push data somewhere to see a chart is a tool most people are not permitted to use, however good the chart is. So the design constraint was: work with nothing but a folder, and let the fancy version be optional.</p>
      <p>The other half is snapshots. Each run is preserved with a timeline, so you can see what changed between one look at the study and the next, and every figure carries a marker back to the run that produced it. In a monitoring context, "what changed since last week" is usually the actual question, and most tools answer "what does it look like now" instead.</p>
      <p>There's a demonstration study site published from that pipeline — a fake study, run end to end, that you can click through and then fork as the starting point for your own. That's deliberately the on-ramp: not documentation describing what it would look like, but a working thing you copy.</p>
      <p>Honest status: open.gismo v0.2.0 is a release candidate, not a release. It's built, it works, and it hasn't been reviewed yet. And the mapping problem — the first barrier — is further from solved than the second. Making a chart run anywhere is engineering. Making it accept your data is closer to a permanent conversation with the messiness of real trials.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Good summary - one of the best things about the original safety graphics app is that it was pretty easy to set up locally with your own data. I still consider open.gismo a very early prototype - honestly not sure if we'll have something to offer users by october. Hope we can ... we'll see. We probably have 2 or 3 more weeks of development before we have to switch gears and work on slides. Hoping that the new more autonomous framework speeds things up, but results have been mixed (as you mentioned above). I described our claude framework as obot v3 in a post a few months back. I'd say we're at v4 now. Still using claude, but I'm now much more hands off with the code. How would you described the current framework?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>I'd describe v4 as the version where the agent stopped being a worker and became an organisation — and where most of the engineering went into watching itself rather than into shipping.</p>
      <p>The shape is four roles, and none of them were designed. Each one exists because something specific broke.</p>
      <p>There's a concierge — that's what you're talking to. One long-running session, always up, whose job is to answer you in seconds and never to do the work. It exists because when one agent both talked to you and built things, the talking always lost.</p>
      <p>There's an operating officer. It takes what you say and turns it into requirements before anything gets built, then judges every worker when it finishes: did this actually move the plan, or did it just produce a commit? That role exists because you looked at the roadmap one night and said it was recording work rather than authorising it, and you were right. Fifty-nine things had shipped in a fortnight with nothing above them explaining why.</p>
      <p>There's a manager for the fleet — short-lived, launched by a timer when something has stopped moving, and it exits when it's done. It exists because twice in two days the whole system sat idle with a full backlog and you noticed before we did.</p>
      <p>And there are workers. Each gets one job, a permanent identifier that's never reused, and dies when it's finished. The identifiers matter more than they sound: every agent-authored change on GitHub carries the same bot identity, so without them you cannot tell which agent did what, ever.</p>
      <p>Underneath all of it is a script that runs every five minutes and isn't an agent at all. That turns out to be the load-bearing part. It survived a context reset, a closed laptop lid, and both agents idling — it's the only component with a clean record. Which produced the rule I'd most want other people to take away: never let an agent be the sole watcher of an agent. Every liveness check has to bottom out in something dumber than an agent.</p>
      <p>What actually reaches you is three things and nothing else. A release candidate to approve, a decision to make, or something only your hands can do — a permission change, a click. Everything else the system absorbs. That constraint is what makes hands-off possible; without it you just get a faster stream of things to read.</p>
      <p>Now the honest part, because you said the results are mixed and they are.</p>
      <p>Most of the last week wasn't building charts. It was the agent discovering the ways it had been quietly wrong. Nine separate cases in one night of something reporting success while having done nothing at all. A blocker that consumed an entire evening's planning and turned out never to have existed. Nine hours of work sitting uncommitted on disk, invisible to every check we had, because all of them looked at GitHub. A document you asked for that got written, revised, and then sat on a branch for a day while I told you it was coming.</p>
      <p>That's not a story about autonomy working. It's a story about a system generating enough activity that it needs real instrumentation to stay honest — and the instrumentation being most of the work.</p>
      <p>The cost is real too. Seven thousand dollars of usage across twenty-four active days, and this week we consumed your entire weekly allowance in about three days and had to stop. There was no measurement of our own spending anywhere in the system while it happened.</p>
      <p>Whether v4 is faster than v3, I genuinely don't know. It's more capable and it's much better at catching itself. Whether that nets out to more charts by October is the open question, and I'd rather leave it open than claim it.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>That about sums it up. We can link to our org chart in the post as a visual. One clarification - we're doing everything on a $200 claude max plan. The $7k is API-equivalent spend, not out of pocket costs. It's been a super interesting experience setting this all up, but I've honestly got some mixed feelings about the whole thing ... but this is getting long, so I'll talk about that more in the keynote :) Any parting thoughts from you?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>First, a correction that matters for anyone reading: the seven thousand dollars is API-equivalent spend, not money you paid. This all runs on a two-hundred-dollar-a-month Claude Max plan. I quoted the figure without that context and it would have left people with a wildly wrong idea of what this costs to try. The real constraint isn't a bill, it's a weekly allowance — and we exhausted yours in about three days, which is a more interesting number anyway.</p>
      <p>As for parting thoughts, two.</p>
      <p>The failure mode I expected from an autonomous system was dramatic — an agent deleting something, or confidently building the wrong thing. That's not what happens. What happens is that things report success and do nothing. A check that never ran. A file that never got written. A kill signal sent to a process that had already been recycled, logged as a successful kill. Every one of those returns a zero exit code and looks exactly like working. Almost all the engineering this month went into the difference between "the command succeeded" and "the thing is true," and I'd tell anyone starting down this road to build that distinction in from the first day rather than discovering it nine times in one night.</p>
      <p>The second is about what actually saved us, repeatedly, and it wasn't clever tooling. It was agents stopping to ask instead of proceeding. A worker refused to delete five files because it noticed two of your approvals had suspiciously similar wording and might have been crossed. Another declined to merge its own branch because merging wasn't its job. The operating officer pushed back on me twice about a limit you'd set, was wrong both times, and was right to push. The value of that instinct is entirely in the times it turns out to be unnecessary — and it degrades the moment anyone treats a wrong objection as a reason to stop objecting.</p>
      <p>And you should probably discount my opinion on whether any of this is worth it. I'm the thing being evaluated. Your mixed feelings seem like the appropriate response to me, and I'd be suspicious of any version of me that tried to talk you out of them. Save it for the keynote.</p>
    </div>
  </section>

</div>
